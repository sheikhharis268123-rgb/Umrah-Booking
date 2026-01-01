
import React, { useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage: React.FC = () => {
    const { convertPrice } = useCurrency();
    const { bookings } = useBooking();
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const myBookings = useMemo(() => {
        if (!user || user.role !== 'customer') return [];
        // Filter bookings where the customerId matches the logged-in user's ID
        // Also include bookings where the guestEmail matches, for bookings made before logging in.
        // FIX: The user's email is stored in `user.id` for customers. `user.data` (of type Customer) does not have an `email` property.
        return bookings.filter(b => b.customerId === user.id || b.guestEmail === user.id);
    }, [bookings, user]);

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <>
            <Header title="My Bookings" />
            <main className="py-12 bg-gray-50 min-h-[calc(100vh-128px)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-primary mb-8">My Bookings</h1>

                    {myBookings.length > 0 ? (
                        <div className="space-y-6">
                            {myBookings.map(booking => (
                                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                                    <img src={booking.hotel.imageUrl} alt={booking.hotel.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-xl font-bold text-primary">{booking.hotel.name}</h2>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{booking.room.type} Room</p>
                                        </div>

                                        <div className="my-4 border-t border-gray-200" />

                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                            <div>
                                                <p className="font-semibold">Check-in</p>
                                                <p>{new Date(booking.checkInDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Check-out</p>
                                                <p>{new Date(booking.checkOutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                             <div>
                                                <p className="font-semibold">Guest</p>
                                                <p>{booking.guestName}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Booking ID</p>
                                                <p className="font-mono">{booking.id}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 flex justify-between items-end">
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="text-xl font-bold text-primary">{convertPrice(booking.totalPrice)}</p>
                                            </div>
                                            {booking.status === 'Confirmed' ? (
                                                <Link 
                                                    to={`/voucher/${booking.id}`}
                                                    className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                                                >
                                                    Download Voucher
                                                </Link>
                                            ) : (
                                                <div title="Voucher available only for confirmed bookings.">
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                                                    >
                                                        Download Voucher
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700">No Bookings Found</h2>
                            <p className="text-gray-500 mt-2">You haven't made any bookings yet.</p>
                            <Link to="/" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-800 transition duration-300">
                                Start Booking
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MyBookingsPage;
