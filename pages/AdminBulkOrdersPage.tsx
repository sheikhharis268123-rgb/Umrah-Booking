import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useBulkOrder } from '../context/BulkOrderContext';
import { useCurrency } from '../context/CurrencyContext';
import { BulkOrder } from '../types';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { useAgency } from '../context/AgencyContext';

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);

const AdminBulkOrdersPage: React.FC = () => {
    const { bulkOrders, updateBulkOrderStatus } = useBulkOrder();
    const { convertPrice } = useCurrency();
    const { refreshData } = useBooking();
    const { addToast } = useToast();
    const { updateAgentWallet } = useAgency();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const sortedOrders = useMemo(() => {
        return [...bulkOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [bulkOrders]);
    
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshData();
            addToast('Data refreshed successfully.', 'success');
        } catch {
            addToast('Failed to refresh data.', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleStatusChange = (orderId: string, newStatus: BulkOrder['status']) => {
        const orderToUpdate = bulkOrders.find(o => o.id === orderId);
        if (!orderToUpdate) {
            addToast(`Error: Could not find order ${orderId}.`, 'error');
            return;
        }

        const previousStatus = orderToUpdate.status;
        if (newStatus === previousStatus) return;

        // If an order is rejected, refund the agent's wallet.
        if (newStatus === 'Rejected' && previousStatus !== 'Rejected') {
            updateAgentWallet(
                orderToUpdate.agentId,
                orderToUpdate.totalPrice,
                'Credit',
                `Refund for rejected bulk order: ${orderId}`
            );
            addToast(`Refund for ${convertPrice(orderToUpdate.totalPrice)} processed for order ${orderId}.`, 'success');
        } 
        // If a previously rejected order is re-approved, debit the wallet again.
        else if (previousStatus === 'Rejected' && newStatus !== 'Rejected') {
            updateAgentWallet(
                orderToUpdate.agentId,
                orderToUpdate.totalPrice,
                'Debit',
                `Re-charge for re-approved bulk order: ${orderId}`
            );
             addToast(`Wallet charged ${convertPrice(orderToUpdate.totalPrice)} for re-approved order ${orderId}.`, 'success');
        }

        updateBulkOrderStatus(orderId, newStatus);
        addToast(`Order ${orderId} status updated to ${newStatus}.`, 'info');
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
                <button onClick={handleRefresh} disabled={isRefreshing} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    <RefreshIcon isRefreshing={isRefreshing} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
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