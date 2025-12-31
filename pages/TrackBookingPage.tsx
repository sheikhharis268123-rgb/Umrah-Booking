
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const TrackBookingPage = () => {
    const { bookings } = useBooking();
    const { convertPrice } = useCurrency();

    const [bookingIdInput, setBookingIdInput] = useState('');
    const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
    const [error, setError] = useState('');

    const handleTrackBooking = (e: React.FormEvent) => {
        e.preventDefault();
        const booking = bookings.find(b => b.id.toLowerCase() === bookingIdInput.toLowerCase());

        if (booking) {
            setFoundBooking(booking);
            setError('');
        } else {
            setFoundBooking(null);
            setError('Booking ID not found. Please check the ID and try again.');
        }
    };

    const getStatusInfo = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return { color: 'bg-green-100 text-green-800', message: 'Your booking is confirmed. We look forward to welcoming you.' };
            case 'Pending': return { color: 'bg-yellow-100 text-yellow-800', message: 'Your booking is pending approval. You will be notified via email upon confirmation.' };
            case 'Cancelled': return { color: 'bg-red-100 text-red-800', message: 'This booking has been cancelled.' };
            default: return { color: 'bg-gray-100 text-gray-800', message: '' };
        }
    }

    return (
        <>
            <Header title="Track Booking" />
            <main className="py-12 bg-gray-50 min-h-[calc(100vh-128px)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 className="text-3xl font-bold text-primary mb-2">Track Your Booking</h1>
                        <p className="text-gray-600 mb-6">Enter your Booking ID to see its status.</p>
                        
                        <form onSubmit={handleTrackBooking} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input 
                                type="text"
                                value={bookingIdInput}
                                onChange={e => setBookingIdInput(e.target.value)}
                                placeholder="Enter Booking ID (e.g., BK12345)"
                                className="flex-grow p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300"
                            />
                            <button type="submit" className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                Track
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    {foundBooking && (
                        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                           <div className={`p-4 text-center ${getStatusInfo(foundBooking.status).color}`}>
                               <p className="font-semibold">{getStatusInfo(foundBooking.status).message}</p>
                           </div>
                           <div className="p-6">
                               <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary">{foundBooking.hotel.name}</h2>
                                        <p className="text-gray-600">{foundBooking.room.type} Room for {foundBooking.guestName}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusInfo(foundBooking.status).color}`}>
                                        {foundBooking.status}
                                    </span>
                               </div>
                               <div className="my-4 border-t" />
                               <div className="grid grid-cols-2 gap-4 text-sm">
                                    <p><strong>Check-in:</strong> {new Date(foundBooking.checkInDate).toLocaleDateString()}</p>
                                    <p><strong>Check-out:</strong> {new Date(foundBooking.checkOutDate).toLocaleDateString()}</p>
                                    <p><strong>Total Price:</strong> <span className="font-semibold">{convertPrice(foundBooking.totalPrice)}</span></p>
                                    <p><strong>Booking ID:</strong> <span className="font-mono">{foundBooking.id}</span></p>
                               </div>
                               {foundBooking.status === 'Confirmed' && (
                                   <div className="mt-6 border-t pt-4 flex justify-end gap-3">
                                        <Link to={`/voucher/${foundBooking.id}`} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-800 transition">
                                            View/Print Voucher
                                        </Link>
                                   </div>
                               )}
                           </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default TrackBookingPage;
