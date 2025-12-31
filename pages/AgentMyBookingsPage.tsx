
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useAgent } from '../context/AgentContext';

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);

const AgentMyBookingsPage: React.FC = () => {
  const { bookings, deleteBookings, refreshData } = useBooking();
  const { convertPrice } = useCurrency();
  const { agent } = useAgent();
  const { addToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const agentBookings = useMemo(() => {
    return bookings.filter(b => b.agentDetails?.agencyId === agent?.id);
  }, [bookings, agent]);
  
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

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
  
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setSelectedBookings(agentBookings.map(b => b.id));
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

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <DashboardLayout portal="agent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">My Agency's Bookings</h1>
         <div className="flex items-center gap-4">
            {selectedBookings.length > 0 && (
                <button onClick={handleDeleteSelected} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                    Delete Selected ({selectedBookings.length})
                </button>
            )}
            <button onClick={handleRefresh} disabled={isRefreshing} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                <RefreshIcon isRefreshing={isRefreshing} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>
      </div>
       <div className="bg-white p-6 rounded-lg shadow-md mt-8">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300" onChange={handleSelectAll} checked={selectedBookings.length > 0 && selectedBookings.length === agentBookings.length} />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking / Guest</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {agentBookings.map(booking => (
                        <tr key={booking.id} className={selectedBookings.includes(booking.id) ? 'bg-primary-50' : ''}>
                            <td className="px-6 py-4">
                                <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300" checked={selectedBookings.includes(booking.id)} onChange={() => handleSelectBooking(booking.id)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="font-mono text-primary">{booking.id}</div>
                                <div className="font-medium text-gray-900">{booking.guestName}</div>
                                <div className="text-gray-500">{booking.guestEmail}</div>
                                <div className="text-gray-500">{booking.contactNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.hotel.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate} to {booking.checkOutDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{convertPrice(booking.totalPrice)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/voucher/${booking.id}?from=agent`} className="text-primary hover:underline">
                                    View Voucher
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {agentBookings.length === 0 && <p className="text-center text-gray-500 py-8">No bookings found for your agency.</p>}
          </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentMyBookingsPage;
