
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useInvoice } from '../context/InvoiceContext';
import { useAgency } from '../context/AgencyContext';
import { useCurrency } from '../context/CurrencyContext';
import { Invoice } from '../types';
import InvoiceReportModal from '../components/InvoiceReportModal';

declare const jspdf: any;

const AdminInvoicesPage: React.FC = () => {
    const { invoices } = useInvoice();
    const { agencies } = useAgency();
    const { convertPrice } = useCurrency();

    const [filterAgencyId, setFilterAgencyId] = useState<string>('');
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            return !filterAgencyId || invoice.agentId === filterAgencyId;
        });
    }, [invoices, filterAgencyId]);

    const handleDownloadInvoice = (invoice: Invoice) => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Transaction Invoice", 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Invoice ID: ${invoice.id}`, 14, 40);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 47);

        doc.line(14, 55, 196, 55);

        doc.text(`Agency: ${invoice.agentName} (ID: ${invoice.agentId})`, 14, 65);
        doc.text(`Description: ${invoice.description}`, 14, 72);
        
        doc.setFontSize(16);
        doc.text(`Type: ${invoice.type}`, 14, 90);
        doc.text(`Amount: ${convertPrice(invoice.amount)}`, 196, 90, { align: 'right' });

        doc.line(14, 100, 196, 100);
        
        doc.save(`invoice-${invoice.id}.pdf`);
    };

    return (
        <DashboardLayout portal="admin">
            <h1 className="text-3xl font-bold text-primary mb-8">Invoices & Transactions</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex justify-between items-center">
                <div className="max-w-xs">
                    <label htmlFor="agency-filter" className="text-sm font-semibold text-gray-600">Filter by Agency</label>
                    <select
                        id="agency-filter"
                        value={filterAgencyId}
                        onChange={(e) => setFilterAgencyId(e.target.value)}
                        className="mt-1 w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        <option value="">All Agencies</option>
                        {agencies.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.profile.agencyName}</option>
                        ))}
                    </select>
                </div>
                 <button onClick={() => setReportModalOpen(true)} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 shadow">
                    Download Report
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date / Invoice ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div>{new Date(invoice.createdAt).toLocaleString()}</div>
                                        <div className="font-mono text-gray-500">{invoice.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.agentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.description}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${invoice.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {invoice.type === 'Credit' ? '+' : '-'} {convertPrice(invoice.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <button onClick={() => handleDownloadInvoice(invoice)} className="text-primary hover:underline">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredInvoices.length === 0 && <p className="text-center text-gray-500 py-8">No invoices found for the selected criteria.</p>}
                </div>
            </div>
             {isReportModalOpen && (
                <InvoiceReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                />
            )}
        </DashboardLayout>
    );
};

export default AdminInvoicesPage;