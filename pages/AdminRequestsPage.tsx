
import React, { useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';

const AdminRequestsPage: React.FC = () => {
    const { bookings, approveChangeRequest, rejectChangeRequest } = useBooking();
    const { convertPrice } = useCurrency();
    const { addToast } = useToast();

    const requestBookings = useMemo(() => {
        return bookings.filter(b => b.status === 'Cancellation Requested' || b.status === 'Date Change Requested');
    }, [bookings]);
    
    const handleApprove = (bookingId: string) => {
        approveChangeRequest(bookingId);
        addToast('Request approved successfully.', 'success');
    };

    const handleReject = (bookingId: string) => {
        rejectChangeRequest(bookingId);
        addToast('Request rejected. Booking reverted to confirmed.', 'info');
    };
    
    const getStatusColorClasses = (status: Booking['status']) => {
        switch (status) {
            case 'Cancellation Requested': return 'bg-orange-100 text-orange-800';
            case 'Date Change Requested': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout portal="admin">
            <h1 className="text-3xl font-bold text-primary mb-8">Customer Booking Requests</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID / Guest</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requestBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="font-mono text-primary">{booking.id}</div>
                                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClasses(booking.status)}`}>
                                            {booking.status.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {booking.status === 'Date Change Requested' ? (
                                            <div>
                                                From: {booking.checkInDate} to {booking.checkOutDate}
                                                <br />
                                                <span className="font-semibold text-secondary">To: {booking.requestedCheckInDate} to {booking.requestedCheckOutDate}</span>
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleApprove(booking.id)} className="bg-green-600 text-white font-bold py-1 px-3 rounded-md hover:bg-green-700 transition text-xs">Approve</button>
                                        <button onClick={() => handleReject(booking.id)} className="bg-red-600 text-white font-bold py-1 px-3 rounded-md hover:bg-red-700 transition text-xs">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {requestBookings.length === 0 && <p className="text-center text-gray-500 py-8">No pending requests found.</p>}
            </div>
        </DashboardLayout>
    );
};

export default AdminRequestsPage;