
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AgentLoginPage from './pages/AgentLoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';


function App() {
  return (
      <div className="bg-neutral-light min-h-screen font-sans text-neutral-dark">
        <ToastContainer />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerPortal />} />
          <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
          <Route path="/hotels" element={<AllHotelsPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/voucher/:bookingId" element={<VoucherPage />} />
          <Route path="/track-booking" element={<TrackBookingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/signup" element={<CustomerSignupPage />} />

          {/* Auth Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/agent/login" element={<AgentLoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>} />
          <Route path="/admin/hotels" element={<ProtectedRoute role="admin"><AdminHotelsPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute role="admin"><AdminRequestsPage /></ProtectedRoute>} />
          <Route path="/admin/bulk-orders" element={<ProtectedRoute role="admin"><AdminBulkOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/agencies" element={<ProtectedRoute role="admin"><AdminAgenciesPage /></ProtectedRoute>} />
          <Route path="/admin/invoices" element={<ProtectedRoute role="admin"><AdminInvoicesPage /></ProtectedRoute>} />
          <Route path="/admin/financials" element={<ProtectedRoute role="admin"><AdminFinancialsPage /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AdminNotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute>} />
          <Route path="/admin/voucher/:bookingId" element={<ProtectedRoute role="admin"><AdminVoucherPage /></ProtectedRoute>} />

          {/* Agent Routes */}
          <Route path="/agent" element={<ProtectedRoute role="agent"><AgentPortal /></ProtectedRoute>} />
          <Route path="/agent/bulk-booking" element={<ProtectedRoute role="agent"><AgentBulkBookingPage /></ProtectedRoute>} />
          <Route path="/agent/my-bookings" element={<ProtectedRoute role="agent"><AgentMyBookingsPage /></ProtectedRoute>} />
          <Route path="/agent/settings" element={<ProtectedRoute role="agent"><AgentSettingsPage /></ProtectedRoute>} />
        </Routes>
      </div>
  );
}

export default App;