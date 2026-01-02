import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { PromoCode } from '../types';

interface SettingsContextType {
    logoUrl: string | null;
    websiteName: string;
    bannerImageUrl: string;
    promoCodes: PromoCode[];
    cancellationFeePercentage: number;
    dateChangeFeePercentage: number;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    updateLogo: (url: string) => void;
    updateWebsiteName: (name: string) => void;
    updateBannerImageUrl: (url: string) => void;
    addPromoCode: (promoCode: PromoCode) => void;
    deletePromoCode: (code: string) => void;
    updateCancellationFee: (fee: number) => void;
    updateDateChangeFee: (fee: number) => void;
    updateContactEmail: (email: string) => void;
    updateContactPhone: (phone: string) => void;
    updateContactAddress: (address: string) => void;
    updateFacebookUrl: (url: string) => void;
    updateTwitterUrl: (url: string) => void;
    updateInstagramUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('logoUrl'));
    const [websiteName, setWebsiteName] = useState<string>(() => localStorage.getItem('websiteName') || 'Umrah Hotels');
    const [bannerImageUrl, setBannerImageUrl] = useState<string>(() => localStorage.getItem('bannerImageUrl') || 'https://picsum.photos/seed/kaaba/1920/1080');

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

    // New state for contact and social info
    const [contactEmail, setContactEmail] = useState<string>(() => localStorage.getItem('contactEmail') || 'support@umrahhotels.com');
    const [contactPhone, setContactPhone] = useState<string>(() => localStorage.getItem('contactPhone') || '+966 12 345 6789');
    const [contactAddress, setContactAddress] = useState<string>(() => localStorage.getItem('contactAddress') || 'Makkah, Saudi Arabia');
    const [facebookUrl, setFacebookUrl] = useState<string>(() => localStorage.getItem('facebookUrl') || '#');
    const [twitterUrl, setTwitterUrl] = useState<string>(() => localStorage.getItem('twitterUrl') || '#');
    const [instagramUrl, setInstagramUrl] = useState<string>(() => localStorage.getItem('instagramUrl') || '#');

    useEffect(() => { if (logoUrl) localStorage.setItem('logoUrl', logoUrl); else localStorage.removeItem('logoUrl'); }, [logoUrl]);
    useEffect(() => { localStorage.setItem('websiteName', websiteName); }, [websiteName]);
    useEffect(() => { localStorage.setItem('bannerImageUrl', bannerImageUrl); }, [bannerImageUrl]);
    useEffect(() => { localStorage.setItem('promoCodes', JSON.stringify(promoCodes)); }, [promoCodes]);
    useEffect(() => { localStorage.setItem('cancellationFee', cancellationFeePercentage.toString()); }, [cancellationFeePercentage]);
    useEffect(() => { localStorage.setItem('dateChangeFee', dateChangeFeePercentage.toString()); }, [dateChangeFeePercentage]);
    
    // New effects for contact and social info
    useEffect(() => { localStorage.setItem('contactEmail', contactEmail); }, [contactEmail]);
    useEffect(() => { localStorage.setItem('contactPhone', contactPhone); }, [contactPhone]);
    useEffect(() => { localStorage.setItem('contactAddress', contactAddress); }, [contactAddress]);
    useEffect(() => { localStorage.setItem('facebookUrl', facebookUrl); }, [facebookUrl]);
    useEffect(() => { localStorage.setItem('twitterUrl', twitterUrl); }, [twitterUrl]);
    useEffect(() => { localStorage.setItem('instagramUrl', instagramUrl); }, [instagramUrl]);


    const updateLogo = (url: string) => setLogoUrl(url);
    const updateWebsiteName = (name: string) => setWebsiteName(name);
    const updateBannerImageUrl = (url: string) => setBannerImageUrl(url);
    const addPromoCode = (promoCode: PromoCode) => setPromoCodes(prev => [...prev, promoCode]);
    const deletePromoCode = (code: string) => setPromoCodes(prev => prev.filter(p => p.code !== code));
    const updateCancellationFee = (fee: number) => setCancellationFeePercentage(fee);
    const updateDateChangeFee = (fee: number) => setDateChangeFeePercentage(fee);
    
    // New update functions
    const updateContactEmail = (email: string) => setContactEmail(email);
    const updateContactPhone = (phone: string) => setContactPhone(phone);
    const updateContactAddress = (address: string) => setContactAddress(address);
    const updateFacebookUrl = (url: string) => setFacebookUrl(url);
    const updateTwitterUrl = (url: string) => setTwitterUrl(url);
    const updateInstagramUrl = (url: string) => setInstagramUrl(url);

    return (
        <SettingsContext.Provider value={{ 
            logoUrl, websiteName, bannerImageUrl, promoCodes, cancellationFeePercentage, dateChangeFeePercentage,
            contactEmail, contactPhone, contactAddress, facebookUrl, twitterUrl, instagramUrl,
            updateLogo, updateWebsiteName, updateBannerImageUrl, addPromoCode, deletePromoCode, updateCancellationFee, updateDateChangeFee,
            updateContactEmail, updateContactPhone, updateContactAddress, updateFacebookUrl, updateTwitterUrl, updateInstagramUrl
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