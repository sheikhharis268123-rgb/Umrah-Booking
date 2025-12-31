
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { PromoCode } from '../types';

interface SettingsContextType {
    logoUrl: string | null;
    promoCodes: PromoCode[];
    cancellationFeePercentage: number;
    dateChangeFeePercentage: number;
    updateLogo: (url: string) => void;
    addPromoCode: (promoCode: PromoCode) => void;
    deletePromoCode: (code: string) => void;
    updateCancellationFee: (fee: number) => void;
    updateDateChangeFee: (fee: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('logoUrl'));
    
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
        const savedCodes = localStorage.getItem('promoCodes');
        return savedCodes ? JSON.parse(savedCodes) : [
            { code: 'UMRAH2024', discount: 10, type: 'percentage' },
            { code: 'SAVE100', discount: 100, type: 'fixed' },
        ];
    });

    const [cancellationFeePercentage, setCancellationFeePercentage] = useState<number>(() => {
        const savedFee = localStorage.getItem('cancellationFee');
        return savedFee ? parseFloat(savedFee) : 10; // Default 10%
    });

    const [dateChangeFeePercentage, setDateChangeFeePercentage] = useState<number>(() => {
        const savedFee = localStorage.getItem('dateChangeFee');
        return savedFee ? parseFloat(savedFee) : 5; // Default 5%
    });


    useEffect(() => {
        if (logoUrl) localStorage.setItem('logoUrl', logoUrl);
        else localStorage.removeItem('logoUrl');
    }, [logoUrl]);

    useEffect(() => {
        localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
    }, [promoCodes]);

    useEffect(() => {
        localStorage.setItem('cancellationFee', cancellationFeePercentage.toString());
    }, [cancellationFeePercentage]);
    
    useEffect(() => {
        localStorage.setItem('dateChangeFee', dateChangeFeePercentage.toString());
    }, [dateChangeFeePercentage]);

    const updateLogo = (url: string) => setLogoUrl(url);
    const addPromoCode = (promoCode: PromoCode) => setPromoCodes(prev => [...prev, promoCode]);
    const deletePromoCode = (code: string) => setPromoCodes(prev => prev.filter(p => p.code !== code));
    const updateCancellationFee = (fee: number) => setCancellationFeePercentage(fee);
    const updateDateChangeFee = (fee: number) => setDateChangeFeePercentage(fee);


    return (
        <SettingsContext.Provider value={{ 
            logoUrl, promoCodes, cancellationFeePercentage, dateChangeFeePercentage,
            updateLogo, addPromoCode, deletePromoCode, updateCancellationFee, updateDateChangeFee 
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
