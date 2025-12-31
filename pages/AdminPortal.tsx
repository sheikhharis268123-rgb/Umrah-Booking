
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import InfoBanner from '../components/InfoBanner';
import { useInfo } from '../context/InfoContext';
import { useToast } from '../context/ToastContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-accent text-secondary p-4 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  </div>
);

const BookingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const HotelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5" />
    </svg>
);

const RevenueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);


const AdminPortal: React.FC = () => {
    const { announcement, setAnnouncement } = useInfo();
    const { bookings } = useBooking();
    const { addToast } = useToast();
    const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);

    const recentBookings = useMemo(() => {
        return bookings
            .filter(b => b.bookingType !== 'agent-assigned')
            .slice(0, 5);
    }, [bookings]);

    const handleSaveAnnouncement = () => {
        setAnnouncement(currentAnnouncement);
        addToast('Announcement updated successfully!', 'success');
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
        }
    }

    return (
        <DashboardLayout portal="admin">
            <InfoBanner />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <button onClick={() => window.location.reload()} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm">
                    <RefreshIcon />
                    Refresh Data
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Bookings" value="1,254" icon={<BookingIcon />} />
                <StatCard title="Listed Hotels" value="132" icon={<HotelIcon />} />
                <StatCard title="Total Revenue" value="$2.3M" icon={<RevenueIcon />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4">Update Website Announcement</h2>
                <textarea
                    rows={2}
                    className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300"
                    placeholder="Enter a site-wide message... (e.g., 'Booking is now open for Ramadan')"
                    value={currentAnnouncement}
                    onChange={(e) => setCurrentAnnouncement(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSaveAnnouncement}
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                    >
                        Update Announcement
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-primary mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guestName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.hotel.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate} to {booking.checkOutDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/admin/voucher/${booking.id}`} className="text-primary hover:underline font-semibold">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPortal;