
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface InfoContextType {
    announcement: string;
    setAnnouncement: (message: string) => void;
}

const InfoContext = createContext<InfoContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const InfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [announcement, setAnnouncementState] = useState<string>(() => {
        return localStorage.getItem('announcement') || '';
    });

    useEffect(() => {
        localStorage.setItem('announcement', announcement);
    }, [announcement]);

    const setAnnouncement = (message: string) => {
        setAnnouncementState(message);
    };

    return (
        <InfoContext.Provider value={{ announcement, setAnnouncement }}>
            {children}
        </InfoContext.Provider>
    );
};

export const useInfo = (): InfoContextType => {
    const context = useContext(InfoContext);
    if (context === undefined) {
        throw new Error('useInfo must be used within an InfoProvider');
    }
    return context;
};
