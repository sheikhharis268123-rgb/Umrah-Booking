
import React, { useState } from 'react';
import { Invoice } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { useAgency } from '../context/AgencyContext';
import { useCurrency } from '../context/CurrencyContext';

declare const jspdf: any;

interface InvoiceReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TimeRange = '7d' | '30d' | 'month' | 'year';

const InvoiceReportModal: React.FC<InvoiceReportModalProps> = ({ isOpen, onClose }) => {
    const { invoices } = useInvoice();
    const { agencies } = useAgency();
    const { convertPrice } = useCurrency();

    const [timeRange, setTimeRange] = useState<TimeRange>('30d');
    const [selectedAgencyId, setSelectedAgencyId] = useState<string>(agencies[0]?.id || '');

    if (!isOpen) return null;

    const handleDownloadPdf = () => {
        const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
        if (!selectedAgency) {
            alert("Please select an agency.");
            return;
        }

        const now = new Date();
        let startDate = new Date();
        switch (timeRange) {
            case '7d': startDate.setDate(now.getDate() - 7); break;
            case '30d': startDate.setDate(now.getDate() - 30); break;
            case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
            case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
        }

        const filteredInvoices = invoices.filter(inv => 
            inv.agentId === selectedAgencyId && new Date(inv.createdAt) >= startDate
        );

        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Agency Transaction Report", 14, 22);
        
        doc.setFontSize(12);
        doc.text(`Agency: ${selectedAgency.profile.agencyName} (ID: ${selectedAgency.id})`, 14, 32);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

        const totalCredit = filteredInvoices.filter(i => i.type === 'Credit').reduce((sum, i) => sum + i.amount, 0);
        const totalDebit = filteredInvoices.filter(i => i.type === 'Debit').reduce((sum, i) => sum + i.amount, 0);

        doc.setFontSize(10);
        doc.text(`Total Credit: ${convertPrice(totalCredit)}`, 14, 50);
        doc.text(`Total Debit: ${convertPrice(totalDebit)}`, 14, 56);
        doc.text(`Net Change: ${convertPrice(totalCredit - totalDebit)}`, 14, 62);
        
        const tableColumn = ["Date", "Invoice ID", "Description", "Type", "Amount"];
        const tableRows: (string | number)[][] = [];

        filteredInvoices.forEach(invoice => {
            const invoiceData = [
                new Date(invoice.createdAt).toLocaleDateString(),
                invoice.id,
                invoice.description,
                invoice.type,
                convertPrice(invoice.amount),
            ];
            tableRows.push(invoiceData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [0, 109, 119] },
        });

        doc.save(`invoice-report-${selectedAgency.id}-${timeRange}.pdf`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" role="dialog">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Generate Invoice Report</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="agencySelect" className="block text-sm font-medium text-gray-700">Select Agency</label>
                        <select
                            id="agencySelect"
                            value={selectedAgencyId}
                            onChange={(e) => setSelectedAgencyId(e.target.value)}
                            className="mt-1 block w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            {agencies.map(agent => <option key={agent.id} value={agent.id}>{agent.profile.agencyName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">Select Time Range</label>
                        <select
                            id="timeRange"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="mt-1 block w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleDownloadPdf} className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">
                        Generate & Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceReportModal;