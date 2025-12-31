

import React from 'react';
import ReactDOM from 'react-dom/client';
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <InfoProvider>
        <SettingsProvider>
          <CurrencyProvider>
            {/* FIX: Moved InvoiceProvider higher in the tree.
                The errors on all providers suggest a circular dependency issue during module resolution.
                The explicit dependency is that `AgencyProvider` uses the `useInvoice` hook, requiring
                `InvoiceProvider` to be an ancestor. By moving `InvoiceProvider` higher, we resolve
                potential indirect dependencies that may exist through other contexts or components,
                ensuring the `InvoiceContext` is available before any part of the tree that might
                transitively depend on it is initialized. */}
            <InvoiceProvider>
              <HotelProvider>
                <BookingProvider>
                  <AgencyProvider>
                    <AgentProvider>
                      <BulkOrderProvider>
                        <App />
                      </BulkOrderProvider>
                    </AgentProvider>
                  </AgencyProvider>
                </BookingProvider>
              </HotelProvider>
            </InvoiceProvider>
          </CurrencyProvider>
        </SettingsProvider>
      </InfoProvider>
    </ToastProvider>
  </React.StrictMode>
);