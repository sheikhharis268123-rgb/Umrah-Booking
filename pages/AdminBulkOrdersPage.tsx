
import React, { useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useBulkOrder } from '../context/BulkOrderContext';
import { useCurrency } from '../context/CurrencyContext';
import { BulkOrder } from '../types';

const AdminBulkOrdersPage: React.FC = () => {
    const { bulkOrders, updateBulkOrderStatus } = useBulkOrder();
    const { convertPrice } = useCurrency();

    const sortedOrders = useMemo(() => {
        return [...bulkOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [bulkOrders]);

    const handleStatusChange = (orderId: string, newStatus: BulkOrder['status']) => {
        updateBulkOrderStatus(orderId, newStatus);
    };
    
    const getStatusColorClasses = (status: BulkOrder['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
        }
    };

    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Agent Bulk Orders</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID / Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="font-mono text-primary">{order.id}</div>
                                        <div className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.agentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{convertPrice(order.totalPrice)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as BulkOrder['status'])} 
                                            className={`w-full p-1.5 border rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-400 ${getStatusColorClasses(order.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedOrders.length === 0 && <p className="text-center text-gray-500 py-8">No bulk orders found.</p>}
            </div>
        </DashboardLayout>
    );
};

export default AdminBulkOrdersPage;