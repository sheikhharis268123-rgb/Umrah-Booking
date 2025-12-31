
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Hotel, Room, Booking } from '../types';
import { HOTELS, BOOKINGS } from '../constants'; // Keep constants for fallback/initial data

const API_URL = '/api.php'; // Assumes api.php is in the public_html root

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
    addBooking: (booking: Omit<Booking, 'id' | 'status'>, type?: 'customer' | 'agent-assigned') => Promise<Booking>; // Now returns a Promise
    updateBooking: (updatedBooking: Booking) => void;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    deleteBookings: (bookingIds: string[]) => void;
    isBookingModalOpen: boolean;
    openBookingModal: (hotel: Hotel, room: Room) => void;
    closeBookingModal: () => void;
    requestCancellation: (bookingId: string) => void;
    requestDateChange: (bookingId: string, newCheckIn: string, newCheckOut: string, newTotalPrice: number) => void;
    approveChangeRequest: (bookingId: string) => void;
    rejectChangeRequest: (bookingId: string) => void;
}

const defaultBookingState: BookingDetails = {
    hotel: null,
    room: null,
    checkInDate: '',
    checkOutDate: '',
    totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to map DB fields back to JS object structure
const mapDbRowToBooking = (row: any): Booking => {
    const hotel = HOTELS.find(h => h.id === row.hotel_id);
    const room = hotel?.rooms.find(r => r.id === row.room_id);

    return {
        id: row.id,
        hotel: hotel || HOTELS[0], // Fallback
        room: room || HOTELS[0].rooms[0], // Fallback
        guestName: row.guest_name,
        guestEmail: row.guest_email,
        contactNumber: row.contact_number,
        checkInDate: row.check_in_date,
        checkOutDate: row.check_out_date,
        totalPrice: row.total_price,
        status: row.status,
        paymentMethod: row.payment_method,
        promoCodeApplied: row.promo_code_applied,
        showPriceOnVoucher: row.show_price_on_voucher,
        bookingType: row.booking_type,
        // agentDetails would require another lookup if needed
    };
};


export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingState);
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    // Fetch initial bookings from the database
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const mappedData = data.map(mapDbRowToBooking);
                setBookings(mappedData);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
                // Fallback to constants if API fails
                setBookings(BOOKINGS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const openBookingModal = (hotel: Hotel, room: Room) => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        setBookingDetails({ hotel, room, checkInDate: today, checkOutDate: tomorrowStr, totalPrice: room.customerPricePerNight });
        setBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setBookingDetails(defaultBookingState);
        setBookingModalOpen(false);
    };

    const addBooking = async (bookingData: Omit<Booking, 'id' | 'status'>, type: 'customer' | 'agent-assigned' = 'customer'): Promise<Booking> => {
        const newBooking: Booking = {
            ...bookingData,
            id: `BK${Math.floor(Math.random() * 90000) + 10000}`,
            status: type === 'agent-assigned' ? 'Confirmed' : 'Pending',
            bookingType: type,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBooking),
            });

            if (!response.ok) {
                throw new Error('Failed to save booking to the database.');
            }

            // Update state only after successful API call
            setBookings(prev => [newBooking, ...prev]);
            return newBooking;

        } catch (error) {
            console.error("Error saving booking:", error);
            // Optionally, handle the error (e.g., show a toast message)
            // For now, we throw it so the caller can handle it.
            throw error;
        }
    };
    
    // NOTE: The functions below still only modify local state.
    // A full implementation would require them to make API calls as well.
    const updateBooking = (updatedBooking: Booking) => {
        setBookings(prev =>
            prev.map(booking =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            )
        );
    };

    const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
        setBookings(prev => 
            prev.map(booking => 
                booking.id === bookingId ? { ...booking, status } : booking
            )
        );
    };

    const deleteBookings = (bookingIds: string[]) => {
        setBookings(prev => prev.filter(booking => !bookingIds.includes(booking.id)));
    };

    const requestCancellation = (bookingId: string) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancellation Requested' } : b));
    };

    const requestDateChange = (bookingId: string, newCheckIn: string, newCheckOut: string, newTotalPrice: number) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? {
            ...b,
            status: 'Date Change Requested',
            requestedCheckInDate: newCheckIn,
            requestedCheckOutDate: newCheckOut,
        } : b));
    };
    
    const approveChangeRequest = (bookingId: string) => {
        setBookings(prev => prev.map(b => {
            if (b.id === bookingId) {
                if (b.status === 'Date Change Requested' && b.requestedCheckInDate && b.requestedCheckOutDate) {
                    const nights = (new Date(b.requestedCheckOutDate).getTime() - new Date(b.requestedCheckInDate).getTime()) / (1000 * 3600 * 24);
                    const oldNights = (new Date(b.checkOutDate).getTime() - new Date(b.checkInDate).getTime()) / (1000 * 3600 * 24);
                    const pricePerNight = oldNights > 0 ? b.totalPrice / oldNights : b.room.customerPricePerNight;
                    const newPrice = nights * pricePerNight;
                    
                    return { ...b, status: 'Confirmed', checkInDate: b.requestedCheckInDate, checkOutDate: b.requestedCheckOutDate, totalPrice: newPrice, requestedCheckInDate: undefined, requestedCheckOutDate: undefined };
                }
                if (b.status === 'Cancellation Requested') {
                    return { ...b, status: 'Cancelled' };
                }
            }
            return b;
        }));
    };
    
    const rejectChangeRequest = (bookingId: string) => {
        setBookings(prev => prev.map(b => {
            if (b.id === bookingId && (b.status === 'Date Change Requested' || b.status === 'Cancellation Requested')) {
                return { ...b, status: 'Confirmed', requestedCheckInDate: undefined, requestedCheckOutDate: undefined };
            }
            return b;
        }));
    };

    if (isLoading) {
        return <div>Loading bookings...</div>;
    }


    return (
        <BookingContext.Provider value={{
            bookings,
            bookingDetails,
            setBookingDetails,
            addBooking,
            updateBooking,
            updateBookingStatus,
            deleteBookings,
            isBookingModalOpen,
            openBookingModal,
            closeBookingModal,
            requestCancellation,
            requestDateChange,
            approveChangeRequest,
            rejectChangeRequest
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
