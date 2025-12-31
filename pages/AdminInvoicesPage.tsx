
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useInvoice } from '../context/InvoiceContext';
import { useAgency } from '../context/AgencyContext';
import { useCurrency } from '../context/CurrencyContext';
import { useSettings } from '../context/SettingsContext';
import { Invoice } from '../types';
import InvoiceReportModal from '../components/InvoiceReportModal';

declare const jspdf: any;

const AdminInvoicesPage: React.FC = () => {
    const { invoices } = useInvoice();
    const { agencies } = useAgency();
    const { websiteName } = useSettings();
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
        const pageWidth = doc.internal.pageSize.getWidth();
        const agency = agencies.find(a => a.id === invoice.agentId);

        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 109, 119); // Primary color
        doc.text(websiteName, pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(52, 58, 64); // Dark neutral
        doc.text("Transaction Invoice", pageWidth / 2, 28, { align: 'center' });

        // Invoice Details
        doc.setFontSize(10);
        doc.text(`Invoice ID: ${invoice.id}`, 14, 45);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 50);

        // Agency Details
        if (agency) {
            const agencyDetails = `Billed to:\n${agency.profile.agencyName}\nID: ${agency.id}\n${agency.profile.contactEmail}`;
            doc.text(agencyDetails, pageWidth - 14, 45, { align: 'right' });
        }
        
        doc.setLineWidth(0.5);
        doc.line(14, 60, pageWidth - 14, 60);

        // Body with autoTable
        doc.autoTable({
            startY: 70,
            head: [['Description', 'Type', 'Amount']],
            body: [[invoice.description, invoice.type, convertPrice(invoice.amount)]],
            theme: 'grid',
            headStyles: { fillColor: [0, 109, 119] },
            didDrawPage: (data: any) => {
                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('Thank you for your business!', 14, doc.internal.pageSize.getHeight() - 10);
                doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            }
        });
        
        doc.save(`invoice-${invoice.id}.pdf`);
    };

    return (
        <DashboardLayout portal="admin">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-primary">Invoices & Transactions</h1>
                <button onClick={() => window.location.reload()} className="group flex items-center bg-white text-primary font-semibold py-2 px-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition duration-300 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.693L19.015 7.74M4.036 7.74l3.182 3.182" />
                    </svg>
                    Refresh Data
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:max-w-xs">
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
                 <button onClick={() => setReportModalOpen(true)} className="bg-secondary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 shadow w-full sm:w-auto">
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
