
import React from 'react';
import { Filters } from '../pages/CustomerPortal';
import { useCurrency } from '../context/CurrencyContext';

interface FilterBarProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    maxPriceValue: number;
    maxDistanceValue: number;
    resultsCount: number;
}

const StarIcon: React.FC<{ filled: boolean, isHover?: boolean }> = ({ filled, isHover }) => (
  <svg
    className={`w-6 h-6 transition-colors ${filled ? 'text-yellow-400' : isHover ? 'text-yellow-300' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, maxPriceValue, maxDistanceValue, resultsCount }) => {
    const { convertPrice } = useCurrency();

    const handleSortChange = (sortBy: Filters['sortBy']) => {
        setFilters(prev => ({ ...prev, sortBy }));
    };

    const handleStarChange = (stars: number) => {
        setFilters(prev => ({ ...prev, stars: prev.stars === stars ? 0 : stars }));
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, maxPrice: Number(e.target.value)}));
    };

    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, maxDistance: Number(e.target.value)}));
    };

    const sortOptions: { key: Filters['sortBy'], label: string }[] = [
        { key: 'price-asc', label: 'Price Asc' },
        { key: 'price-desc', label: 'Price Desc' },
        { key: 'distance-asc', label: 'Distance' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="pb-4 border-b">
                <h3 className="text-lg font-semibold text-primary">Filter & Sort</h3>
                <p className="text-sm text-gray-500">{resultsCount} hotels found</p>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800 mb-3">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                    {sortOptions.map(opt => (
                        <button 
                            key={opt.key}
                            onClick={() => handleSortChange(opt.key)}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filters.sortBy === opt.key ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                     {filters.sortBy && <button onClick={() => handleSortChange('')} className="text-xs text-gray-500 hover:underline">Clear</button>}
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Price per Night</h4>
                <input 
                    type="range"
                    min={0}
                    max={maxPriceValue}
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{convertPrice(0)}</span>
                    <span className="font-bold text-secondary">Up to {convertPrice(filters.maxPrice)}</span>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Distance to Haram</h4>
                <input 
                    type="range"
                    min={0}
                    max={maxDistanceValue}
                    value={filters.maxDistance}
                    onChange={handleDistanceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>0m</span>
                    <span className="font-bold text-secondary">Up to {filters.maxDistance}m</span>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-800 mb-3">Star Rating</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <button
                                key={starValue}
                                onClick={() => handleStarChange(starValue)}
                                className="focus:outline-none group"
                                aria-label={`${starValue} stars`}
                            >
                                <StarIcon filled={starValue <= filters.stars} />
                            </button>
                        ))}
                    </div>
                    {filters.stars > 0 && <button onClick={() => handleStarChange(0)} className="text-xs text-gray-500 hover:underline mt-2">Clear Rating</button>}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
