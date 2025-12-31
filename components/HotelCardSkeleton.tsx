
import React from 'react';

const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center mt-auto pt-4 border-t">
          <div>
            <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded-md w-28"></div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;
