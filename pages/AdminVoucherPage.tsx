
import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { Currency } from '../types';
import DashboardLayout from '../components/DashboardLayout';

declare const jspdf: any;
declare const html2canvas: any;

const ArrowIcon: React.FC<{className?: string}> = ({className}) => (
    <div className={`w-10 h-10 flex items-center justify-center rounded-md bg-primary ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
);


const AdminVoucherPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { bookings } = useBooking();
    const { currency, setCurrency, convertPrice } = useCurrency();
    const voucherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const booking = bookings.find(b => b.id === bookingId);
    
    const handleDownloadPdf = async () => {
        const input = voucherRef.current;
        if (input) {
            const originalWidth = input.style.width;
            input.style.width = '800px';

            try {
                const canvas = await html2canvas(input, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`voucher-${bookingId}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                input.style.width = originalWidth;
            }
        }
    };

    if (!booking) {
        return (
            <DashboardLayout portal="admin">
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl font-bold text-primary mb-4">Booking Not Found</h1>
                    <p className="text-gray-600 mb-8">The voucher you are looking for does not exist.</p>
                    <Link to="/admin/bookings" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-800 transition">
                        Back to All Bookings
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const { id, hotel, room, guestName, contactNumber, checkInDate, checkOutDate, totalPrice, status, showPriceOnVoucher, agentDetails } = booking;
    
    const shouldShowPrice = !agentDetails || showPriceOnVoucher === true;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    }

    return (
        <DashboardLayout portal="admin">
            <div className="max-w-4xl mx-auto">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4 print:hidden gap-4">
                    <Link to="/admin/bookings" className="text-primary hover:underline">&larr; Back to All Bookings</Link>
                    <div className="flex items-center space-x-2">
                         <div>
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                                className="bg-white border border-gray-300 text-gray-700 rounded-md py-2 pl-2 pr-8 text-sm focus:ring-primary focus:border-primary focus:outline-none"
                            >
                                <option value="PKR">PKR</option>
                                <option value="SAR">SAR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <button onClick={handleDownloadPdf} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-800 transition">
                            Download PDF
                        </button>
                        <button onClick={() => window.print()} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition">
                            Print
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                     <div id="voucher-print-area" ref={voucherRef} className="bg-white shadow-lg min-w-[800px]">
                            <div className="h-2 bg-primary"></div>
                            <div className="p-8 md:p-10">
                                <header className="flex justify-between items-start pb-6">
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <ArrowIcon />
                                            <h1 className="text-3xl font-bold text-primary">Umrah Hotels</h1>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-2">Booking Voucher</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-700">Booking ID</p>
                                        <p className="font-mono text-lg text-secondary">{id}</p>
                                        <p className="font-semibold text-gray-700 mt-2">Expires On</p>
                                        <p className="text-sm text-gray-600">{formatDate(checkOutDate)}</p>
                                    </div>
                                </header>

                                <section className="grid grid-cols-2 gap-8 py-8 border-b">
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary mb-1">Guest Information</h3>
                                        <p className="font-bold text-xl text-gray-800">{guestName}</p>
                                        <p className="text-gray-600 text-sm">{contactNumber}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary mb-1">Hotel Details</h3>
                                        <p className="font-bold text-xl text-gray-800">{hotel.name}</p>
                                        <p className="text-gray-600 text-sm">{hotel.address}</p>
                                    </div>
                                </section>

                                {agentDetails && (
                                    <section className="py-8 border-b">
                                        <div>
                                            <h3 className="text-lg font-semibold text-primary mb-1">Booked By</h3>
                                            <p className="font-bold text-xl text-gray-800">{agentDetails.agencyName}</p>
                                            <p className="text-gray-600 text-sm">Contact: {agentDetails.contactEmail}</p>
                                        </div>
                                    </section>
                                )}

                                <section className="bg-primary-50 rounded-lg p-6 my-8">
                                    <div className="grid grid-cols-3 gap-6 text-center">
                                        <div>
                                            <p className="text-sm text-primary-700 font-semibold">Check-in Date</p>
                                            <p className="text-lg font-bold text-primary-900">{formatDate(checkInDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-primary-700 font-semibold">Check-out Date</p>
                                            <p className="text-lg font-bold text-primary-900">{formatDate(checkOutDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-primary-700 font-semibold">Room Type</p>
                                            <p className="text-lg font-bold text-primary-900">{room.type}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="flex justify-between items-end pt-6">
                                     <div>
                                        <p className={`mt-1 font-bold ${status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            Status: {status}
                                        </p>
                                    </div>
                                    {shouldShowPrice && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Total Amount Paid</p>
                                            <p className="text-4xl font-bold text-primary">{convertPrice(totalPrice)}</p>
                                        </div>
                                    )}
                                </section>

                                <footer className="mt-12 pt-8 border-t text-sm text-gray-500">
                                    <h4 className="font-bold mb-2 text-gray-700">Important Notes:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>This voucher is for administrative purposes only.</li>
                                        <li>For any assistance, please contact us at support@umrahhotels.com.</li>
                                    </ul>
                                </footer>
                            </div>
                        </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminVoucherPage;