
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Hotel } from '../types';
import { HOTELS } from '../constants';

interface HotelContextType {
    hotels: Hotel[];
    addHotel: (hotel: Omit<Hotel, 'id'>) => void;
    updateHotel: (updatedHotel: Hotel) => void;
    deleteHotel: (hotelId: number) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const HotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [hotels, setHotels] = useState<Hotel[]>(HOTELS);

    const addHotel = (hotel: Omit<Hotel, 'id'>) => {
        setHotels(prevHotels => [
            ...prevHotels,
            { ...hotel, id: Date.now() } // Use timestamp for unique ID
        ]);
    };

    const updateHotel = (updatedHotel: Hotel) => {
        setHotels(prevHotels => 
            prevHotels.map(hotel => hotel.id === updatedHotel.id ? updatedHotel : hotel)
        );
    };

    const deleteHotel = (hotelId: number) => {
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));
    };

    return (
        <HotelContext.Provider value={{ hotels, addHotel, updateHotel, deleteHotel }}>
            {children}
        </HotelContext.Provider>
    );
};

export const useHotels = (): HotelContextType => {
    const context = useContext(HotelContext);
    if (context === undefined) {
        throw new Error('useHotels must be used within a HotelProvider');
    }
    return context;
};
