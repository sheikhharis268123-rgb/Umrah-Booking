
import React, { useState, useEffect } from 'react';
import { useInfo } from '../context/InfoContext';

const InfoBanner: React.FC = () => {
    const { announcement } = useInfo();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner only if there's an announcement and it hasn't been dismissed in this session
        const isDismissed = sessionStorage.getItem('announcementDismissed');
        if (announcement && !isDismissed) {
            setIsVisible(true);
        }
    }, [announcement]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('announcementDismissed', 'true');
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-accent text-primary-800 p-3 text-center relative">
            <p className="font-semibold">{announcement}</p>
            <button onClick={handleDismiss} className="absolute top-1/2 right-4 -translate-y-1/2 text-primary-800 hover:text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default InfoBanner;
