import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAgent } from '../context/AgentContext';
import { Booking, Hotel, Room } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

interface AgentBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        hotel: Hotel;
        room: Room;
        checkInDate: string;
        checkOutDate: string;
    };
}

const AgentBookingModal: React.FC<AgentBookingModalProps> = ({ isOpen, onClose, item }) => {
    const { addBooking, updateBookingStatusAndNotify } = useBooking();
    const { agent } = useAgent();
    const { convertPrice } = useCurrency();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [checkInDate, setCheckInDate] = useState(item.checkInDate);
    const [checkOutDate, setCheckOutDate] = useState(item.checkOutDate);
    const [isProcessing, setProcessing] = useState(false);
    const [showPriceOnVoucher, setShowPriceOnVoucher] = useState(true);


    if (!isOpen) return null;

    const nights = Math.max(1, (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24));
    const totalPrice = nights * item.room.agentPricePerNight;

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!guestName.trim() || !guestEmail.trim() || !contactNumber.trim()) {
            addToast("Please fill in all customer details.", 'error');
            return;
        }

        setProcessing(true);

        const newBookingData: Omit<Booking, 'id' | 'status'> = {
            hotel: item.hotel,
            room: item.room,
            guestName,
            guestEmail,
            contactNumber,
            checkInDate,
            checkOutDate,
            totalPrice,
            paymentMethod: 'Online',
            agentDetails: agent!.profile,
            showPriceOnVoucher: showPriceOnVoucher,
        };
        
        try {
            const pendingBooking = await addBooking(newBookingData, 'agent-assigned');
            // Agent-assigned bookings from confirmed bulk orders should be auto-confirmed.
            const confirmedBooking = await updateBookingStatusAndNotify(pendingBooking.id, 'Confirmed');

            onClose();
            
            if (confirmedBooking) {
                // Pass userRole in state to ensure confirmation page has correct links
                navigate(`/confirmation/${confirmedBooking.id}`, { state: { booking: confirmedBooking, userRole: 'agent' } });
            } else {
                 throw new Error("Failed to confirm the booking. Please check the admin panel.");
            }

        } catch (error: any) {
            addToast(`Error: ${error.message || 'Could not assign booking.'}`, 'error');
        } finally {
            setProcessing(false);
        }
    };

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" role="dialog" aria-modal="true">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Assign Room to Customer</h2>
                    <p className="text-gray-600">{item.hotel.name} - {item.room.type} Room</p>
                </div>

                <form onSubmit={handleConfirmBooking}>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">Check-in</label>
                               <input type="date" id="checkInDate" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className={inputStyle} required />
                           </div>
                           <div>
                               <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">Check-out</label>
                               <input type="date" id="checkOutDate" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className={inputStyle} required />
                           </div>
                        </div>
                        <div>
                            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Customer Full Name</label>
                            <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} className={inputStyle} required />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
                                <input type="email" id="guestEmail" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Customer Contact</label>
                                <input type="tel" id="contactNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className={inputStyle} required />
                            </div>
                        </div>
                         <div className="pt-4 border-t flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showPriceOnVoucher"
                                    checked={showPriceOnVoucher}
                                    onChange={(e) => setShowPriceOnVoucher(e.target.checked)}
                                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <label htmlFor="showPriceOnVoucher" className="text-sm font-medium text-gray-700">
                                    Show Price on Voucher
                                </label>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Price (Agent Rate)</p>
                                <p className="text-3xl font-bold text-primary">{convertPrice(totalPrice)}</p>
                            </div>
                         </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center">
                            {isProcessing ? 'Processing...' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentBookingModal;