
import React, { useState } from 'react';
import { useAgency } from '../context/AgencyContext';
import { Agent, AgentProfile } from '../types';
import { useToast } from '../context/ToastContext';

interface AgencyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentToEdit: Agent | null;
}

const AgencyFormModal: React.FC<AgencyFormModalProps> = ({ isOpen, onClose, agentToEdit }) => {
    const { addAgency, updateAgency } = useAgency();
    const { addToast } = useToast();
    const [formData, setFormData] = useState<AgentProfile>(
        agentToEdit?.profile || {
            agencyId: '',
            agencyName: '',
            iataCode: '',
            contactEmail: '',
            contactNumber: ''
        }
    );

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (agentToEdit) {
            updateAgency({ ...agentToEdit, profile: formData });
            addToast('Agency profile updated successfully!', 'success');
        } else {
            if(!formData.agencyId) {
                addToast('Agency ID is required.', 'error');
                return;
            }
            addAgency(formData);
            addToast('New agency added successfully!', 'success');
        }
        onClose();
    };

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" role="dialog">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">{agentToEdit ? 'Edit Agency' : 'Add New Agency'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">Agency Name</label>
                                <input type="text" name="agencyName" value={formData.agencyName} onChange={handleChange} className={inputStyle} required />
                            </div>
                             <div>
                                <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700">Agency ID</label>
                                <input type="text" name="agencyId" value={formData.agencyId} onChange={handleChange} className={inputStyle} required disabled={!!agentToEdit} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="iataCode" className="block text-sm font-medium text-gray-700">IATA Code</label>
                            <input type="text" name="iataCode" value={formData.iataCode} onChange={handleChange} className={inputStyle} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputStyle} required />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">
                            {agentToEdit ? 'Save Changes' : 'Add Agency'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgencyFormModal;
