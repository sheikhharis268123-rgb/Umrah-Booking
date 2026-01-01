
import React, { createContext, useContext, ReactNode } from 'react';

// This context is now a placeholder. The actual customer data is managed
// within the AuthContext upon login. This can be expanded later to hold
// a list of all customers for an admin panel, for example.

interface CustomerContextType {
    // In the future, this could hold functions like fetchAllCustomers, etc.
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    const value = {};

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = (): CustomerContextType => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
};
