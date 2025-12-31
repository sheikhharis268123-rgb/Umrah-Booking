
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useHotels } from '../context/HotelContext';
import Modal from '../components/Modal';
import HotelForm from '../components/HotelForm';
import { Hotel } from '../types';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);

const AdminHotelsPage: React.FC = () => {
    const { hotels, deleteHotel } = useHotels();
    const { refreshData } = useBooking();
    const { addToast } = useToast();

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Note: This refreshes booking data which is the main live data source.
            // A full implementation would have separate refresh handlers for each data type.
            await refreshData();
            addToast('Data refreshed successfully.', 'success');
        } catch {
            addToast('Failed to refresh data.', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

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
                 <div className="flex items-center gap-4">
                    <button onClick={handleOpenAddModal} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-800 transition duration-300 shadow">
                        + Add New Hotel
                    </button>
                    <button onClick={handleRefresh} disabled={isRefreshing} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                        <RefreshIcon isRefreshing={isRefreshing} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
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
