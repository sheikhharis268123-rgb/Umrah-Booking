
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
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
    <HashRouter>
      <ToastProvider>
        <InfoProvider>
          <SettingsProvider>
            <CurrencyProvider>
              <NotificationProvider>
                <CustomerProvider>
                  <InvoiceProvider>
                    <HotelProvider>
                      <AgencyProvider>
                        <AuthProvider>
                          <BookingProvider>
                            <AgentProvider>
                              <BulkOrderProvider>
                                <App />
                              </BulkOrderProvider>
                            </AgentProvider>
                          </BookingProvider>
                        </AuthProvider>
                      </AgencyProvider>
                    </HotelProvider>
                  </InvoiceProvider>
                </CustomerProvider>
              </NotificationProvider>
            </CurrencyProvider>
          </SettingsProvider>
        </InfoProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
);