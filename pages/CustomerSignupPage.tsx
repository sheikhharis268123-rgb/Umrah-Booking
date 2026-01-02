

import React, { useState } from 'react';
// Fix: Use useHistory instead of useNavigate for react-router-dom v5 compatibility.
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

const CustomerSignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup, login } = useAuth();
    const { addToast } = useToast();
    // Fix: Use useHistory instead of useNavigate.
    const history = useHistory();
    const { websiteName } = useSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const signupSuccess = await signup(name, email, password);
            if (signupSuccess) {
                addToast('Signup successful! Welcome.', 'success');
                // Automatically log in the user after successful signup
                const loginSuccess = await login(email, password, 'customer');
                if (loginSuccess) {
                    // Fix: Use history.replace instead of navigate.
                    history.replace('/my-bookings');
                } else {
                     // Fix: Use history.push instead of navigate.
                     history.push('/login');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">{websiteName}</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-2">Create Customer Account</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="text-sm font-bold text-gray-600 block mb-2">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-2">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="password"  className="text-sm font-bold text-gray-600 block mb-2">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} required />
                        </div>
                        {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-md disabled:bg-opacity-50">
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                     <div className="text-center mt-4 text-sm">
                        <p>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSignupPage;