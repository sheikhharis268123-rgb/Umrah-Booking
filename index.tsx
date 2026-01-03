import React from 'react';
import ReactDOM from 'react-dom/client';
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

// The order of Providers is important. It should be from least dependent to most dependent.
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Level 0: Providers with no internal dependencies on other contexts */}
      <ToastProvider>
        <NotificationProvider>
          <InfoProvider>
            <SettingsProvider>
              <CurrencyProvider>
                <AuthProvider>
                  <HotelProvider>
                    <InvoiceProvider>
                      <CustomerProvider>
                        <BulkOrderProvider>
                        
                          {/* Level 1: Providers that depend on the ones above */}
                          <AgencyProvider> {/* Depends on InvoiceProvider */}
                            
                            {/* Level 2: Providers that depend on Level 1 */}
                            <AgentProvider>  {/* Depends on AuthProvider, AgencyProvider */}
                              <BookingProvider> {/* Depends on NotificationProvider, HotelProvider, AgencyProvider */}
                                
                                {/* Finally, the App which uses all contexts */}
                                <App />

                              </BookingProvider>
                            </AgentProvider>
                          </AgencyProvider>

                        </BulkOrderProvider>
                      </CustomerProvider>
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