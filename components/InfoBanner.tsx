import React, { useState, useEffect } from 'react';
import { useInfo } from '../context/InfoContext';

const InfoBanner: React.FC = () => {
    const { announcement } = useInfo();
    const [isVisible, setIsVisible] = useState(true);

    const announcements = announcement.split('|').map(s => s.trim()).filter(Boolean);

    useEffect(() => {
        const isDismissed = sessionStorage.getItem('announcementDismissed');
        if (isDismissed) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('announcementDismissed', 'true');
    };

    if (!isVisible || announcements.length === 0) {
        return null;
    }

    if (announcements.length === 1) {
        return (
            <div className="bg-accent text-primary-800 p-3 text-center relative">
                <p className="font-semibold">{announcements[0]}</p>
                <button onClick={handleDismiss} className="absolute top-1/2 right-4 -translate-y-1/2 text-primary-800 hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        );
    }

    const fullText = announcements.join('  •  ');

    return (
         <div className="bg-accent text-primary-800 p-3 text-center relative overflow-hidden group">
            <div className="whitespace-nowrap" style={{ animation: `ticker-scroll ${announcements.length * 10}s linear infinite`, animationPlayState: 'running' }}>
                <span className="font-semibold px-4 inline-block">{fullText}</span>
                <span className="font-semibold px-4 inline-block">{fullText}</span> {/* Duplicate for seamless loop */}
            </div>
             <button onClick={handleDismiss} className="absolute top-1/2 right-4 -translate-y-1/2 text-primary-800 hover:text-primary z-10 bg-accent/70 rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default InfoBanner;