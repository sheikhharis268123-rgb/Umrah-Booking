
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const AdminLoginPage: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { websiteName } = useSettings();

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(userId, password, 'admin')) {
            navigate(from, { replace: true });
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const inputStyle = "w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">{websiteName}</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-2">Admin Portal Login</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userId" className="text-sm font-bold text-gray-600 block mb-2">User ID</label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className={inputStyle}
                                placeholder="Enter your User ID"
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

export default AdminLoginPage;
