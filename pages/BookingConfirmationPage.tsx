

import React, { useEffect, useMemo } from 'react';
// Fix: Use useHistory instead of useNavigate for react-router-dom v5 compatibility.
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { Booking } from '../types';

const BookingConfirmationPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { bookings } = useBooking();
    const { convertPrice } = useCurrency();
    // Fix: Use useHistory instead of useNavigate.
    const history = useHistory();
    const location = useLocation();

    // Prioritize booking data passed directly via navigation state to avoid race conditions.
    // Fallback to searching the global bookings list.
    const newBookingFromState = (location.state as { booking: Booking })?.booking;
    const userRole = (location.state as { userRole?: 'agent' | 'customer' })?.userRole;
    const currentBooking = useMemo(() => newBookingFromState || bookings.find(b => b.id === bookingId), [newBookingFromState, bookings, bookingId]);
    
    const homeLink = userRole === 'agent' ? '/agent' : '/';
    const myBookingsLink = userRole === 'agent' ? '/agent/my-bookings' : '/my-bookings';


    useEffect(() => {
        window.scrollTo(0, 0);
        // If booking data isn't available immediately or after context updates, redirect home.
        if (!currentBooking) {
            const timer = setTimeout(() => {
                if (!bookings.find(b => b.id === bookingId)) {
                    // Fix: Use history.push instead of navigate.
                    history.push('/');
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentBooking, bookings, bookingId, history]);

    if (!currentBooking) {
        return (
             <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-primary">Loading Booking Details...</h2>
                </div>
            </div>
        );
    }
    
    const { id, hotel, room, guestName, checkInDate, checkOutDate, totalPrice, status } = currentBooking;

    const isConfirmed = status === 'Confirmed';

    return (
        <>
            <Header title={isConfirmed ? "Booking Confirmed" : "Booking Received"} />
            <main className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isConfirmed ? 'bg-green-100' : 'bg-yellow-100'} mb-4`}>
                            {isConfirmed ? (
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-primary mb-2">{isConfirmed ? 'Booking Confirmed!' : 'Booking Received!'}</h1>
                        <p className="text-gray-600 mb-6">
                            {isConfirmed 
                                ? `Thank you, ${guestName || 'Valued Customer'}. Your booking is complete. A confirmation email has been sent.`
                                : `Thank you, ${guestName || 'Valued Customer'}. Your booking request is pending approval. You will receive an email once it's confirmed.`
                            }
                        </p>
                        
                        <div className="text-left border-t border-b py-6 space-y-4">
                            <p><strong>Booking ID:</strong> <span className="font-mono text-secondary">{id}</span></p>
                            <h2 className="text-xl font-semibold text-primary border-t pt-4 mt-4">{hotel?.name || 'Hotel details missing'}</h2>
                            <p><strong>Room:</strong> {room?.type || 'N/A'}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Check-in:</strong> {checkInDate ? new Date(checkInDate).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Check-out:</strong> {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <p className="text-2xl font-bold text-right border-t pt-4 mt-4">Total: <span className="text-primary">{typeof totalPrice === 'number' ? convertPrice(totalPrice) : 'N/A'}</span></p>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                             <Link to={myBookingsLink} className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                View My Bookings
                            </Link>
                            <Link to={homeLink} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-800 transition duration-300">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BookingConfirmationPage;