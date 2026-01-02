import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { Hotel } from '../types';
import { useHotels } from '../context/HotelContext';
import FilterBar from '../components/FilterBar';
import InfoBanner from '../components/InfoBanner';
import DateScroller from '../components/DateScroller';
import HotelCardSkeleton from '../components/HotelCardSkeleton';
import ManageBookingModal from '../components/ManageBookingModal';
import { useSettings } from '../context/SettingsContext';

export interface SearchCriteria {
    city: 'Makkah' | 'Madina';
    checkIn: string;
    checkOut: string;
}

export interface Filters {
    sortBy: 'price-asc' | 'price-desc' | 'distance-asc' | '';
    stars: number; // 0 for all
    maxPrice: number;
    maxDistance: number;
}

const CustomerPortal: React.FC = () => {
    const { hotels } = useHotels();
    const { bannerImageUrl } = useSettings();
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [criteria, setCriteria] = useState<SearchCriteria>({
        city: 'Makkah',
        checkIn: today.toISOString().split('T')[0],
        checkOut: tomorrow.toISOString().split('T')[0],
    });
    const [searchedHotels, setSearchedHotels] = useState<Hotel[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const maxPriceFromResults = useMemo(() => {
        if (!searchedHotels || searchedHotels.length === 0) return 500000;
        return Math.ceil(Math.max(...searchedHotels.map(h => h.priceStart)) / 10000) * 10000;
    }, [searchedHotels]);

    const maxDistanceFromResults = useMemo(() => {
        if (!searchedHotels || searchedHotels.length === 0) return 3000;
        const maxCalc = Math.ceil(Math.max(...searchedHotels.map(h => h.distanceToHaram)) / 100) * 100;
        return Math.min(maxCalc, 3000); // Cap max distance at 3000m
    }, [searchedHotels]);

    const [filters, setFilters] = useState<Filters>({ 
        sortBy: '', 
        stars: 0, 
        maxPrice: maxPriceFromResults,
        maxDistance: maxDistanceFromResults
    });
    

    const handleSearch = () => {
        const checkInDate = new Date(criteria.checkIn);
        const checkOutDate = new Date(criteria.checkOut);

        if (checkInDate >= checkOutDate) {
            alert("Check-out date must be after the check-in date.");
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            const results = hotels.filter(hotel => {
                const availableFrom = new Date(hotel.availableFrom);
                const availableTo = new Date(hotel.availableTo);
                
                return hotel.city === criteria.city &&
                       checkInDate >= availableFrom &&
                       checkOutDate <= availableTo;
            });
            
            setSearchedHotels(results);
            
            const newMaxPrice = results.length > 0 ? Math.ceil(Math.max(...results.map(h => h.priceStart)) / 10000) * 10000 : 500000;
            const maxCalc = results.length > 0 ? Math.ceil(Math.max(...results.map(h => h.distanceToHaram)) / 100) * 100 : 3000;
            const newMaxDistance = Math.min(maxCalc, 3000);
            setFilters({ sortBy: '', stars: 0, maxPrice: newMaxPrice, maxDistance: newMaxDistance });
            setIsLoading(false);
        }, 1000);
    };

    const handleDateScrollerSelect = (date: string) => {
        const newCheckIn = new Date(date);
        const newCheckOut = new Date(newCheckIn);
        newCheckOut.setDate(newCheckOut.getDate() + 1);

        const newCriteria = {
            ...criteria,
            checkIn: newCheckIn.toISOString().split('T')[0],
            checkOut: newCheckOut.toISOString().split('T')[0],
        };
        setCriteria(newCriteria);
        
        setIsLoading(true);
        setTimeout(() => {
            const results = hotels.filter(hotel => {
                const availableFrom = new Date(hotel.availableFrom);
                const availableTo = new Date(hotel.availableTo);
                return hotel.city === newCriteria.city &&
                       newCheckIn >= availableFrom &&
                       newCheckOut <= availableTo;
            });
            setSearchedHotels(results);
            setIsLoading(false);
        }, 500);
    };
    
    const handleClearSearch = () => {
        setSearchedHotels(null);
    }

    const filteredAndSortedHotels = useMemo(() => {
        if (searchedHotels === null) return [];
        let result = [...searchedHotels];

        result = result.filter(hotel => hotel.priceStart <= filters.maxPrice);
        result = result.filter(hotel => hotel.distanceToHaram <= filters.maxDistance);

        if (filters.stars > 0) {
            result = result.filter(hotel => Math.round(hotel.rating) === filters.stars);
        }

        switch (filters.sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.priceStart - b.priceStart);
                break;
            case 'price-desc':
                result.sort((a, b) => b.priceStart - a.priceStart);
                break;
            case 'distance-asc':
                result.sort((a, b) => a.distanceToHaram - b.distanceToHaram);
                break;
        }

        return result;
    }, [searchedHotels, filters]);


    const scrollToSearch = () => {
        document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <Header title="Umrah Hotels" />
            <InfoBanner />
            <main>
                {searchedHotels === null && (
                    <div className="relative h-[550px] bg-cover bg-center" style={{ backgroundImage: `url('${bannerImageUrl}')` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-center">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
                                <div className="max-w-2xl">
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Your Sacred Journey, Our Comfort</h1>
                                    <p className="mt-4 text-lg md:text-xl max-w-2xl opacity-90">Find and book the perfect hotels in the holy cities of Makkah and Madina for your Umrah pilgrimage.</p>
                                    <button onClick={scrollToSearch} className="mt-8 bg-secondary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg text-lg transform hover:scale-105">
                                        Start Planning
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div id="search-section" className={searchedHotels !== null ? 'py-8 bg-primary-50' : ''}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <SearchBar criteria={criteria} setCriteria={setCriteria} onSearch={handleSearch} isResultsPage={searchedHotels !== null} onManageBookingClick={() => setManageModalOpen(true)} />
                    </div>
                </div>
                
                {searchedHotels !== null ? (
                     <section className="py-12 bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                <h2 className="text-3xl font-bold text-primary">Search Results in {criteria.city}</h2>
                                <button onClick={handleClearSearch} className="text-sm text-primary hover:underline">Clear Search & Start Over</button>
                           </div>
                            <DateScroller selectedDate={criteria.checkIn} onDateSelect={handleDateScrollerSelect} />
                            <div className="flex flex-col md:flex-row gap-8 mt-8">
                                <aside className="w-full md:w-1/4 lg:w-1/5">
                                    <FilterBar 
                                        filters={filters} 
                                        setFilters={setFilters}
                                        maxPriceValue={maxPriceFromResults}
                                        maxDistanceValue={maxDistanceFromResults}
                                        resultsCount={filteredAndSortedHotels.length}
                                    />
                                </aside>
                                <div className="w-full md:w-3/4 lg:w-4/5">
                                    {isLoading ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {[...Array(6)].map((_, i) => <HotelCardSkeleton key={i} />)}
                                        </div>
                                    ) : filteredAndSortedHotels.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredAndSortedHotels.map((hotel: Hotel) => (
                                                <HotelCard key={hotel.id} hotel={hotel} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                            <h3 className="text-xl font-semibold text-gray-700">No Hotels Available For These Dates</h3>
                                            <p className="text-gray-500 mt-2">Try adjusting your dates using the calendar above or the date scroller.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section id="hotels" className="py-20 bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-primary">Featured Hotels</h2>
                                <p className="text-gray-600 mt-2">Steps away from the Holy Sites</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {hotels.slice(0, 6).map((hotel: Hotel) => (
                                    <HotelCard key={hotel.id} hotel={hotel} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            </main>
            <ManageBookingModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} />
            <Footer />
        </>
    );
};

export default CustomerPortal;