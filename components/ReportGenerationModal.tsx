import React, { useState } from 'react';
import { Agent, Booking } from '../types';
import { useBooking } from '../context/BookingContext';

// Extend the jsPDF interface for autotable
declare const jspdf: any;

interface ReportGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: Agent;
}

type TimeRange = '7d' | '30d' | 'month' | 'year';

const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({ isOpen, onClose, agent }) => {
    const { bookings } = useBooking();
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    if (!isOpen) return null;

    const getFilteredBookings = (): Booking[] => {
        const agentBookings = bookings.filter(b => b.agentDetails?.agencyId === agent.id);
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case '7d': startDate.setDate(now.getDate() - 7); break;
            case '30d': startDate.setDate(now.getDate() - 30); break;
            case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
            case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
        }

        return agentBookings.filter(b => new Date(b.checkInDate) >= startDate);
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = jspdf;
        // FIX: The cast to `jsPDFWithAutoTable` was removed. `doc` is now inferred as `any`.
        const doc = new jsPDF();
        
        const filteredData = getFilteredBookings();
        const totalRevenue = filteredData.reduce((sum, booking) => sum + booking.totalPrice, 0);

        // Header
        doc.setFontSize(20);
        doc.text("Agency Performance Report", 14, 22);
        
        // Agency Info
        doc.setFontSize(12);
        doc.text(`Agency: ${agent.profile.agencyName} (ID: ${agent.id})`, 14, 32);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

        // Summary
        doc.setFontSize(10);
        doc.text(`Total Bookings: ${filteredData.length}`, 14, 50);
        doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 56);
        doc.text(`Current Wallet Balance: $${agent.walletBalance.toFixed(2)}`, 14, 62);
        
        // Table
        const tableColumn = ["Booking ID", "Guest", "Hotel", "Check-in", "Price ($)", "Status"];
        const tableRows: (string | number)[][] = [];

        filteredData.forEach(booking => {
            const bookingData = [
                booking.id,
                booking.guestName,
                booking.hotel.name.substring(0, 25), // Truncate for space
                booking.checkInDate,
                booking.totalPrice.toFixed(2),
                booking.status,
            ];
            tableRows.push(bookingData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [0, 109, 119] }, // #006D77
        });

        doc.save(`report-${agent.id}-${timeRange}.pdf`);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" role="dialog">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Generate PDF Report</h2>
                    <p className="text-gray-600">For: {agent.profile.agencyName}</p>
                </div>
                <div className="p-6 space-y-4">
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

export default ReportGenerationModal;