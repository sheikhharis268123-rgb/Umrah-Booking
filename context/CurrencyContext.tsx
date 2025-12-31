
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Currency } from '../types';

// Conversion rates relative to PKR (base currency)
const CONVERSION_RATES_FROM_PKR = {
    PKR: 1,
    SAR: 1 / 74.1,  // ~74.1 PKR to 1 SAR
    USD: 1 / 278.4, // ~278.4 PKR to 1 USD
};

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (priceInPkr: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('PKR');

    const convertPrice = useMemo(() => {
        return (priceInPkr: number): string => {
            const rate = CONVERSION_RATES_FROM_PKR[currency];
            const convertedPrice = priceInPkr * rate;
            
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(convertedPrice);
        };
    }, [currency]);
    
    const value = { currency, setCurrency, convertPrice };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
