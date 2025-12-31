
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Hotel, Room, Booking } from '../types';
import { HOTELS, BOOKINGS } from '../constants'; // Keep constants for fallback/initial data

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
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
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
    hotel: null,
    room: null,
    checkInDate: '',
    checkOutDate: '',
    totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const mapDbRowToBooking = (row: any): Booking => {
    const hotel = HOTELS.find(h => h.id === parseInt(row.hotel_id, 10));
    const room = hotel?.rooms.find(r => r.id === row.room_id);

    return {
        id: row.id,
        hotel: hotel || HOTELS[0],
        room: room || HOTELS[0].rooms[0],
        guestName: row.guest_name,
        guestEmail: row.guest_email,
        contactNumber: row.contact_number,
        checkInDate: row.check_in_date,
        checkOutDate: row.check_out_date,
        totalPrice: parseFloat(row.total_price),
        status: row.status,
        paymentMethod: row.payment_method,
        promoCodeApplied: row.promo_code_applied,
        showPriceOnVoucher: Boolean(parseInt(row.show_price_on_voucher, 10)),
        bookingType: row.booking_type,
    };
};


export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBookingState);
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        // No need to set isLoading here for refreshes, only for initial load.
        // The component calling refresh can manage its own loading state.
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Network response was not ok`);
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const serverBookings = data.map(mapDbRowToBooking);
            const localBookingsJSON = localStorage.getItem('bookings');
            const localBookings = localBookingsJSON ? JSON.parse(localBookingsJSON) : [];

            const combined = [...serverBookings];
            localBookings.forEach((localBooking: Booking) => {
                const index = combined.findIndex(b => b.id === localBooking.id);
                if (index > -1) {
                    combined[index] = localBooking; 
                } else {
                    if(localBooking.agentDetails) combined.unshift(localBooking);
                }
            });

            setBookings(combined);

        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            const savedBookings = localStorage.getItem('bookings');
            if (savedBookings) {
                console.warn("API fetch failed. Loading data from local storage.");
                setBookings(JSON.parse(savedBookings));
            } else {
                console.warn("No local data found. Falling back to static data.");
                setBookings(BOOKINGS);
            }
            // re-throw to be caught by the calling component
            throw error; 
        }
    }, []);

    useEffect(() => {
        const initialFetch = async () => {
            setIsLoading(true);
            await fetchBookings().catch(() => {}); // catch errors on initial load
            setIsLoading(false);
        }
        initialFetch();
    }, [fetchBookings]);
    
    // Persist any changes to bookings to localStorage
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('bookings', JSON.stringify(bookings));
        }
    }, [bookings, isLoading]);


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
        setBookings(prev => [newBooking, ...prev]);
        try {
            if (type !== 'agent-assigned') {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBooking),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Failed to save booking and parse error response.' }));
                    throw new Error(errorData.error || 'Failed to save booking to the database.');
                }
            }
            return newBooking;
        } catch (error) {
            console.error("Error saving booking:", error);
            setBookings(prev => prev.filter(b => b.id !== newBooking.id));
            throw error;
        }
    };
    
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
        return (
             <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-primary">Connecting to Database...</p>
                    <p className="text-gray-500">Please wait a moment.</p>
                </div>
            </div>
        );
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
            rejectChangeRequest,
            refreshData: fetchBookings,
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
