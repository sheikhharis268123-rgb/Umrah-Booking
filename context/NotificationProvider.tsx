
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { EmailNotification } from '../types';

interface NotificationContextType {
    notifications: EmailNotification[];
    sendNotification: (notification: Omit<EmailNotification, 'id' | 'sentAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
        try {
            const saved = localStorage.getItem('notifications');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const sendNotification = (data: Omit<EmailNotification, 'id' | 'sentAt'>) => {
        const newNotification: EmailNotification = {
            ...data,
            id: `EMAIL-${Date.now()}`,
            sentAt: new Date().toISOString(),
        };
        console.log("Simulating email send on frontend:", newNotification);
        setNotifications(prev => [newNotification, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, sendNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
