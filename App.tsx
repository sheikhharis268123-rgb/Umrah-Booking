
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';
import AgentPortal from './pages/AgentPortal';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminHotelsPage from './pages/AdminHotelsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import VoucherPage from './pages/VoucherPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminVoucherPage from './pages/AdminVoucherPage';
import AgentBulkBookingPage from './pages/AgentBulkBookingPage';
import AgentMyBookingsPage from './pages/AgentMyBookingsPage';
import AgentSettingsPage from './pages/AgentSettingsPage';
import AdminAgenciesPage from './pages/AdminAgenciesPage';
import AdminInvoicesPage from './pages/AdminInvoicesPage';
import AdminFinancialsPage from './pages/AdminFinancialsPage';
import SupportPage from './pages/SupportPage';
import TrackBookingPage from './pages/TrackBookingPage';
import ToastContainer from './components/ToastContainer';
import AllHotelsPage from './pages/AllHotelsPage';
import AdminBulkOrdersPage from './pages/AdminBulkOrdersPage';
import AdminRequestsPage from './pages/AdminRequestsPage';


function App() {
  return (
    <HashRouter>
      <div className="bg-neutral-light min-h-screen font-sans text-neutral-dark">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<CustomerPortal />} />
          <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
          <Route path="/hotels" element={<AllHotelsPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/voucher/:bookingId" element={<VoucherPage />} />
          <Route path="/track-booking" element={<TrackBookingPage />} />
          <Route path="/support" element={<SupportPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin/hotels" element={<AdminHotelsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/requests" element={<AdminRequestsPage />} />
          <Route path="/admin/bulk-orders" element={<AdminBulkOrdersPage />} />
          <Route path="/admin/agencies" element={<AdminAgenciesPage />} />
          <Route path="/admin/invoices" element={<AdminInvoicesPage />} />
          <Route path="/admin/financials" element={<AdminFinancialsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/voucher/:bookingId" element={<AdminVoucherPage />} />

          {/* Agent Routes */}
          <Route path="/agent" element={<AgentPortal />} />
          <Route path="/agent/bulk-booking" element={<AgentBulkBookingPage />} />
          <Route path="/agent/my-bookings" element={<AgentMyBookingsPage />} />
          <Route path="/agent/settings" element={<AgentSettingsPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;