import React, { useState, useEffect } from 'react';
import { Hotel, Room } from '../types';
import { useHotels } from '../context/HotelContext';
import { useToast } from '../context/ToastContext';

interface HotelFormProps {
    hotelToEdit?: Hotel | null;
    onClose: () => void;
}

const initialRoomData: Omit<Room, 'id'> = {
    type: 'Double',
    purchasePricePerNight: 0,
    agentPricePerNight: 0,
    customerPricePerNight: 0,
    available: true,
};

const HotelForm: React.FC<HotelFormProps> = ({ hotelToEdit, onClose }) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const [formData, setFormData] = useState<Omit<Hotel, 'id'> | Hotel>(() => {
        return hotelToEdit || {
            name: '', city: 'Makkah', address: '', availableFrom: today, availableTo: tomorrowStr,
            distanceToHaram: 0, rating: 3, priceStart: 0,
            imageUrl: 'https://picsum.photos/seed/newhotel/800/600', description: '', amenities: [], rooms: []
        };
    });
    const { addHotel, updateHotel } = useHotels();
    const { addToast } = useToast();
    
    const [isEditingRoom, setIsEditingRoom] = useState<Room | null>(null);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Omit<Room, 'id'> | Room>(initialRoomData);

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";
    const roomInputStyle = "w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-primary focus:border-primary transition duration-300";


    useEffect(() => {
        if (hotelToEdit) {
            setFormData({ ...hotelToEdit });
        }
    }, [hotelToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'rating' || name === 'distanceToHaram' || name === 'priceStart' ? parseFloat(value) : value }));
    };

    const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amenities = e.target.value.split(',').map(a => a.trim());
        setFormData(prev => ({...prev, amenities}));
    }

    const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setCurrentRoom(prev => ({ ...prev, [name]: checked }));
        } else {
            setCurrentRoom(prev => ({ ...prev, [name]: name.includes('Price') ? parseFloat(value) : value }));
        }
    };

    const handleSaveRoom = () => {
        if (isEditingRoom) { // Update existing room
            const updatedRooms = formData.rooms.map(room => room.id === isEditingRoom.id ? { ...isEditingRoom, ...currentRoom } as Room : room);
            setFormData(prev => ({ ...prev, rooms: updatedRooms }));
        } else { // Add new room
            const newRoom: Room = { ...currentRoom, id: `${formData.name || 'new-hotel'}-room-${Date.now()}` };
            setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
        }
        setShowRoomForm(false);
        setIsEditingRoom(null);
        setCurrentRoom(initialRoomData);
    };

    const handleEditRoom = (room: Room) => {
        setIsEditingRoom(room);
        setCurrentRoom(room);
        setShowRoomForm(true);
    };

    const handleDeleteRoom = (roomId: string) => {
        if(window.confirm('Are you sure you want to delete this room?')) {
            const updatedRooms = formData.rooms.filter(room => room.id !== roomId);
            setFormData(prev => ({ ...prev, rooms: updatedRooms }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if ('id' in formData) {
                await updateHotel(formData);
                addToast('Hotel updated successfully!', 'success');
            } else {
                await addHotel(formData);
                addToast('New hotel added successfully!', 'success');
            }
            onClose();
        } catch (error: any) {
            addToast(`Error: ${error.message || 'Could not save hotel.'}`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-primary">{hotelToEdit ? 'Manage Hotel & Rooms' : 'Add New Hotel'}</h3>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Hotel Details Form */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                    </div>
                     <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <select name="city" id="city" value={formData.city} onChange={handleChange} className={inputStyle}>
                            <option value="Makkah">Makkah</option>
                            <option value="Madina">Madina</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={inputStyle} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">Available From</label>
                        <input type="date" name="availableFrom" id="availableFrom" value={formData.availableFrom} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                        <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700">Available To</label>
                        <input type="date" name="availableTo" id="availableTo" value={formData.availableTo} onChange={handleChange} className={inputStyle} required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="distanceToHaram" className="block text-sm font-medium text-gray-700">Distance to Haram (m)</label>
                        <input type="number" name="distanceToHaram" id="distanceToHaram" value={formData.distanceToHaram} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                        <input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} min="1" max="5" step="0.1" className={inputStyle} required />
                    </div>
                    <div>
                        <label htmlFor="priceStart" className="block text-sm font-medium text-gray-700">Starting Price ($)</label>
                        <input type="number" name="priceStart" id="priceStart" value={formData.priceStart} onChange={handleChange} className={inputStyle} required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputStyle} required />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyle} required></textarea>
                 </div>
                 <div>
                    <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                    <input type="text" name="amenities" id="amenities" value={formData.amenities.join(', ')} onChange={handleAmenitiesChange} className={inputStyle} />
                 </div>


                {/* Room Management Section */}
                <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-semibold text-primary">Manage Rooms</h4>
                        {!showRoomForm && <button type="button" onClick={() => { setShowRoomForm(true); setIsEditingRoom(null); setCurrentRoom(initialRoomData);}} className="bg-primary-600 text-white font-bold py-1 px-3 rounded-md text-sm">+ Add Room</button>}
                    </div>

                    {showRoomForm ? (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3 border border-primary-200">
                            <h5 className="font-semibold">{isEditingRoom ? 'Edit Room' : 'Add New Room'}</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                    <label className="text-sm font-medium text-gray-700">Room Type</label>
                                    <select name="type" value={currentRoom.type} onChange={handleRoomChange} className={`${roomInputStyle} mt-1`}>
                                            <option>Single</option><option>Double</option><option>Suite</option><option>Quad</option>
                                    </select>
                               </div>
                                <div className="flex items-center justify-end self-end mb-2">
                                    <input type="checkbox" name="available" id="available" checked={currentRoom.available} onChange={handleRoomChange} className="h-4 w-4 text-primary rounded" />
                                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available</label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Purchase Price ($)</label>
                                    <input type="number" name="purchasePricePerNight" placeholder="e.g. 750" value={currentRoom.purchasePricePerNight} onChange={handleRoomChange} className={`${roomInputStyle} mt-1`} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Agent Price ($)</label>
                                    <input type="number" name="agentPricePerNight" placeholder="e.g. 850" value={currentRoom.agentPricePerNight || ''} onChange={handleRoomChange} className={`${roomInputStyle} mt-1`} />
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-gray-700">Customer Price ($)</label>
                                    <input type="number" name="customerPricePerNight" placeholder="e.g. 950" value={currentRoom.customerPricePerNight} onChange={handleRoomChange} className={`${roomInputStyle} mt-1`} />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button type="button" onClick={() => setShowRoomForm(false)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="button" onClick={handleSaveRoom} className="px-3 py-1 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">Save Room</button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purchase</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formData.rooms.map(room => (
                                        <tr key={room.id} className="text-gray-700">
                                            <td className="px-2 py-2 whitespace-nowrap text-sm">{room.type}</td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm">${room.purchasePricePerNight}</td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm">${room.agentPricePerNight}</td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm">${room.customerPricePerNight}</td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {room.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button type="button" onClick={() => handleEditRoom(room)} className="text-primary hover:text-primary-800">Edit</button>
                                                <button type="button" onClick={() => handleDeleteRoom(room.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {formData.rooms.length === 0 && <p className="text-center text-gray-500 py-4">No rooms added yet. Click "+ Add Room" to begin.</p>}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">{hotelToEdit ? 'Save Changes' : 'Add Hotel'}</button>
            </div>
        </form>
    );
};

export default HotelForm;