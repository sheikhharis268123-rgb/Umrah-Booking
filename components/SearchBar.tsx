
import React from 'react';
import { SearchCriteria } from '../pages/CustomerPortal';

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

interface SearchBarProps {
    criteria: SearchCriteria;
    setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
    onSearch: () => void;
    isResultsPage: boolean;
    onManageBookingClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ criteria, setCriteria, onSearch, isResultsPage, onManageBookingClick }) => {
    // Added 'max-w-full' and 'block' to ensure inputs don't exceed parent width
    const inputStyle = "block w-full max-w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300 box-border appearance-none";
    const selectStyle = `${inputStyle} pl-10 pr-10`;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCriteria(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={`bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-xl relative z-10 w-full max-w-5xl mx-auto ${isResultsPage ? '' : '-mt-16'}`}>
            <div className="flex justify-end mb-3 px-1">
                 <button type="button" onClick={onManageBookingClick} className="text-sm font-semibold text-primary hover:underline">
                    Manage Booking
                </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                 {/* City Field */}
                 <div className="flex flex-col min-w-0">
                    <label htmlFor="city" className="text-sm font-semibold text-gray-600 mb-1.5 ml-1">City</label>
                    <div className="relative">
                        <LocationIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select id="city" name="city" value={criteria.city} onChange={handleInputChange} className={selectStyle}>
                            <option value="Makkah">Makkah</option>
                            <option value="Madina">Madina</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                 {/* Check-in Field */}
                 <div className="flex flex-col min-w-0">
                    <label htmlFor="checkIn" className="text-sm font-semibold text-gray-600 mb-1.5 ml-1">Check-in</label>
                    <input 
                        type="date" 
                        id="checkIn" 
                        name="checkIn" 
                        value={criteria.checkIn} 
                        onChange={handleInputChange} 
                        className={inputStyle} 
                        min={today} 
                    />
                </div>

                 {/* Check-out Field */}
                 <div className="flex flex-col min-w-0">
                    <label htmlFor="checkOut" className="text-sm font-semibold text-gray-600 mb-1.5 ml-1">Check-out</label>
                    <input 
                        type="date" 
                        id="checkOut" 
                        name="checkOut" 
                        value={criteria.checkOut} 
                        onChange={handleInputChange} 
                        className={inputStyle} 
                        min={criteria.checkIn || today} 
                    />
                </div>

                {/* Search Button */}
                <button type="submit" className="md:col-span-3 w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-3.5 px-4 rounded-lg transition duration-300 shadow-md flex items-center justify-center text-lg h-[48px] mt-2 md:mt-0">
                    <SearchIcon className="w-5 h-5 mr-2" />
                    Search Hotels
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
