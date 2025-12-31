import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { Room } from '../types';
import { useBooking } from '../context/BookingContext';
import BookingModal from '../components/BookingModal';
import AmenityIcon from '../components/AmenityIcon';
import { useHotels } from '../context/HotelContext';
import { useCurrency } from '../context/CurrencyContext';

const HotelDetailPage: React.FC = () => {
    const { hotelId } = useParams<{ hotelId: string }>();
    const { openBookingModal } = useBooking();
    const { hotels } = useHotels();
    const { convertPrice } = useCurrency();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const hotel = hotels.find(h => h.id === parseInt(hotelId || ''));

    if (!hotel) {
        return (
            <>
                <Header title="Umrah Hotels" />
                <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Hotel Not Found</h1>
                    <p className="text-gray-600 mb-8">We couldn't find the hotel you were looking for.</p>
                    <Link to="/" className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary-800 transition shadow-md">
                        Back to Home
                    </Link>
                </div>
                <Footer />
            </>
        );
    }
    
    const handleBookNow = (room: Room) => {
        openBookingModal(hotel, room);
    };

    return (
        <>
            <Header title={hotel.city} />
            <main>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                             <div className="lg:col-span-3">
                                <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-64 md:h-96 lg:h-full object-cover" />
                             </div>
                             <div className="lg:col-span-2 p-6 md:p-10 flex flex-col justify-center bg-gray-50/50">
                                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 leading-tight">{hotel.name}</h1>
                                 <div className="flex items-center mb-5">
                                     <StarRating rating={hotel.rating} />
                                     <span className="ml-2 text-sm md:text-base text-gray-600 font-medium">{hotel.rating.toFixed(1)} Stars</span>
                                 </div>
                                 <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 leading-relaxed">{hotel.description}</p>
                                 <div className="flex items-center text-secondary font-bold text-sm md:text-base">
                                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                     {hotel.distanceToHaram}m from Haram
                                 </div>
                             </div>
                        </div>
                        
                        <div className="p-6 md:p-10 border-t">
                            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">Available Amenities</h2>
                            <div className="flex flex-wrap gap-2.5">
                               {hotel.amenities.map(amenity => <AmenityIcon key={amenity} amenity={amenity} />)}
                            </div>
                        </div>

                        <div className="p-6 md:p-10 border-t bg-gray-50/30">
                            <h2 className="text-xl md:text-2xl font-bold text-primary mb-8 text-center md:text-left">Available Rooms</h2>
                            <div className="grid grid-cols-1 gap-8">
                                {hotel.rooms.map(room => (
                                    <div key={room.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden text-center transition-all hover:shadow-lg">
                                        <div className="p-8">
                                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">{room.type} Room</h3>
                                            <p className="text-gray-500 max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
                                                Includes standard amenities for a comfortable stay with high-quality service.
                                            </p>
                                            
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t pt-8">
                                                <div className="text-left">
                                                    <span className="text-2xl md:text-3xl font-black text-primary">{convertPrice(room.customerPricePerNight)}</span>
                                                    <span className="text-gray-400 text-sm ml-1 font-medium">/night</span>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleBookNow(room)}
                                                    disabled={!room.available}
                                                    className="w-full sm:w-auto bg-secondary text-white font-bold py-4 px-12 rounded-2xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md text-lg transform active:scale-95">
                                                    {room.available ? 'Book Now' : 'Sold Out'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <BookingModal />
            <Footer />
        </>
    );
};

export default HotelDetailPage;