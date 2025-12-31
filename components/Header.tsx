
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCurrency } from '../context/CurrencyContext';
import { Currency } from '../types';


const KaabaIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.667 2H5.333C3.492 2 2 3.492 2 5.333v13.334C2 20.508 3.492 22 5.333 22h13.334C20.508 22 22 20.508 22 18.667V5.333C22 3.492 20.508 2 18.667 2zM10 10.667v-4h4v4h3.333L12 17.333 6.667 10.667H10z"/>
    </svg>
);

interface HeaderProps {
    title: string;
    toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, toggleSidebar }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { logoUrl } = useSettings();
    const { currency, setCurrency } = useCurrency();
    
    const isAdmin = location.pathname.startsWith('/admin');
    const isAgent = location.pathname.startsWith('/agent');

    const navLinks = [
        { name: 'Dashboard', path: '/admin', roles: ['admin'] },
        { name: 'Bookings', path: '/admin/bookings', roles: ['admin'] },
        { name: 'Hotels', path: '/admin/hotels', roles: ['admin'] },
        { name: 'Settings', path: '/admin/settings', roles: ['admin'] },
        { name: 'Dashboard', path: '/agent', roles: ['agent'] },
        { name: 'My Agency\'s Bookings', path: '#', roles: ['agent'] },
        { name: 'Home', path: '/', roles: ['customer'] },
        { name: 'Hotels', path: '/hotels', roles: ['customer'] },
        { name: 'My Bookings', path: '/my-bookings', roles: ['customer'] },
        { name: 'Track Booking', path: '/track-booking', roles: ['customer'] },
        { name: 'Support', path: '/support', roles: ['customer'] },
    ];
    
    const currentRole = isAdmin ? 'admin' : isAgent ? 'agent' : 'customer';
    const visibleLinks = navLinks.filter(link => link.roles.includes(currentRole));

    return (
        <header className="bg-gradient-to-r from-primary to-primary-800 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        {(isAdmin || isAgent) && (
                            <button onClick={toggleSidebar} className="text-white mr-4 md:hidden">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        )}
                        <Link to={isAdmin ? "/admin" : isAgent ? "/agent" : "/"} className="flex items-center space-x-3">
                            {logoUrl ? <img src={logoUrl} alt="Logo" className="h-12 w-auto" /> : <KaabaIcon />}
                            <h1 className="text-2xl font-bold text-white tracking-wider">{title}</h1>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <nav className="hidden md:flex items-center space-x-2 text-white font-medium">
                            {visibleLinks.map(link => (
                                <Link key={link.name} to={link.path} className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-300">{link.name}</Link>
                            ))}
                            { (isAdmin || isAgent) && <Link to="/" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-300">Exit Portal</Link>}
                        </nav>
                        <div className="ml-4">
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                                className="bg-white/20 text-white border-none rounded-md py-1.5 pl-2 pr-8 text-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                            >
                                <option value="PKR">PKR</option>
                                <option value="SAR">SAR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <div className="md:hidden ml-4">
                            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                 <div className="md:hidden bg-primary-800">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {visibleLinks.map(link => (
                            <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-primary-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{link.name}</Link>
                        ))}
                        { (isAdmin || isAgent) && <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-primary-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Exit Portal</Link>}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;