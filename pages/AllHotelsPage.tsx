
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import { Hotel } from '../types';
import { useHotels } from '../context/HotelContext';
import FilterBar from '../components/FilterBar';
import InfoBanner from '../components/InfoBanner';

export interface Filters {
    sortBy: 'price-asc' | 'price-desc' | 'distance-asc' | '';
    stars: number; // 0 for all
    maxPrice: number;
    maxDistance: number;
}

const AllHotelsPage: React.FC = () => {
    const { hotels } = useHotels();
    
    const maxPossiblePrice = useMemo(() => {
        if (hotels.length === 0) return 500000;
        return Math.ceil(Math.max(...hotels.map(h => h.priceStart)) / 10000) * 10000;
    }, [hotels]);

    const maxPossibleDistance = useMemo(() => {
        if (hotels.length === 0) return 2000;
        return Math.ceil(Math.max(...hotels.map(h => h.distanceToHaram)) / 100) * 100;
    }, [hotels]);

    const [filters, setFilters] = useState<Filters>({ 
        sortBy: '', 
        stars: 0, 
        maxPrice: maxPossiblePrice,
        maxDistance: maxPossibleDistance
    });
    
    const filteredAndSortedHotels = useMemo(() => {
        let result = [...hotels];

        // Price filtering
        result = result.filter(hotel => hotel.priceStart <= filters.maxPrice);

        // Distance filtering
        result = result.filter(hotel => hotel.distanceToHaram <= filters.maxDistance);

        // Star filtering
        if (filters.stars > 0) {
            result = result.filter(hotel => Math.round(hotel.rating) === filters.stars);
        }

        // Sorting
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
            default:
                break;
        }

        return result;
    }, [hotels, filters]);


    return (
        <>
            <Header title="Our Hotels" />
            <InfoBanner />
            <main>
                 <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                       <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-primary">Explore All Our Hotels</h1>
                            <p className="mt-2 text-lg text-gray-600">Find the perfect stay for your spiritual journey.</p>
                       </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <aside className="w-full md:w-1/4 lg:w-1/5">
                                <FilterBar 
                                    filters={filters} 
                                    setFilters={setFilters}
                                    maxPriceValue={maxPossiblePrice}
                                    maxDistanceValue={maxPossibleDistance}
                                    resultsCount={filteredAndSortedHotels.length}
                                />
                            </aside>
                            <div className="w-full md:w-3/4 lg:w-4/5">
                                {filteredAndSortedHotels.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredAndSortedHotels.map((hotel: Hotel) => (
                                            <HotelCard key={hotel.id} hotel={hotel} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                        <h3 className="text-xl font-semibold text-gray-700">No Hotels Match Your Filters</h3>
                                        <p className="text-gray-500 mt-2">Try adjusting your filter criteria.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default AllHotelsPage;
