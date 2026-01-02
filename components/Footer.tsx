import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary transition-colors duration-300">
        {children}
    </a>
);

const Footer: React.FC = () => {
  const { websiteName, contactEmail, contactPhone, contactAddress, facebookUrl, twitterUrl, instagramUrl } = useSettings();

  return (
    <footer className="bg-neutral-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
                 <h2 className="text-2xl font-bold text-white mb-2">{websiteName}</h2>
                 <p className="text-sm text-gray-400">Your trusted partner for spiritual journeys.</p>
                 <div className="flex space-x-4 mt-4">
                    {twitterUrl && twitterUrl !== '#' && <SocialIcon href={twitterUrl}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.88-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.58-.7-.02-1.36-.21-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.38-.01-.57.84-.6 1.56-1.36 2.14-2.22z"></path></svg></SocialIcon>}
                    {facebookUrl && facebookUrl !== '#' && <SocialIcon href={facebookUrl}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook"><path d="M12 2.04C6.48 2.04 2 6.52 2 12s4.48 9.96 10 9.96c5.52 0 10-4.48 10-9.96S17.52 2.04 12 2.04zm3.6 7.92h-2.1v-1.44c0-.5.36-.6.55-.6h1.55v-2.2H13.8c-2.07 0-2.8.9-2.8 2.8v1.44H9.6v2.2h1.4v6.2h2.8v-6.2h2.1l.3-2.2z"></path></svg></SocialIcon>}
                    {instagramUrl && instagramUrl !== '#' && <SocialIcon href={instagramUrl}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram"><path d="M12 2c-2.72 0-3.05.01-4.12.06-1.06.05-1.79.22-2.42.47-.65.25-1.13.59-1.62 1.08-.49.49-.83.97-1.08 1.62-.25.63-.42 1.36-.47 2.42C2.01 8.95 2 9.28 2 12s.01 3.05.06 4.12c.05 1.06.22 1.79.47 2.42.25.65.59 1.13 1.08 1.62.49.49.97.83 1.62 1.08.63.25 1.36.42 2.42.47 1.07.05 1.4.06 4.12.06s3.05-.01 4.12-.06c1.06-.05 1.79-.22 2.42-.47.65-.25 1.13-.59 1.62-1.08.49-.49.83-.97 1.08-1.62.25-.63.42-1.36.47-2.42.05-1.07.06-1.4.06-4.12s-.01-3.05-.06-4.12c-.05-1.06-.22-1.79-.47-2.42-.25-.65-.59-1.13-1.08-1.62-.49-.49-.97-.83-1.62-1.08-.63-.25-1.36-.42-2.42-.47C15.05 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.98.01 4.04.06 1.02.05 1.58.21 1.96.36.49.2.82.47 1.15.8.33.33.6.66.8 1.15.15.38.31.94.36 1.96.05 1.06.06 1.37.06 4.04s-.01 2.98-.06 4.04c-.05 1.02-.21 1.58-.36 1.96-.2.49-.47.82-.8 1.15-.33.33-.66.6-1.15.8-.38.15-.94.31-1.96.36-1.06.05-1.37.06-4.04.06s-2.98-.01-4.04-.06c-1.02-.05-1.58-.21-1.96-.36-.49-.2-.82-.47-1.15-.8-.33-.33-.6-.66-.8-1.15-.15-.38-.31-.94-.36-1.96-.05-1.06-.06-1.37-.06-4.04s.01-2.98.06-4.04c.05-1.02.21-1.58.36-1.96.2-.49.47-.82.8-1.15.33-.33.66-.6 1.15-.8.38-.15.94-.31 1.96-.36 1.06-.05 1.37-.06 4.04-.06zM12 7.27c-2.61 0-4.73 2.12-4.73 4.73s2.12 4.73 4.73 4.73 4.73-2.12 4.73-4.73-2.12-4.73-4.73-4.73zm0 7.64c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9 2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9zm4.76-7.83c0 .58-.47 1.05-1.05 1.05s-1.05-.47-1.05-1.05.47-1.05 1.05-1.05 1.05.47 1.05 1.05z"></path></svg></SocialIcon>}
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
                 <p className="text-gray-400 text-sm">{contactAddress}</p>
                 <p className="text-gray-400 text-sm mt-2">{contactEmail}</p>
                 <p className="text-gray-400 text-sm mt-2">{contactPhone}</p>
            </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {websiteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;