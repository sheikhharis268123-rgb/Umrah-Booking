
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { Booking } from '../types';
import { useAgency } from '../context/AgencyContext';
import { useToast } from '../context/ToastContext';
import AdminEditBookingModal from '../components/AdminEditBookingModal';

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);

const AdminBookingsPage: React.FC = () => {
    const { bookings, updateBookingStatusAndNotify, deleteBookings, refreshData } = useBooking();
    const { agencies } = useAgency();
    const { convertPrice } = useCurrency();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [filterBookingId, setFilterBookingId] = useState('');
    const [filterGuestName, setFilterGuestName] = useState('');
    const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const agencyIdFilter = searchParams.get('agencyId');
    const agencyName = agencyIdFilter ? agencies.find(a => a.id === agencyIdFilter)?.profile.agencyName : '';
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshData();
            addToast('Data refreshed successfully.', 'success');
        } catch {
            addToast('Failed to refresh data.', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
        try {
            await updateBookingStatusAndNotify(bookingId, newStatus);
            addToast(`Booking ${bookingId} status updated to ${newStatus}.`, 'success');
        } catch (error) {
            addToast(`Failed to update status for ${bookingId}.`, 'error');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesAgency = !agencyIdFilter || booking.agentDetails?.agencyId === agencyIdFilter;
            const matchesBookingId = !filterBookingId || booking.id.toLowerCase().includes(filterBookingId.toLowerCase());
            const matchesGuestName = !filterGuestName || booking.guestName.toLowerCase().includes(filterGuestName.toLowerCase());
            return matchesAgency && matchesBookingId && matchesGuestName;
        });
    }, [bookings, agencyIdFilter, filterBookingId, filterGuestName]);

    const handleSelectBooking = (bookingId: string) => {
        setSelectedBookings(prev => 
            prev.includes(bookingId) 
                ? prev.filter(id => id !== bookingId)
                : [...prev, bookingId]
        );
    };
    
    const handleOpenEditModal = (booking: Booking) => {
        setEditingBooking(booking);
        setEditModalOpen(true);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedBookings(filteredBookings.map(b => b.id));
        } else {
            setSelectedBookings([]);
        }
    };
    
    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedBookings.length} booking(s)? This is a local action.`)) {
            deleteBookings(selectedBookings);
            addToast(`${selectedBookings.length} booking(s) deleted.`, 'success');
            setSelectedBookings([]);
        }
    };
    
    const getStatusColorClasses = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{agencyIdFilter ? `${agencyName}'s Bookings` : 'All Bookings'}</h1>
                    {agencyIdFilter && <Link to="/admin/bookings" className="text-sm text-primary hover:underline">Clear Agency Filter</Link>}
                </div>
                <button onClick={handleRefresh} disabled={isRefreshing} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    <RefreshIcon isRefreshing={isRefreshing} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <input type="text" placeholder="Filter by Booking ID..." value={filterBookingId} onChange={(e) => setFilterBookingId(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <input type="text" placeholder="Filter by Guest Name..." value={filterGuestName} onChange={(e) => setFilterGuestName(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                </div>
                {selectedBookings.length > 0 && (
                     <div className="mt-4 flex justify-end">
                        <button onClick={handleDeleteSelected} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                           Delete Selected ({selectedBookings.length})
                        </button>
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">
                                    <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300" onChange={handleSelectAll} checked={selectedBookings.length > 0 && selectedBookings.length === filteredBookings.length} />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} className={selectedBookings.includes(booking.id) ? 'bg-primary-50' : ''}>
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300" checked={selectedBookings.includes(booking.id)} onChange={() => handleSelectBooking(booking.id)} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guestName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.hotel.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate} to {booking.checkOutDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{convertPrice(booking.totalPrice)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])} className={`w-full p-1.5 border rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-400 ${getStatusColorClasses(booking.status)}`}>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenEditModal(booking)} className="text-secondary hover:underline">Edit</button>
                                        <Link to={`/admin/voucher/${booking.id}`} className="text-primary hover:underline">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredBookings.length === 0 && <p className="text-center text-gray-500 py-8">No bookings found matching your criteria.</p>}
            </div>
            <AdminEditBookingModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                booking={editingBooking}
            />
        </DashboardLayout>
    );
};

export default AdminBookingsPage;
