
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useHotels } from '../context/HotelContext';
import { Hotel, Room, BulkOrderItem, BulkOrder } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import AgentBookingModal from '../components/AgentBookingModal';
import { useBulkOrder } from '../context/BulkOrderContext';
import { useAgent } from '../context/AgentContext';
import { useToast } from '../context/ToastContext';
import { useAgency } from '../context/AgencyContext';

const AgentBulkBookingPage: React.FC = () => {
    const { hotels } = useHotels();
    const { convertPrice } = useCurrency();
    const { agent } = useAgent();
    const { bulkOrders, addBulkOrder, deleteBulkOrder } = useBulkOrder();
    const { updateAgentWallet } = useAgency();
    const { addToast } = useToast();

    // Form state
    const [selectedHotelId, setSelectedHotelId] = useState<number>(hotels[0]?.id || 0);
    const [selectedRoomId, setSelectedRoomId] = useState<string>(hotels[0]?.rooms[0]?.id || '');
    const [quantity, setQuantity] = useState<number>(1);
    const today = new Date().toISOString().split('T')[0];
    const [checkInDate, setCheckInDate] = useState(today);
    const [checkOutDate, setCheckOutDate] = useState(() => {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); return tomorrow.toISOString().split('T')[0];
    });

    // Derived state
    const [selectedHotel, setSelectedHotel] = useState<Hotel | undefined>(hotels[0]);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(hotels[0]?.rooms[0]);

    // Order state
    const [currentOrderItems, setCurrentOrderItems] = useState<BulkOrderItem[]>([]);
    const totalCurrentOrderPrice = currentOrderItems.reduce((acc, item) => acc + item.subtotal, 0);

    // Modal state
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [bookingItem, setBookingItem] = useState<BulkOrderItem | null>(null);

    const inputStyle = "w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    useEffect(() => {
        const hotel = hotels.find(h => h.id === selectedHotelId);
        setSelectedHotel(hotel);
        if (hotel) {
            const room = hotel.rooms.find(r => r.id === selectedRoomId) || hotel.rooms[0];
            setSelectedRoom(room);
            setSelectedRoomId(room?.id || '');
        }
    }, [selectedHotelId, selectedRoomId, hotels]);

    const handleAddToOrder = () => {
        if (!selectedHotel || !selectedRoom || quantity < 1) {
            addToast("Please select a valid hotel, room, and quantity.", 'error'); return;
        }
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            addToast("Check-out date must be after check-in date.", 'error'); return;
        }
        const nights = (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24);
        if(nights <= 0) {
             addToast("Check-out must be after check-in.", 'error'); return;
        }
        const agentPrice = selectedRoom.agentPricePerNight;
        const subtotal = quantity * agentPrice * nights;
        const newOrderItem: BulkOrderItem = {
            id: `${selectedRoom.id}-${Date.now()}`, hotelId: selectedHotel.id, hotelName: selectedHotel.name, roomId: selectedRoom.id,
            roomType: selectedRoom.type, quantity, pricePerNight: agentPrice, subtotal, hotel: selectedHotel,
            room: selectedRoom, checkInDate, checkOutDate,
        };
        setCurrentOrderItems(prev => [...prev, newOrderItem]);
    };

    const handleRemoveFromOrder = (itemId: string) => {
        setCurrentOrderItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSubmitOrder = () => {
        if (currentOrderItems.length === 0) { addToast("Your order is empty.", 'error'); return; }
        if (!agent) { addToast('Agent profile not found.', 'error'); return; }
        if (totalCurrentOrderPrice > agent.walletBalance) { addToast(`Insufficient wallet balance.`, 'error'); return; }

        updateAgentWallet(agent.id, totalCurrentOrderPrice, 'Debit', `Bulk Purchase - Order BO-${Date.now()}`);

        const newBulkOrder: Omit<BulkOrder, 'id' | 'status' | 'createdAt'> = {
            agentId: agent.id, agentName: agent.profile.agencyName, items: currentOrderItems, totalPrice: totalCurrentOrderPrice,
        };
        addBulkOrder(newBulkOrder);
        setCurrentOrderItems([]);
        addToast("Bulk purchase order submitted for approval!", 'success');
    };
    
    const handleDeleteOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this bulk purchase record? This does not refund the transaction.')) {
            deleteBulkOrder(orderId);
            addToast('Order record deleted.', 'info');
        }
    };

    const handleOpenAssignModal = (item: BulkOrderItem) => { setBookingItem(item); setAssignModalOpen(true); };

    const getStatusColor = (status: BulkOrder['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
        }
    }
    
    return (
        <DashboardLayout portal="agent">
            <h1 className="text-3xl font-bold text-primary mb-8">Create & Manage Bulk Bookings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4">1. Create New Bulk Purchase</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end my-4">
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Hotel</label>
                        <select value={selectedHotelId} onChange={e => setSelectedHotelId(Number(e.target.value))} className={inputStyle}>
                            {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Room</label>
                        <select value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} className={inputStyle}>
                            {selectedHotel?.rooms.map(room => <option key={room.id} value={room.id}>{room.type}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Check-in</label>
                        <input type="date" value={checkInDate} min={today} onChange={e => setCheckInDate(e.target.value)} className={inputStyle} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Check-out</label>
                        <input type="date" value={checkOutDate} min={checkInDate} onChange={e => setCheckOutDate(e.target.value)} className={inputStyle} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1"># Rooms</label>
                        <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className={inputStyle} />
                    </div>
                </div>
                <button onClick={handleAddToOrder} className="bg-primary w-full md:w-auto hover:bg-primary-800 text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow">
                    + Add to Purchase
                </button>
                {currentOrderItems.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Purchase Items</h3>
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Hotel & Room</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Dates</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Qty</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Subtotal</th>
                                        <th className="px-4 py-2 text-center font-medium text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrderItems.map(item => (
                                        <tr key={item.id} className="border-b text-gray-900">
                                            <td className="px-4 py-2">{item.hotelName} ({item.roomType})</td>
                                            <td className="px-4 py-2">{item.checkInDate} to {item.checkOutDate}</td>
                                            <td className="px-4 py-2">{item.quantity}</td>
                                            <td className="px-4 py-2 font-semibold">{convertPrice(item.subtotal)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => handleRemoveFromOrder(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-semibold text-gray-700">Current Purchase Total: <span className="text-primary">{convertPrice(totalCurrentOrderPrice)}</span></h3>
                            <button onClick={handleSubmitOrder} className="bg-secondary w-full sm:w-auto text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 shadow">
                                Submit Purchase for Approval
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-primary mb-4">2. My Bulk Purchases</h2>
                <div className="space-y-4">
                    {bulkOrders.filter(o => o.agentId === agent?.id).map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                                <div>
                                    <span className="font-mono text-primary mr-3">{order.id}</span>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="font-semibold text-gray-800">{convertPrice(order.totalPrice)}</div>
                                    <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:text-red-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 mb-3">{new Date(order.createdAt).toLocaleString()}</div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Hotel & Room</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Dates</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Qty</th>
                                            <th className="px-4 py-2 text-center font-medium text-gray-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map(item => (
                                            <tr key={item.id} className="border-b text-gray-900">
                                                <td className="px-4 py-2">{item.hotelName} ({item.roomType})</td>
                                                <td className="px-4 py-2">{item.checkInDate} to {item.checkOutDate}</td>
                                                <td className="px-4 py-2">{item.quantity}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button 
                                                        onClick={() => handleOpenAssignModal(item)} 
                                                        disabled={order.status !== 'Confirmed'}
                                                        className="text-primary hover:underline font-semibold disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                                                        title={order.status !== 'Confirmed' ? 'Order must be confirmed by admin before assigning' : 'Assign to customer'}
                                                    >
                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {bulkOrders.filter(o => o.agentId === agent?.id).length === 0 && (
                        <p className="text-center text-gray-500 py-4">You have not made any bulk purchases yet.</p>
                    )}
                </div>
            </div>

            {isAssignModalOpen && bookingItem && ( <AgentBookingModal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} item={bookingItem} /> )}
        </DashboardLayout>
    );
};

export default AgentBulkBookingPage;