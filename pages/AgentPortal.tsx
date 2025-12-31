
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useBooking } from '../context/BookingContext';
import InfoBanner from '../components/InfoBanner';
import { useAgent } from '../context/AgentContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

const StatCard: React.FC<{ title: string; value: string | React.ReactNode; icon: React.ReactNode; linkTo?: string }> = ({ title, value, icon, linkTo }) => {
    const content = (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center transform hover:-translate-y-1 transition-transform duration-300 h-full">
            <div className="bg-accent text-secondary p-4 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <div className="text-2xl font-bold text-primary">{value}</div>
            </div>
        </div>
    );

    return linkTo ? <Link to={linkTo}>{content}</Link> : <div>{content}</div>;
};

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

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);


const AgentPortal: React.FC = () => {
  const { agent } = useAgent();
  const { bookings, refreshData } = useBooking();
  const { addToast } = useToast();
  const { convertPrice } = useCurrency();
  const agentBookings = bookings.filter(b => b.agentDetails?.agencyId === agent?.id);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
  
  if (agent && agent.status === 'Inactive') {
        return (
            <DashboardLayout portal="agent">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600">Account Inactive</h1>
                    <p className="text-gray-600 mt-2">Your agency account is currently inactive. Please contact administration for assistance.</p>
                </div>
            </DashboardLayout>
        );
    }
    
  return (
    <DashboardLayout portal="agent">
      <InfoBanner />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Agent Dashboard</h1>
        <button onClick={handleRefresh} disabled={isRefreshing} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            <RefreshIcon isRefreshing={isRefreshing} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Wallet Balance" value={convertPrice(agent?.walletBalance || 0)} icon={<WalletIcon />} />
            <StatCard title="Create Bulk Booking" value="Start New Order" icon={<HotelIcon />} linkTo="/agent/bulk-booking" />
            <StatCard title="My Agency's Bookings" value={`${agentBookings.length} Bookings`} icon={<BookingIcon />} linkTo="/agent/my-bookings" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-4">Welcome, {agent?.profile.agencyName}!</h2>
            <p className="text-gray-600">
                This is your central hub for managing hotel bookings for your clients. 
                You can create new bulk orders or view and manage your existing agency bookings using the sections above.
            </p>
        </div>

    </DashboardLayout>
  );
};

export default AgentPortal;
