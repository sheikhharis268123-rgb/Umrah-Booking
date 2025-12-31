
import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '../types';
import StarRating from './StarRating';
import { useCurrency } from '../context/CurrencyContext';

interface HotelCardProps {
  hotel: Hotel;
}

const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { convertPrice } = useCurrency();
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl flex flex-col relative">
      {hotel.rating === 5 && (
          <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
              5-Star
          </div>
      )}
      <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-56 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl mb-2 text-primary pr-4">{hotel.name}</h3>
            <StarRating rating={hotel.rating} />
        </div>
        <p className="text-gray-600 text-sm flex items-center mb-4">
            <LocationPinIcon />
            {hotel.city} - {hotel.distanceToHaram}m from Haram
        </p>
        <p className="text-gray-700 text-base mb-4 line-clamp-2 flex-grow">{hotel.description}</p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t">
          <div>
            <span className="text-sm text-gray-500">Starts from</span>
            <p className="font-bold text-lg text-primary">{convertPrice(hotel.priceStart)}<span className="font-normal text-sm">/night</span></p>
          </div>
          <Link to={`/hotel/${hotel.id}`} className="bg-primary hover:bg-primary-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-center">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
