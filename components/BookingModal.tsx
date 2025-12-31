
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Booking, PromoCode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useSettings } from '../context/SettingsContext';

const BookingModal: React.FC = () => {
    const { isBookingModalOpen, closeBookingModal, bookingDetails, setBookingDetails, addBooking } = useBooking();
    const { promoCodes } = useSettings();
    const navigate = useNavigate();
    const { convertPrice } = useCurrency();

    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [promoMessage, setPromoMessage] = useState('');
    const [isProcessing, setProcessing] = useState(false);
    
    const [originalPrice, setOriginalPrice] = useState(0);

    useEffect(() => {
        if (bookingDetails.checkInDate && bookingDetails.checkOutDate && bookingDetails.room) {
            const checkIn = new Date(bookingDetails.checkInDate);
            const checkOut = new Date(bookingDetails.checkOutDate);
            const nights = Math.max(1, (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
            const calculatedPrice = nights * (bookingDetails.room?.customerPricePerNight || 0);
            setOriginalPrice(calculatedPrice);
            setBookingDetails(prev => ({ ...prev, totalPrice: calculatedPrice }));
            
            // Clear promo on date change
            setAppliedPromo(null);
            setPromoCode('');
            setPromoMessage('');

        }
    }, [bookingDetails.checkInDate, bookingDetails.checkOutDate, bookingDetails.room, setBookingDetails]);
    
     useEffect(() => {
        if (appliedPromo) {
            let discountedPrice = originalPrice;
            if (appliedPromo.type === 'percentage') {
                discountedPrice = originalPrice - (originalPrice * appliedPromo.discount / 100);
            } else { // fixed
                discountedPrice = Math.max(0, originalPrice - appliedPromo.discount);
            }
            setBookingDetails(prev => ({...prev, totalPrice: discountedPrice}));
        } else {
             setBookingDetails(prev => ({...prev, totalPrice: originalPrice}));
        }
    }, [originalPrice, appliedPromo, setBookingDetails]);


    if (!isBookingModalOpen || !bookingDetails.hotel || !bookingDetails.room) {
        return null;
    }

    const handleApplyPromo = () => {
        const foundPromo = promoCodes.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
        if (foundPromo) {
            setAppliedPromo(foundPromo);
            setPromoMessage(`Success! ${foundPromo.discount}${foundPromo.type === 'percentage' ? '%' : '$'} discount applied.`);
        } else {
            setAppliedPromo(null);
            setPromoMessage('Invalid promo code.');
        }
    };

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const newBookingData: Omit<Booking, 'id' | 'status'> = {
                hotel: bookingDetails.hotel!,
                room: bookingDetails.room!,
                guestName,
                guestEmail,
                contactNumber,
                checkInDate: bookingDetails.checkInDate,
                checkOutDate: bookingDetails.checkOutDate,
                totalPrice: bookingDetails.totalPrice,
                paymentMethod: 'Online', // Default for customer bookings
                promoCodeApplied: appliedPromo?.code,
            };
            const confirmedBooking = await addBooking(newBookingData, 'customer');
            
            // Reset local state
            setGuestName(''); setGuestEmail(''); setContactNumber(''); setPromoCode(''); setAppliedPromo(null); setPromoMessage('');
            closeBookingModal();
            navigate(`/confirmation/${confirmedBooking.id}`);

        } catch (error) {
            console.error("Failed to confirm booking:", error);
            // You can add a user-facing error message here, e.g., using a toast.
            alert("There was an error confirming your booking. Please try again.");
        } finally {
            setProcessing(false);
        }
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" role="dialog" aria-modal="true">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Confirm Your Booking</h2>
                    <p className="text-gray-600">{bookingDetails.hotel.name} - {bookingDetails.room.type} Room</p>
                </div>

                <form onSubmit={handleConfirmBooking}>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">Check-in</label>
                               <input type="date" id="checkInDate" name="checkInDate" value={bookingDetails.checkInDate} onChange={handleDateChange} className={inputStyle} required />
                           </div>
                           <div>
                               <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">Check-out</label>
                               <input type="date" id="checkOutDate" name="checkOutDate" value={bookingDetails.checkOutDate} onChange={handleDateChange} className={inputStyle} required />
                           </div>
                        </div>
                        <div>
                            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} className={inputStyle} required />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="guestEmail" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input type="tel" id="contactNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className={inputStyle} required />
                            </div>
                        </div>

                        <div>
                             <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">Promo Code (Optional)</label>
                             <div className="flex space-x-2 mt-1">
                                <input type="text" id="promoCode" value={promoCode} onChange={e => setPromoCode(e.target.value)} className={`${inputStyle} mt-0`} placeholder="e.g. UMRAH2024" />
                                <button type="button" onClick={handleApplyPromo} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">Apply</button>
                             </div>
                             {promoMessage && <p className={`text-sm mt-2 ${appliedPromo ? 'text-green-600' : 'text-red-500'}`}>{promoMessage}</p>}
                        </div>

                         <div className="pt-4 border-t text-right">
                             {appliedPromo && <p className="text-sm text-gray-500 line-through">{convertPrice(originalPrice)}</p>}
                             <p className="text-sm text-gray-500">Total Price</p>
                             <p className="text-3xl font-bold text-primary">{convertPrice(bookingDetails.totalPrice)}</p>
                         </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={closeBookingModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center">
                            {isProcessing ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                            ) : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
