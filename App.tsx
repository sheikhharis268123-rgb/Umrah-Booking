

import React from 'react';
// Fix: Use Switch and Route from react-router-dom v5 syntax.
import { Switch, Route } from 'react-router-dom';
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
        {/* Fix: Use Switch instead of Routes and children instead of element prop for Route. */}
        <Switch>
          {/* Customer Routes */}
          <Route path="/" exact><CustomerPortal /></Route>
          <Route path="/hotel/:hotelId"><HotelDetailPage /></Route>
          <Route path="/hotels"><AllHotelsPage /></Route>
          <Route path="/confirmation/:bookingId"><BookingConfirmationPage /></Route>
          <Route path="/my-bookings"><ProtectedRoute role="customer"><MyBookingsPage /></ProtectedRoute></Route>
          <Route path="/voucher/:bookingId"><VoucherPage /></Route>
          <Route path="/track-booking"><TrackBookingPage /></Route>
          <Route path="/support"><SupportPage /></Route>
          <Route path="/login"><CustomerLoginPage /></Route>
          <Route path="/signup"><CustomerSignupPage /></Route>

          {/* Auth Routes */}
          <Route path="/admin/login"><AdminLoginPage /></Route>
          <Route path="/agent/login"><AgentLoginPage /></Route>
          
          {/* Admin Routes */}
          <Route path="/admin" exact><ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute></Route>
          <Route path="/admin/hotels"><ProtectedRoute role="admin"><AdminHotelsPage /></ProtectedRoute></Route>
          <Route path="/admin/bookings"><ProtectedRoute role="admin"><AdminBookingsPage /></ProtectedRoute></Route>
          <Route path="/admin/requests"><ProtectedRoute role="admin"><AdminRequestsPage /></ProtectedRoute></Route>
          <Route path="/admin/bulk-orders"><ProtectedRoute role="admin"><AdminBulkOrdersPage /></ProtectedRoute></Route>
          <Route path="/admin/agencies"><ProtectedRoute role="admin"><AdminAgenciesPage /></ProtectedRoute></Route>
          <Route path="/admin/invoices"><ProtectedRoute role="admin"><AdminInvoicesPage /></ProtectedRoute></Route>
          <Route path="/admin/financials"><ProtectedRoute role="admin"><AdminFinancialsPage /></ProtectedRoute></Route>
          <Route path="/admin/notifications"><ProtectedRoute role="admin"><AdminNotificationsPage /></ProtectedRoute></Route>
          <Route path="/admin/settings"><ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute></Route>
          <Route path="/admin/voucher/:bookingId"><ProtectedRoute role="admin"><AdminVoucherPage /></ProtectedRoute></Route>

          {/* Agent Routes */}
          <Route path="/agent" exact><ProtectedRoute role="agent"><AgentPortal /></ProtectedRoute></Route>
          <Route path="/agent/bulk-booking"><ProtectedRoute role="agent"><AgentBulkBookingPage /></ProtectedRoute></Route>
          <Route path="/agent/my-bookings"><ProtectedRoute role="agent"><AgentMyBookingsPage /></ProtectedRoute></Route>
          <Route path="/agent/settings"><ProtectedRoute role="agent"><AgentSettingsPage /></ProtectedRoute></Route>
        </Switch>
      </div>
  );
}

export default App;