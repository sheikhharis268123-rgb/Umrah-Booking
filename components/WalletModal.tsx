
import React, { useState } from 'react';
import { Agent } from '../types';
import { useAgency } from '../context/AgencyContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: Agent;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, agent }) => {
    const { updateAgentWallet } = useAgency();
    const { convertPrice } = useCurrency();
    const { addToast } = useToast();
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<'Credit' | 'Debit'>('Credit');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0 || !description) {
            addToast('Please enter a valid amount and description.', 'error');
            return;
        }
        if (type === 'Debit' && amount > agent.walletBalance) {
            addToast('Debit amount cannot exceed current wallet balance.', 'error');
            return;
        }
        
        updateAgentWallet(agent.id, amount, type, description);
        addToast('Wallet transaction successful!', 'success');
        onClose();
    };

    const inputStyle = "mt-1 block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary transition duration-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" role="dialog">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Manage Wallet</h2>
                    <p className="text-gray-600">For: {agent.profile.agencyName}</p>
                    <p className="mt-2 font-semibold">Current Balance: {convertPrice(agent.walletBalance)}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={inputStyle} required min="0.01" step="0.01" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                                <select id="type" value={type} onChange={(e) => setType(e.target.value as 'Credit' | 'Debit')} className={inputStyle}>
                                    <option value="Credit">Credit (Add Funds)</option>
                                    <option value="Debit">Debit (Remove Funds)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Reference</label>
                            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputStyle} required placeholder="e.g., Monthly top-up" />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-opacity-90">
                            Confirm Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WalletModal;
