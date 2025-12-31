
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BulkOrder } from '../types';

interface BulkOrderContextType {
    bulkOrders: BulkOrder[];
    addBulkOrder: (order: Omit<BulkOrder, 'id' | 'status' | 'createdAt'>) => void;
    updateBulkOrderStatus: (orderId: string, status: BulkOrder['status']) => void;
    deleteBulkOrder: (orderId: string) => void;
}

const BulkOrderContext = createContext<BulkOrderContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const BulkOrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>(() => {
        const savedOrders = localStorage.getItem('bulkOrders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    useEffect(() => {
        localStorage.setItem('bulkOrders', JSON.stringify(bulkOrders));
    }, [bulkOrders]);
    
    const addBulkOrder = (orderData: Omit<BulkOrder, 'id' | 'status' | 'createdAt'>) => {
        const newOrder: BulkOrder = {
            ...orderData,
            id: `BO-${Date.now()}`,
            status: 'Pending', // New orders now require admin approval
            createdAt: new Date().toISOString(),
        };
        setBulkOrders(prev => [newOrder, ...prev]);
    };

    const updateBulkOrderStatus = (orderId: string, status: BulkOrder['status']) => {
        setBulkOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        );
    };

     const deleteBulkOrder = (orderId: string) => {
        setBulkOrders(prev => prev.filter(order => order.id !== orderId));
    };

    return (
        <BulkOrderContext.Provider value={{ bulkOrders, addBulkOrder, updateBulkOrderStatus, deleteBulkOrder }}>
            {children}
        </BulkOrderContext.Provider>
    );
};

export const useBulkOrder = (): BulkOrderContextType => {
    const context = useContext(BulkOrderContext);
    if (context === undefined) {
        throw new Error('useBulkOrder must be used within a BulkOrderProvider');
    }
    return context;
};
