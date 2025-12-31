
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAgent } from '../context/AgentContext';
import { useToast } from '../context/ToastContext';

const AgentSettingsPage: React.FC = () => {
    // FIX: Destructure 'agent' instead of 'agentProfile'. 'agentProfile' does not exist on the context.
    const { agent, setAgentProfile } = useAgent();
    const { addToast } = useToast();
    // FIX: Initialize state from 'agent.profile'. The non-null assertion is safe because a logged-in agent is assumed for this page.
    const [formData, setFormData] = useState(agent!.profile);

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAgentProfile(formData);
        addToast('Agent profile updated successfully!', 'success');
    };

    return (
        <DashboardLayout portal="agent">
            <h1 className="text-3xl font-bold text-primary mb-8">Agency Settings</h1>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <h2 className="text-xl font-semibold text-primary border-b pb-4">My Agency Profile</h2>
                    <p className="text-sm text-gray-500">This information will be displayed on vouchers for bookings made by your agency.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">Agency Name</label>
                            <input type="text" name="agencyName" id="agencyName" value={formData.agencyName} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700">Agency ID</label>
                            <input type="text" name="agencyId" id="agencyId" value={formData.agencyId} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="iataCode" className="block text-sm font-medium text-gray-700">IATA Code</label>
                        <input type="text" name="iataCode" id="iataCode" value={formData.iataCode} onChange={handleChange} className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                            <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input type="tel" name="contactNumber" id="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputStyle} required />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 shadow">
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
};

export default AgentSettingsPage;
