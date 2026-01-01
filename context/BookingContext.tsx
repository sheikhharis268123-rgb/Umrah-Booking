import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Hotel, Room, Booking } from '../types';
import { BOOKINGS as STATIC_BOOKINGS } from '../constants';
import { useNotification } from './NotificationProvider';
import { useHotels } from './HotelContext';
import { getApiUrl } from '../apiConfig';

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

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { sendNotification } = useNotification();
    const { hotels: dynamicHotels } = useHotels();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingState);
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    const mapApiBookingToLocal = useCallback((apiBooking: any): Booking | null => {
        const hotel = dynamicHotels.find(h => h.id == apiBooking.hotel_id);
        if (!hotel) {
            console.error(`[mapApiBookingToLocal] Hotel not found for hotel_id: ${apiBooking.hotel_id}`);
            return null;
        }
        
        const room = hotel.rooms.find(r => {
            const apiRoomIdStr = String(apiBooking.room_id);
            // Case 1: The room ID from API is the full string '1-1' (for old data)
            if (r.id === apiRoomIdStr) {
                return true;
            }
            // Case 2: The room ID from API is just the integer part '1'
            // We check that the room's ID starts with the hotel's ID and ends with the API's room ID.
            // This is a robust way to find "1-1" when given hotel=1 and room=1.
            const localRoomIdParts = r.id.split('-');
            if (localRoomIdParts.length === 2 && 
                localRoomIdParts[0] === String(hotel.id) && 
                localRoomIdParts[1] === apiRoomIdStr) {
                return true;
            }
            return false;
        });

        if (!room) {
            console.error(`[mapApiBookingToLocal] Room not found for room_id: ${apiBooking.room_id} in hotel ${hotel.name}`);
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
            customerId: apiBooking.customer_id ? String(apiBooking.customer_id) : undefined,
            promoCodeApplied: apiBooking.promo_code_applied,
            requestedCheckInDate: apiBooking.requested_check_in_date || undefined,
            requestedCheckOutDate: apiBooking.requested_check_out_date || undefined,
            requestedTotalPrice: apiBooking.requested_total_price ? parseFloat(apiBooking.requested_total_price) : undefined,
        };
    }, [dynamicHotels]);


    const fetchBookings = useCallback(async () => {
        if (dynamicHotels.length === 0) {
            // Wait for hotels to be loaded before fetching bookings
            return;
        }
        try {
            const response = await fetch(getApiUrl('bookings'));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const mappedBookings = data.map(mapApiBookingToLocal).filter((b: Booking | null): b is Booking => b !== null);
            setBookings(mappedBookings);
        } catch (error) {
            console.error("Failed to fetch bookings, falling back to static data:", error);
            // Fallback to static data only if API fails and hotels are also missing.
            if(dynamicHotels.length === 0) {
                setBookings(STATIC_BOOKINGS);
            }
        }
    }, [dynamicHotels, mapApiBookingToLocal]);

    useEffect(() => {
        setIsLoading(true);
        fetchBookings().finally(() => setIsLoading(false));
    }, [fetchBookings]);

    const addBooking = async (bookingData: Omit<Booking, 'id' | 'status'>, type: 'customer' | 'agent-assigned' = 'customer'): Promise<Booking> => {
        // FIX: Extract the numeric part of the room ID to send to the backend, which expects an integer.
        const roomIdInt = parseInt(String(bookingData.room.id).split('-').pop() || '0');

        const apiPayload: any = {
            hotel_id: bookingData.hotel.id,
            room_id: roomIdInt,
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
        
        if (type === 'agent-assigned' && bookingData.agentDetails) {
            apiPayload.agent_id = bookingData.agentDetails.agencyId;
            apiPayload.show_price_on_voucher = bookingData.showPriceOnVoucher;
        }

        try {
            const response = await fetch(getApiUrl('bookings'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload)
            });

            if (!response.ok) {
                let errorMsg = `Server error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.error("API Error Response (JSON):", errorData);
                    errorMsg = errorData.error || `Failed to save booking. Server returned: ${response.status}`;
                } catch (e) {
                    const errorText = await response.text();
                    console.error("API Error Response (Non-JSON):", errorText);
                    errorMsg = "An unexpected server error occurred. Please check the console for details.";
                }
                throw new Error(errorMsg);
            }

            const savedBookingData = await response.json();
            const newBooking = mapApiBookingToLocal(savedBookingData);

            if (newBooking) {
                setBookings(prev => [newBooking, ...prev]);
                return newBooking;
            } else {
                throw new Error("Failed to map API response to local booking format. This may be due to outdated hotel data.");
            }
        } catch (error) {
            console.error("Error adding booking:", error);
            throw error;
        }
    };
    
    const updateBookingStatusAndNotify = async (bookingId: string, status: Booking['status']) => {
        const originalBookings = [...bookings];
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));

        try {
            const response = await fetch(getApiUrl('updateBookingStatus'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: bookingId, status: status })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update status');

            const updatedBooking = mapApiBookingToLocal(data);
            if (updatedBooking) {
                setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
            }

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
            setBookings(originalBookings);
            throw error;
        }
    };
    
    const updateBooking = (updatedBooking: Booking) => setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    const deleteBookings = (bookingIds: string[]) => setBookings(prev => prev.filter(b => !bookingIds.includes(b.id)));
    
    const requestCancellation = (bookingId: string) => updateBookingStatusAndNotify(bookingId, 'Cancellation Requested');

    const requestDateChange = (bookingId: string, newCheckIn: string, newCheckOut: string, newTotalPrice: number) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Date Change Requested', requestedCheckInDate: newCheckIn, requestedCheckOutDate: newCheckOut, requestedTotalPrice: newTotalPrice } : b));
    };

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