
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAgency } from '../context/AgencyContext';
import { Agent } from '../types';
import AgencyFormModal from '../components/AgencyFormModal';
import ReportGenerationModal from '../components/ReportGenerationModal';
import { useCurrency } from '../context/CurrencyContext';
import WalletModal from '../components/WalletModal';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';

const RefreshIcon: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
    </svg>
);

const AdminAgenciesPage: React.FC = () => {
    const { agencies, updateAgentStatus } = useAgency();
    const { convertPrice } = useCurrency();
    const { refreshData } = useBooking();
    const { addToast } = useToast();
    
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isWalletModalOpen, setWalletModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const handleStatusToggle = (agent: Agent) => {
        const newStatus = agent.status === 'Active' ? 'Inactive' : 'Active';
        updateAgentStatus(agent.id, newStatus);
    };

    const handleOpenAddModal = () => {
        setSelectedAgent(null);
        setFormModalOpen(true);
    };
    
    const handleOpenEditModal = (agent: Agent) => {
        setSelectedAgent(agent);
        setFormModalOpen(true);
    };
    
    const handleOpenReportModal = (agent: Agent) => {
        setSelectedAgent(agent);
        setReportModalOpen(true);
    };

    const handleOpenWalletModal = (agent: Agent) => {
        setSelectedAgent(agent);
        setWalletModalOpen(true);
    };

    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Manage Agencies</h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleOpenAddModal} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-800 transition duration-300 shadow">
                        + Add New Agency
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {agencies.map(agent => (
                                <tr key={agent.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="font-medium text-gray-900">{agent.profile.agencyName}</div>
                                        <div className="text-gray-500">{agent.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{convertPrice(agent.walletBalance)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <label htmlFor={`toggle-${agent.id}`} className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input id={`toggle-${agent.id}`} type="checkbox" className="sr-only" checked={agent.status === 'Active'} onChange={() => handleStatusToggle(agent)} />
                                                <div className={`block w-14 h-8 rounded-full ${agent.status === 'Active' ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${agent.status === 'Active' ? 'translate-x-6' : ''}`}></div>
                                            </div>
                                            <div className="ml-3 text-gray-700 font-medium">{agent.status}</div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenEditModal(agent)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                                        <button onClick={() => handleOpenWalletModal(agent)} className="text-green-600 hover:underline font-semibold">Manage Wallet</button>
                                        <Link to={`/admin/bookings?agencyId=${agent.id}`} className="text-primary hover:underline font-semibold">View Bookings</Link>
                                        <button onClick={() => handleOpenReportModal(agent)} className="text-secondary hover:underline font-semibold">Download Report</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormModalOpen && (
                <AgencyFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setFormModalOpen(false)}
                    agentToEdit={selectedAgent}
                />
            )}
            
            {isReportModalOpen && selectedAgent && (
                <ReportGenerationModal
                    isOpen={isReportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    agent={selectedAgent}
                />
            )}
            
            {isWalletModalOpen && selectedAgent && (
                <WalletModal
                    isOpen={isWalletModalOpen}
                    onClose={() => setWalletModalOpen(false)}
                    agent={selectedAgent}
                />
            )}

        </DashboardLayout>
    );
};

export default AdminAgenciesPage;
