import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useSettings } from '../context/SettingsContext';
import { PromoCode } from '../types';
import { useInfo } from '../context/InfoContext';
import { useToast } from '../context/ToastContext';

const AdminSettingsPage: React.FC = () => {
    const { 
        logoUrl, updateLogo, promoCodes, addPromoCode, deletePromoCode,
        cancellationFeePercentage, updateCancellationFee,
        dateChangeFeePercentage, updateDateChangeFee,
        websiteName, updateWebsiteName,
        bannerImageUrl, updateBannerImageUrl
    } = useSettings();
    const { announcement, setAnnouncement } = useInfo();
    const { addToast } = useToast();

    const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);
    const [currentWebsiteName, setCurrentWebsiteName] = useState(websiteName);
    const [currentBannerUrl, setCurrentBannerUrl] = useState(bannerImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newPromoCode, setNewPromoCode] = useState<Omit<PromoCode, ''>>({ code: '', discount: 0, type: 'percentage' });
    
    const [cancellationFee, setCancellationFee] = useState(cancellationFeePercentage);
    const [dateChangeFee, setDateChangeFee] = useState(dateChangeFeePercentage);

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateLogo(reader.result as string);
                addToast('Logo updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPromoCode(prev => ({...prev, [name]: name === 'discount' ? Number(value) : value}));
    };

    const handleAddPromoCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPromoCode.code && newPromoCode.discount > 0) {
            addPromoCode(newPromoCode as PromoCode);
            addToast(`Promo code "${newPromoCode.code}" added.`, 'success');
            setNewPromoCode({ code: '', discount: 0, type: 'percentage' });
        } else {
            addToast('Please enter a valid code and discount value.', 'error');
        }
    };

    const handleSaveGeneralSettings = () => {
        updateWebsiteName(currentWebsiteName);
        updateBannerImageUrl(currentBannerUrl);
        setAnnouncement(currentAnnouncement);
        addToast('General settings updated successfully!', 'success');
    };
    
    const handleSaveFinancials = () => {
        updateCancellationFee(cancellationFee);
        updateDateChangeFee(dateChangeFee);
        addToast('Financial settings have been updated.', 'success');
    };

    return (
        <DashboardLayout portal="admin">
            <h1 className="text-3xl font-bold text-primary mb-8">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-semibold text-primary mb-4">General Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="websiteName" className="block text-sm font-medium text-gray-700">Website Name</label>
                            <input type="text" id="websiteName" value={currentWebsiteName} onChange={(e) => setCurrentWebsiteName(e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-gray-700">Main Banner Image URL</label>
                            <input type="text" id="bannerImageUrl" value={currentBannerUrl} onChange={(e) => setCurrentBannerUrl(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                                {logoUrl ? <img src={logoUrl} alt="Current Logo" className="w-full h-full object-contain" /> : <span className="text-gray-500 text-xs">No Logo</span>}
                            </div>
                            <div>
                                <input type="file" accept="image/*" onChange={handleLogoUpload} ref={fileInputRef} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-800 transition">
                                    Upload Logo
                                </button>
                                <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px</p>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="announcement" className="block text-sm font-medium text-gray-700">Website Announcement (use "|" to separate multiple messages)</label>
                            <textarea 
                                id="announcement"
                                value={currentAnnouncement}
                                onChange={(e) => setCurrentAnnouncement(e.target.value)}
                                rows={2}
                                className={inputStyle}
                                placeholder="e.g., 'Booking is now open for Ramadan | Special discounts available'"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSaveGeneralSettings} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                            Save General Settings
                        </button>
                    </div>
                </div>

                {/* Financial Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-semibold text-primary mb-4">Financial Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="cancellationFee" className="block text-sm font-medium text-gray-700">Cancellation / Refund Fee (%)</label>
                            <input type="number" id="cancellationFee" value={cancellationFee} onChange={(e) => setCancellationFee(Number(e.target.value))} className={inputStyle} min="0" max="100"/>
                             <p className="text-xs text-gray-500 mt-1">Percentage of total booking price to deduct upon cancellation.</p>
                        </div>
                         <div>
                            <label htmlFor="dateChangeFee" className="block text-sm font-medium text-gray-700">Date Change Fee (%)</label>
                            <input type="number" id="dateChangeFee" value={dateChangeFee} onChange={(e) => setDateChangeFee(Number(e.target.value))} className={inputStyle} min="0" max="100"/>
                             <p className="text-xs text-gray-500 mt-1">Percentage of original booking price applied as a fee for date changes.</p>
                        </div>
                    </div>
                     <div className="flex justify-end mt-4">
                         <button onClick={handleSaveFinancials} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                            Save Financial Settings
                        </button>
                    </div>
                </div>

                {/* Promo Code Management */}
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-semibold text-primary mb-4">Manage Promo Codes</h2>
                    <form onSubmit={handleAddPromoCode} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6 pb-6 border-b">
                        <div>
                            <label htmlFor="code" className="text-sm font-semibold text-gray-600">Promo Code</label>
                            <input type="text" name="code" value={newPromoCode.code} onChange={handlePromoCodeChange} className={inputStyle} placeholder="e.g. UMRAH2025" />
                        </div>
                        <div>
                             <label htmlFor="discount" className="text-sm font-semibold text-gray-600">Discount</label>
                            <div className="flex">
                                <input type="number" name="discount" value={newPromoCode.discount} onChange={handlePromoCodeChange} className={`${inputStyle} rounded-r-none`} placeholder="e.g. 15" />
                                <select name="type" value={newPromoCode.type} onChange={handlePromoCodeChange} className={`${inputStyle} rounded-l-none -ml-px`}>
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="bg-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-opacity-90 h-[46px]">Add Code</button>
                    </form>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                       {promoCodes.length > 0 ? promoCodes.map(promo => (
                            <div key={promo.code} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                <div>
                                    <p className="font-mono font-bold text-primary">{promo.code}</p>
                                    <p className="text-sm text-gray-600">
                                        Discount: {promo.type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`}
                                    </p>
                                </div>
                                <button onClick={() => deletePromoCode(promo.code)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                       )) : <p className="text-center text-gray-500">No promo codes yet.</p>}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettingsPage;