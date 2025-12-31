
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
  portal: 'admin' | 'agent';
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const HotelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5" /></svg>;
const AgenciesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.28-.24-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.28.24-1.857m10.5-1.557a3 3 0 00-5.682-1.584M5.5 14.557a3 3 0 015.682-1.584M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const InvoicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FinancialsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BulkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5" /></svg>;
const RequestsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8a3 3 0 100-6 3 3 0 000 6z" /></svg>;


const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <BookingsIcon /> },
    { name: 'Booking Requests', path: '/admin/requests', icon: <RequestsIcon /> },
    { name: 'Bulk Orders', path: '/admin/bulk-orders', icon: <BulkIcon /> },
    { name: 'Hotels', path: '/admin/hotels', icon: <HotelsIcon /> },
    { name: 'Agencies', path: '/admin/agencies', icon: <AgenciesIcon /> },
    { name: 'Invoices', path: '/admin/invoices', icon: <InvoicesIcon /> },
    { name: 'Financials', path: '/admin/financials', icon: <FinancialsIcon /> },
    { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

const agentNav = [
    { name: 'Dashboard', path: '/agent', icon: <DashboardIcon /> },
    { name: 'Bulk Booking', path: '/agent/bulk-booking', icon: <HotelsIcon /> },
    { name: 'My Bookings', path: '/agent/my-bookings', icon: <BookingsIcon /> },
    { name: 'Settings', path: '/agent/settings', icon: <SettingsIcon /> },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, portal }) => {
    const location = useLocation();
    const navItems = portal === 'admin' ? adminNav : agentNav;
    const title = portal === 'admin' ? 'Admin Panel' : 'Agent Portal';
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const SidebarContent = () => (
        <>
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-primary tracking-wider">{title}</h2>
            </div>
            <nav className="mt-4">
                {navItems.map(item => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 border-l-4 ${location.pathname === item.path ? 'border-primary text-primary-700 font-bold bg-primary-50' : 'border-transparent'}`}>
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </>
    );
  
    return (
        <div className="flex flex-col min-h-screen">
            <Header title={title} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-grow relative">
                {/* Mobile Sidebar */}
                <div className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
                    <aside className={`relative z-40 w-64 bg-white h-full shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                       <SidebarContent />
                    </aside>
                </div>

                {/* Desktop Sidebar */}
                <aside className="w-64 bg-white shadow-md hidden md:block flex-shrink-0">
                    <SidebarContent />
                </aside>

                <main className="flex-grow bg-gray-100 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;