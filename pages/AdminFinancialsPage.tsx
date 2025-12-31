
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { Booking } from '../types';

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

const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5" /></svg>;
const ProfitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;

type TimeFilter = 'today' | 'week' | 'month' | 'year';

const AdminFinancialsPage: React.FC = () => {
    const { bookings } = useBooking();
    const { convertPrice } = useCurrency();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

    const filteredBookings = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return bookings.filter(b => {
            if (b.status !== 'Confirmed') return false;
            const checkInDate = new Date(b.checkInDate);
            switch (timeFilter) {
                case 'today': return checkInDate >= startOfToday;
                case 'week': return checkInDate >= startOfWeek;
                case 'month': return checkInDate >= startOfMonth;
                case 'year': return checkInDate >= startOfYear;
                default: return true;
            }
        });
    }, [bookings, timeFilter]);

    const financialSummary = useMemo(() => {
        let totalSales = 0;
        let totalCost = 0;

        filteredBookings.forEach(booking => {
            const nights = (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24);
            totalSales += booking.totalPrice;
            totalCost += nights * booking.room.purchasePricePerNight;
        });
        
        const netRevenue = totalSales - totalCost;
        return { totalSales, totalCost, netRevenue };
    }, [filteredBookings]);

    const getTransactionProfit = (booking: Booking) => {
        const nights = (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24);
        const cost = nights * booking.room.purchasePricePerNight;
        return booking.totalPrice - cost;
    };


    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-primary">Financials & Analytics</h1>
                <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                    {(['today', 'week', 'month', 'year'] as TimeFilter[]).map(filter => (
                         <button 
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${timeFilter === filter ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                         >
                             {filter === 'week' || filter === 'month' || filter === 'year' ? `This ${filter}`: 'Today'}
                         </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Sales" value={convertPrice(financialSummary.totalSales)} icon={<RevenueIcon />} />
                <StatCard title="Hotel Costs" value={convertPrice(financialSummary.totalCost)} icon={<CostIcon />} />
                <StatCard title="Net Revenue" value={convertPrice(financialSummary.netRevenue)} icon={<ProfitIcon />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-primary mb-4">Profitable Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sale Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map(booking => {
                                const nights = (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24);
                                const cost = nights * booking.room.purchasePricePerNight;
                                const profit = booking.totalPrice - cost;

                                return (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary">{booking.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.agentDetails ? 'Agent' : 'Customer'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">{convertPrice(booking.totalPrice)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">{convertPrice(cost)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">{convertPrice(profit)}</td>
                                    </tr>
                                )
                            })}
                         </tbody>
                    </table>
                    {filteredBookings.length === 0 && <p className="text-center text-gray-500 py-8">No confirmed bookings found for this period.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminFinancialsPage;