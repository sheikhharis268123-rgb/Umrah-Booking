
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';


const AgentMyBookingsPage: React.FC = () => {
  const { bookings, deleteBookings } = useBooking();
  const { convertPrice } = useCurrency();
  const { addToast } = useToast();
  
  // In a real app, you would filter by the logged-in agent's ID.
  const agentBookings = useMemo(() => {
    return bookings.filter(b => b.agentDetails);
  }, [bookings]);
  
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  
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
    }
  }

  return (
    <DashboardLayout portal="agent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">My Agency's Bookings</h1>
        {selectedBookings.length > 0 && (
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                Delete Selected ({selectedBookings.length})
            </button>
        )}
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