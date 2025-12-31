
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useHotels } from '../context/HotelContext';
import Modal from '../components/Modal';
import HotelForm from '../components/HotelForm';
import { Hotel } from '../types';

const AdminHotelsPage: React.FC = () => {
    const { hotels, deleteHotel } = useHotels();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

    const sortedHotels = useMemo(() => {
        return [...hotels].sort((a, b) => b.id - a.id);
    }, [hotels]);

    const handleOpenAddModal = () => {
        setEditingHotel(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (hotel: Hotel) => {
        setEditingHotel(hotel);
        setModalOpen(true);
    };

    const handleDelete = (hotelId: number) => {
        if (window.confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
            deleteHotel(hotelId);
        }
    };

    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Manage Hotels</h1>
                <button onClick={handleOpenAddModal} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-800 transition duration-300 shadow">
                    + Add New Hotel
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedHotels.map(hotel => (
                                <tr key={hotel.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.rooms.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenEditModal(hotel)} className="text-primary hover:text-primary-800 font-semibold">Manage Hotel</button>
                                        <button onClick={() => handleDelete(hotel.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <HotelForm hotelToEdit={editingHotel} onClose={() => setModalOpen(false)} />
            </Modal>
        </DashboardLayout>
    );
};

export default AdminHotelsPage;