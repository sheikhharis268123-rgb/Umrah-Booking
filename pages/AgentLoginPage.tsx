

import React, { useState } from 'react';
// Fix: Use useHistory instead of useNavigate for react-router-dom v5 compatibility.
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const AgentLoginPage: React.FC = () => {
    const [agencyId, setAgencyId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    // Fix: Use useHistory instead of useNavigate.
    const history = useHistory();
    const location = useLocation();
    const { websiteName } = useSettings();

    const from = (location.state as any)?.from?.pathname || '/agent';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (await login(agencyId, password, 'agent')) {
            // Fix: Use history.replace instead of navigate.
            history.replace(from);
        } else {
            setError('Invalid Agency ID or Password. Please try again.');
        }
    };

    const inputStyle = "w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">{websiteName}</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-2">Agent Portal Login</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="agencyId" className="text-sm font-bold text-gray-600 block mb-2">Agency ID</label>
                            <input
                                type="text"
                                id="agencyId"
                                value={agencyId}
                                onChange={(e) => setAgencyId(e.target.value)}
                                className={inputStyle}
                                placeholder="e.g., AHT-001"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password"  className="text-sm font-bold text-gray-600 block mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyle}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

                        <div>
                            <button type="submit" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-md">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgentLoginPage;