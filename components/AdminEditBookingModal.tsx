
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';

interface AdminEditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
}

const AdminEditBookingModal: React.FC<AdminEditBookingModalProps> = ({ isOpen, onClose, booking }) => {
    const { updateBooking } = useBooking();
    const { addToast } = useToast();
    const [formData, setFormData] = useState<Booking | null>(null);

    useEffect(() => {
        if (booking) {
            setFormData(booking);
        }
    }, [booking]);

    if (!isOpen || !formData) return null;

    const isConfirmed = formData.status === 'Confirmed';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateBooking(formData);
            addToast('Booking updated successfully!', 'success');
            onClose();
        }
    };

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300 disabled:bg-gray-100 disabled:text-gray-500";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all" role="dialog">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Edit Booking</h2>
                        <p className="font-mono text-sm text-secondary">{formData.id}</p>
                    </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="bg-primary-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-primary">{formData.hotel.name}</h3>
                            <p className="text-sm text-gray-600">{formData.room.type} Room</p>
                        </div>

                         {isConfirmed && (
                            <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md">
                                This booking is confirmed. Only guest details can be edited.
                            </div>
                         )}

                        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                             <legend className="text-lg font-semibold px-2">Dates</legend>
                            <div>
                                <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">Check-in</label>
                                <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className={inputStyle} disabled={isConfirmed} />
                            </div>
                            <div>
                                <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">Check-out</label>
                                <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className={inputStyle} disabled={isConfirmed} />
                            </div>
                        </fieldset>

                        <fieldset className="grid grid-cols-1 gap-4 border p-4 rounded-md">
                            <legend className="text-lg font-semibold px-2">Guest Information</legend>
                             <div>
                                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Guest Name</label>
                                <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">Guest Email</label>
                                    <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputStyle} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditBookingModal;
