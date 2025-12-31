
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { Booking } from '../types';
import { useAgency } from '../context/AgencyContext';
import { useToast } from '../context/ToastContext';
import AdminEditBookingModal from '../components/AdminEditBookingModal';

const AdminBookingsPage: React.FC = () => {
    const { bookings, updateBookingStatus, deleteBookings } = useBooking();
    const { agencies } = useAgency();
    const { convertPrice } = useCurrency();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();

    const [filterBookingId, setFilterBookingId] = useState('');
    const [filterGuestName, setFilterGuestName] = useState('');
    const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const agencyIdFilter = searchParams.get('agencyId');
    const agencyName = agencyIdFilter ? agencies.find(a => a.id === agencyIdFilter)?.profile.agencyName : '';

    const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
        updateBookingStatus(bookingId, newStatus);
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            // Exclude agent-assigned bookings from the main admin view
            if (booking.bookingType === 'agent-assigned' && !agencyIdFilter) {
                return false;
            }
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
        if (window.confirm(`Are you sure you want to delete ${selectedBookings.length} booking(s)?`)) {
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
                <h1 className="text-3xl font-bold text-primary">{agencyIdFilter ? `${agencyName}'s Bookings` : 'All Customer Bookings'}</h1>
                 {agencyIdFilter && <Link to="/admin/bookings" className="text-sm text-primary hover:underline">Clear Agency Filter</Link>}
            </div>
            <p className="text-sm text-gray-500 -mt-3 mb-6">Bookings assigned by agents from their bulk inventory are managed in the Agent Portal and do not appear here.</p>


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