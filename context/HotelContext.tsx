import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Hotel } from '../types';
import { HOTELS } from '../constants'; // Kept for fallback on API error
import { getApiUrl, API_BASE_URL } from '../apiConfig';

interface HotelContextType {
    hotels: Hotel[];
    addHotel: (hotel: Omit<Hotel, 'id'>) => Promise<void>;
    updateHotel: (updatedHotel: Hotel) => Promise<void>;
    deleteHotel: (hotelId: number) => Promise<void>;
    isLoading: boolean;
    refreshHotels: () => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const mapApiHotelToLocal = (apiHotel: any): Hotel => ({
  id: Number(apiHotel.id),
  name: apiHotel.name,
  city: apiHotel.city,
  address: apiHotel.address,
  availableFrom: apiHotel.available_from,
  availableTo: apiHotel.available_to,
  distanceToHaram: Number(apiHotel.distance_to_haram),
  rating: Number(apiHotel.rating),
  priceStart: Number(apiHotel.price_start),
  imageUrl: apiHotel.image_url,
  description: apiHotel.description,
  amenities: Array.isArray(apiHotel.amenities) ? apiHotel.amenities : JSON.parse(apiHotel.amenities || '[]'),
  rooms: Array.isArray(apiHotel.rooms) ? apiHotel.rooms.map((r: any) => ({
      id: r.id.toString(),
      type: r.type,
      purchasePricePerNight: Number(r.purchase_price_per_night),
      agentPricePerNight: Number(r.agent_price_per_night),
      customerPricePerNight: Number(r.customer_price_per_night),
      available: Boolean(Number(r.available)),
  })) : [],
});

const mapLocalHotelToApi = (localHotel: Omit<Hotel, 'id'> | Hotel) => ({
    name: localHotel.name,
    city: localHotel.city,
    address: localHotel.address,
    available_from: localHotel.availableFrom,
    available_to: localHotel.availableTo,
    distance_to_haram: localHotel.distanceToHaram,
    rating: localHotel.rating,
    price_start: localHotel.priceStart,
    image_url: localHotel.imageUrl,
    description: localHotel.description,
    amenities: JSON.stringify(localHotel.amenities),
    rooms: localHotel.rooms.map(r => ({
        id: r.id,
        type: r.type,
        purchase_price_per_night: r.purchasePricePerNight,
        agent_price_per_night: r.agentPricePerNight,
        customer_price_per_night: r.customerPricePerNight,
        available: r.available,
    })),
    ...('id' in localHotel && { id: localHotel.id })
});

export const HotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHotels = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(getApiUrl('hotels'));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if(!Array.isArray(data)) throw new Error("API did not return an array of hotels");
            const mappedHotels = data.map(mapApiHotelToLocal);
            setHotels(mappedHotels);
        } catch (error) {
            console.error("Failed to fetch hotels from API, falling back to static data:", error);
            setHotels(HOTELS); // Fallback to static data on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);


    const addHotel = async (hotelData: Omit<Hotel, 'id'>) => {
        try {
            const apiPayload = {
                ...mapLocalHotelToApi(hotelData),
                endpoint: 'hotels'
            };
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });
            const newApiHotel = await response.json();
            if (!response.ok) throw new Error(newApiHotel.error || 'Failed to add hotel');
            
            await fetchHotels(); // Refetch all hotels to get the latest state from DB
        } catch (error) {
            console.error("Error adding hotel:", error);
            throw error;
        }
    };

    const updateHotel = async (updatedHotel: Hotel) => {
        try {
            const apiPayload = {
                ...mapLocalHotelToApi(updatedHotel),
                endpoint: 'hotels',
                id: updatedHotel.id
            };
            const response = await fetch(API_BASE_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });
            const updatedApiHotel = await response.json();
            if (!response.ok) throw new Error(updatedApiHotel.error || 'Failed to update hotel');
            
            await fetchHotels(); // Refetch all hotels
        } catch (error) {
            console.error("Error updating hotel:", error);
            throw error;
        }
    };

    const deleteHotel = async (hotelId: number) => {
        try {
            const response = await fetch(getApiUrl('hotels', { id: hotelId }), {
                method: 'DELETE',
            });
            const result = await response.json();
             if (!response.ok) throw new Error(result.error || 'Failed to delete hotel');
             
            setHotels(prev => prev.filter(h => h.id !== hotelId));
        } catch(error) {
            console.error("Error deleting hotel:", error);
            throw error;
        }
    };

    return (
        <HotelContext.Provider value={{ hotels, addHotel, updateHotel, deleteHotel, isLoading, refreshHotels: fetchHotels }}>
            {isLoading ? <div className="flex h-screen items-center justify-center"><p className="text-xl font-semibold text-primary">Loading Hotel Data...</p></div> : children}
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