
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Invoice } from '../types';

interface InvoiceContextType {
    invoices: Invoice[];
    addInvoice: (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>(() => {
        const savedInvoices = localStorage.getItem('invoices');
        return savedInvoices ? JSON.parse(savedInvoices) : [];
    });

    useEffect(() => {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }, [invoices]);

    const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `INV-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    return (
        <InvoiceContext.Provider value={{ invoices, addInvoice }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoice = (): InvoiceContextType => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
