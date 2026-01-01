
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Hotel, Room, Booking } from '../types';
import { HOTELS, BOOKINGS as STATIC_BOOKINGS } from '../constants';
import { useNotification } from './NotificationProvider';

const API_URL = 'https://sandybrown-parrot-500490.hostingersite.com/api.php'; 

interface BookingDetails {
    hotel: Hotel | null;
    room: Room | null;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
}

interface BookingContextType {
    bookings: Booking[];
    bookingDetails: BookingDetails;
    setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;
    addBooking: (booking: Omit<Booking, 'id' | 'status'>, type?: 'customer' | 'agent-assigned') => Promise<Booking>;
    updateBooking: (updatedBooking: Booking) => void;
    updateBookingStatusAndNotify: (bookingId: string, status: Booking['status']) => Promise<void>;
    deleteBookings: (bookingIds: string[]) => void;
    isBookingModalOpen: boolean;
    openBookingModal: (hotel: Hotel, room: Room) => void;
    closeBookingModal: () => void;
    requestCancellation: (bookingId: string) => void;
    requestDateChange: (bookingId: string, newCheckIn: string, newCheckOut: string, newTotalPrice: number) => void;
    approveChangeRequest: (bookingId: string) => void;
    rejectChangeRequest: (bookingId: string) => void;
    refreshData: () => Promise<void>;
}

const defaultBookingState: BookingDetails = {
    hotel: null, room: null, checkInDate: '', checkOutDate: '', totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const mapApiBookingToLocal = (apiBooking: any): Booking | null => {
    // Use loose equality (==) to handle potential type differences (number vs string) between JS and the API response.
    const hotel = HOTELS.find(h => h.id == apiBooking.hotel_id);
    if (!hotel) {
        console.error(`[mapApiBookingToLocal] Hotel not found in constants for hotel_id: ${apiBooking.hotel_id}`);
        return null;
    }
    const room = hotel.rooms.find(r => r.id === apiBooking.room_id);
    if (!room) {
        console.error(`[mapApiBookingToLocal] Room not found in constants for room_id: ${apiBooking.room_id} in hotel ${hotel.name}`);
        return null;
    }

    return {
        id: apiBooking.id,
        hotel,
        room,
        guestName: apiBooking.guest_name,
        guestEmail: apiBooking.guest_email,
        contactNumber: apiBooking.contact_number,
        checkInDate: apiBooking.check_in_date,
        checkOutDate: apiBooking.check_out_date,
        totalPrice: parseFloat(apiBooking.total_price),
        status: apiBooking.status,
        paymentMethod: apiBooking.payment_method,
        bookingType: apiBooking.booking_type,
        customerId: apiBooking.customer_id,
        promoCodeApplied: apiBooking.promo_code_applied,
    };
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { sendNotification } = useNotification();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingState);
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}?endpoint=bookings`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const mappedBookings = data.map(mapApiBookingToLocal).filter((b: Booking | null): b is Booking => b !== null);
            setBookings(mappedBookings);
        } catch (error) {
            console.error("Failed to fetch bookings, falling back to static data:", error);
            setBookings(STATIC_BOOKINGS);
            throw error;
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchBookings().finally(() => setIsLoading(false));
    }, [fetchBookings]);

    const addBooking = async (bookingData: Omit<Booking, 'id' | 'status'>, type: 'customer' | 'agent-assigned' = 'customer'): Promise<Booking> => {
        if (type === 'agent-assigned') { // Agent bookings are local-only for now
            const newBooking: Booking = {
                ...bookingData,
                id: `BK-AGENT-${Date.now()}`,
                status: 'Confirmed',
                bookingType: 'agent-assigned',
            };
            setBookings(prev => [newBooking, ...prev]);
            return newBooking;
        }

        const apiPayload = {
            hotel_id: bookingData.hotel.id,
            room_id: bookingData.room.id,
            guest_name: bookingData.guestName,
            guest_email: bookingData.guestEmail,
            contact_number: bookingData.contactNumber,
            check_in_date: bookingData.checkInDate,
            check_out_date: bookingData.checkOutDate,
            total_price: bookingData.totalPrice,
            payment_method: bookingData.paymentMethod,
            promo_code_applied: bookingData.promoCodeApplied || null,
            booking_type: type,
            customer_id: bookingData.customerId || null,
        };

        try {
            const response = await fetch(`${API_URL}?endpoint=bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload)
            });

            const savedBookingData = await response.json();
            if (!response.ok) throw new Error(savedBookingData.error || "Failed to save booking");

            const newBooking = mapApiBookingToLocal(savedBookingData);
            if(newBooking) {
                setBookings(prev => [newBooking, ...prev]);
                return newBooking;
            } else {
                throw new Error("Failed to map API response to local booking format.");
            }
        } catch (error) {
            console.error("Error adding booking:", error);
            throw error;
        }
    };
    
    const updateBookingStatusAndNotify = async (bookingId: string, status: Booking['status']) => {
        const originalBookings = [...bookings];
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));

        try {
            const response = await fetch(`${API_URL}?endpoint=bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update status');

            const booking = originalBookings.find(b => b.id === bookingId);
            if (booking) {
                if (status === 'Confirmed') {
                    sendNotification({ to: booking.guestEmail, subject: `Booking Confirmed: ${booking.id}`, body: `...` });
                } else if (status === 'Cancelled') {
                    sendNotification({ to: booking.guestEmail, subject: `Booking Cancelled: ${booking.id}`, body: `...` });
                }
            }
        } catch (error) {
            console.error("Failed to update booking status:", error);
            setBookings(originalBookings); // Rollback on error
            throw error;
        }
    };
    
    // Local-only state updates
    const updateBooking = (updatedBooking: Booking) => setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    const deleteBookings = (bookingIds: string[]) => setBookings(prev => prev.filter(b => !bookingIds.includes(b.id)));
    const requestCancellation = (bookingId: string) => setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancellation Requested' } : b));
    const requestDateChange = (bookingId: string, newCheckIn: string, newCheckOut: string) => setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Date Change Requested', requestedCheckInDate: newCheckIn, requestedCheckOutDate: newCheckOut } : b));
    const approveChangeRequest = (bookingId: string) => updateBookingStatusAndNotify(bookingId, 'Confirmed');
    const rejectChangeRequest = (bookingId: string) => updateBookingStatusAndNotify(bookingId, 'Confirmed');

    const openBookingModal = (hotel: Hotel, room: Room) => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingDetails({ hotel, room, checkInDate: today, checkOutDate: tomorrow.toISOString().split('T')[0], totalPrice: room.customerPricePerNight });
        setBookingModalOpen(true);
    };

    const closeBookingModal = () => setBookingModalOpen(false);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><p className="text-xl font-semibold text-primary">Loading Booking Data...</p></div>;

    return (
        <BookingContext.Provider value={{
            bookings, bookingDetails, setBookingDetails, addBooking, updateBooking, 
            updateBookingStatusAndNotify, deleteBookings, isBookingModalOpen, openBookingModal, 
            closeBookingModal, requestCancellation, requestDateChange, approveChangeRequest, 
            rejectChangeRequest, refreshData: fetchBookings,
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};
