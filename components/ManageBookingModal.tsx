import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface ManageBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ManageBookingModal: React.FC<ManageBookingModalProps> = ({ isOpen, onClose }) => {
    const { bookings, requestCancellation, requestDateChange } = useBooking();
    const { addToast } = useToast();
    const { convertPrice } = useCurrency();

    const [bookingIdInput, setBookingIdInput] = useState('');
    const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChangingDate, setIsChangingDate] = useState(false);
    
    const [newCheckIn, setNewCheckIn] = useState('');
    const [newCheckOut, setNewCheckOut] = useState('');

    if (!isOpen) return null;
    
    const handleClose = () => {
        setBookingIdInput(''); 
        setFoundBooking(null); 
        setError(''); 
        setIsSubmitting(false); 
        setIsChangingDate(false);
        onClose();
    };

    const getFeePercentage = (checkInDate: string): number => {
        const timeDifferenceInHours = (new Date(checkInDate).getTime() - new Date().getTime()) / (1000 * 3600);
        
        if (timeDifferenceInHours >= 5 * 24) {
            return 10;
        } else if (timeDifferenceInHours >= 2 * 24) {
            return 20;
        } else if (timeDifferenceInHours >= 24) {
            return 30;
        } else {
            return 40;
        }
    };

    const handleFindBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const booking = bookings.find(b => b.id.trim().toUpperCase() === bookingIdInput.trim().toUpperCase());
        if (booking) {
            setFoundBooking(booking);
            setNewCheckIn(booking.checkInDate);
            setNewCheckOut(booking.checkOutDate);
        } else {
            setError('Booking ID not found. Please try again.');
        }
    };

    const handleRequestCancellation = (isRefundRequest: boolean = false) => {
        if (!foundBooking) return;
        
        const feePercentage = getFeePercentage(foundBooking.checkInDate);
        const fee = foundBooking.totalPrice * (feePercentage / 100);
        const refundAmount = foundBooking.totalPrice - fee;

        const actionType = isRefundRequest ? 'refund' : 'cancellation';
        const confirmationMessage = `A ${actionType} fee of ${feePercentage}% (${convertPrice(fee)}) will apply.\nEstimated refund: ${convertPrice(refundAmount)}.\n\nProceed?`;

        if (window.confirm(confirmationMessage)) {
            setIsSubmitting(true);
            setTimeout(() => {
                requestCancellation(foundBooking.id);
                addToast(`${isRefundRequest ? 'Refund' : 'Cancellation'} request for ${foundBooking.id} submitted.`, 'success');
                setIsSubmitting(false);
                handleClose();
            }, 500);
        }
    };
    
    const handleRequestDateChangeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!foundBooking) return;

        const nights = (new Date(newCheckOut).getTime() - new Date(newCheckIn).getTime()) / (1000 * 3600 * 24);
        if (nights <= 0) {
            addToast('Check-out must be after check-in.', 'error'); 
            return;
        }
        
        const oldNights = (new Date(foundBooking.checkOutDate).getTime() - new Date(foundBooking.checkInDate).getTime()) / (1000 * 3600 * 24);
        const pricePerNight = oldNights > 0 ? foundBooking.totalPrice / oldNights : foundBooking.room.customerPricePerNight;
        const newPrice = nights * pricePerNight;
        
        const feePercentage = getFeePercentage(foundBooking.checkInDate);
        const fee = foundBooking.totalPrice * (feePercentage / 100);
        const finalPrice = newPrice + fee;

        const confirmationMessage = `Date change fee of ${feePercentage}% (${convertPrice(fee)}) applies.\nNew estimated total: ${convertPrice(finalPrice)}.\n\nProceed?`;

        if (window.confirm(confirmationMessage)) {
            setIsSubmitting(true);
            setTimeout(() => {
                requestDateChange(foundBooking.id, newCheckIn, newCheckOut, finalPrice);
                addToast('Date change request submitted.', 'success');
                setIsSubmitting(false);
                handleClose();
            }, 500);
        }
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'text-green-600';
            case 'Pending': return 'text-yellow-600';
            case 'Cancelled': return 'text-red-600';
            case 'Cancellation Requested': return 'text-orange-600';
            case 'Date Change Requested': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const isExpired = foundBooking ? new Date(foundBooking.checkOutDate) < new Date() : false;
    const isRequestPending = foundBooking?.status === 'Cancellation Requested' || foundBooking?.status === 'Date Change Requested';

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all" role="dialog">
                <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
                    <h2 className="text-xl md:text-2xl font-bold text-primary">Manage Your Booking</h2>
                     <button onClick={handleClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {!foundBooking ? (
                    <div className="p-6">
                        <form onSubmit={handleFindBooking}>
                            <label htmlFor="bookingId" className="block text-sm font-semibold text-gray-700 mb-3 ml-1 uppercase tracking-wide">
                                Enter your Booking ID
                            </label>
                            <div className="flex flex-row items-center">
                                 <input 
                                    type="text" 
                                    id="bookingId" 
                                    value={bookingIdInput} 
                                    onChange={(e) => setBookingIdInput(e.target.value)}
                                    placeholder="e.g., BK12345"
                                    className="flex-grow p-3.5 bg-gray-50 border border-gray-300 border-r-0 text-gray-900 rounded-l-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition duration-300 placeholder:text-gray-400 font-medium"
                                    required
                                />
                                <button type="submit" className="bg-primary text-white font-bold py-[15px] px-8 rounded-r-xl hover:bg-primary-800 transition-all shadow-sm active:scale-95">
                                    Find
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-4 font-semibold p-3 bg-red-50 rounded-lg border border-red-100">{error}</p>}
                        </form>
                    </div>
                ) : isChangingDate ? (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">Request Date Change</h3>
                        <form onSubmit={handleRequestDateChangeSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Check-in</label>
                                    <input type="date" value={newCheckIn} onChange={e => setNewCheckIn(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Check-out</label>
                                    <input type="date" value={newCheckOut} onChange={e => setNewCheckOut(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-primary focus:border-primary" required />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsChangingDate(false)} className="px-4 py-2 text-gray-600 font-semibold">Back</button>
                                <button type="submit" disabled={isSubmitting} className="bg-secondary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-opacity-50 transition-all">
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-primary">{foundBooking.hotel.name}</h3>
                                <p className="text-sm text-gray-500">{foundBooking.room.type} Room • Guest: {foundBooking.guestName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-y text-sm">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Check-in</p>
                                    <p className="font-semibold">{new Date(foundBooking.checkInDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Check-out</p>
                                    <p className="font-semibold">{new Date(foundBooking.checkOutDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Booking ID</p>
                                    <p className="font-mono text-secondary font-bold">{foundBooking.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                                    <p className={`font-bold ${getStatusColor(foundBooking.status)}`}>{foundBooking.status}</p>
                                </div>
                            </div>
                            
                            {!isRequestPending && !isExpired && foundBooking.status !== 'Cancelled' && (
                                <div className="grid grid-cols-1 gap-3 pt-4">
                                    <button onClick={() => setIsChangingDate(true)} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all shadow-sm">
                                        Change Dates
                                    </button>
                                    <button onClick={() => handleRequestCancellation(false)} className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all shadow-sm">
                                        Cancel Booking
                                    </button>
                                    <button onClick={() => handleRequestCancellation(true)} className="w-full border-2 border-secondary text-secondary font-bold py-3 rounded-xl hover:bg-secondary hover:text-white transition-all">
                                        Request Refund
                                    </button>
                                </div>
                            )}
                            
                            {isRequestPending && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <p className="text-blue-700 font-bold">Request Pending</p>
                                    <p className="text-sm text-blue-600">Our team is reviewing your request.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookingModal;