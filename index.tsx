

import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Use namespace import for react-router-dom
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BookingProvider } from './context/BookingContext';
import { HotelProvider } from './context/HotelContext';
import { SettingsProvider } from './context/SettingsContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { InfoProvider } from './context/InfoContext';
import { AgentProvider } from './context/AgentContext';
import { AgencyProvider } from './context/AgencyContext';
import { BulkOrderProvider } from './context/BulkOrderContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from './context/CustomerContext';
import { NotificationProvider } from './context/NotificationProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Fix: Changed HashRouter to BrowserRouter which is more common and might resolve specific export issues. */}
    <BrowserRouter>
      <ToastProvider>
        <NotificationProvider>
          <InfoProvider>
            <SettingsProvider>
              <CurrencyProvider>
                <AuthProvider>
                  <HotelProvider>
                    <InvoiceProvider>
                      <AgencyProvider>
                        <CustomerProvider>
                          <BookingProvider>
                            <AgentProvider>
                              <BulkOrderProvider>
                                <App />
                              </BulkOrderProvider>
                            </AgentProvider>
                          </BookingProvider>
                        </CustomerProvider>
                      </AgencyProvider>
                    </InvoiceProvider>
                  </HotelProvider>
                </AuthProvider>
              </CurrencyProvider>
            </SettingsProvider>
          </InfoProvider>
        </NotificationProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);