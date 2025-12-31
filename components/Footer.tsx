
import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary transition-colors duration-300">
        {children}
    </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
                 <h2 className="text-2xl font-bold text-white mb-2">Umrah Hotels</h2>
                 <p className="text-sm text-gray-400">Your trusted partner for spiritual journeys.</p>
                 <div className="flex space-x-4 mt-4">
                    <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.88-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.58-.7-.02-1.36-.21-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.38-.01-.57.84-.6 1.56-1.36 2.14-2.22z"></path></svg></SocialIcon>
                    <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm3.95 10.32l-1.13.7c.1.43.16.86.16 1.28 0 2.06-1.67 3.73-3.73 3.73-2.06 0-3.73-1.67-3.73-3.73 0-2.06 1.67-3.73 3.73-3.73.42 0 .85.07 1.28.16l.7-1.13c-1.3-.4-2.7-.4-4.04 0-2.3.7-4 2.8-4 5.3s1.7 4.6 4 5.3c2.7.7 5.3 0 6.7-1.8.5-.6.8-1.3.8-2.1 0-.6-.1-1.3-.4-1.8z"></path></svg></SocialIcon>
                    <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 18H5V9h3v9zm-1.5-10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 18h-3v-5.5c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94V18h-3V9h3v1.5h.04c.45-.85 1.54-1.74 3.06-1.74 3.28 0 3.88 2.16 3.88 4.96V18z"></path></svg></SocialIcon>
                 </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                    <li><Link to="/" className="text-gray-400 hover:text-secondary">Home</Link></li>
                    <li><Link to="/#hotels" className="text-gray-400 hover:text-secondary">Hotels</Link></li>
                    <li><Link to="/my-bookings" className="text-gray-400 hover:text-secondary">My Bookings</Link></li>
                    <li><Link to="/track-booking" className="text-gray-400 hover:text-secondary">Track Booking</Link></li>
                    <li><Link to="/support" className="text-gray-400 hover:text-secondary">Support</Link></li>
                </ul>
            </div>

            {/* Column 3: Portals */}
             <div>
                <h3 className="text-lg font-semibold text-white mb-4">For Partners</h3>
                <ul className="space-y-2">
                    <li><Link to="/admin" className="text-gray-400 hover:text-secondary">Admin Portal</Link></li>
                    <li><Link to="/agent" className="text-gray-400 hover:text-secondary">Agent Portal</Link></li>
                </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
                 <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                 <p className="text-gray-400 text-sm">Makkah, Saudi Arabia</p>
                 <p className="text-gray-400 text-sm mt-2">support@umrahhotels.com</p>
            </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Umrah Hotels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
