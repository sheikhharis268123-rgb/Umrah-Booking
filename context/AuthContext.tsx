import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Fix: Use useNavigate instead of useHistory for react-router-dom v6 compatibility.
import { useNavigate } from 'react-router-dom';
import { Agent, Customer } from '../types';
import { getApiUrl } from '../apiConfig';

type UserRole = 'admin' | 'agent' | 'customer';

interface User {
  id: string; // This will be customer ID, agent ID, or admin ID
  role: UserRole;
  data?: Agent | Customer;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (idOrEmail: string, pass: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Fix: Use useNavigate instead of useHistory.
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (idOrEmail: string, pass: string, role: UserRole): Promise<boolean> => {
    // Admin login is local for security reasons in this demo
    if (role === 'admin') {
      if (idOrEmail === '990990' && pass === 'Haris@1122@11') {
        const adminUser = { id: idOrEmail, role };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    try {
        const response = await fetch(getApiUrl('login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: idOrEmail, password: pass, role })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        const authenticatedUser: User = {
            id: role === 'customer' ? data.user.id.toString() : data.user.agency_id,
            role: data.role,
            data: data.user
        };
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
        const response = await fetch(getApiUrl('signup'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass, role: 'customer' })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }
        return true;
    } catch (error) {
        console.error('Signup error:', error);
        throw error; // Re-throw to be handled by the form
    }
  };

  const logout = () => {
    const role = user?.role;
    setUser(null);
    localStorage.removeItem('user');
    
    // Fix: Use navigate instead of history.push.
    if (role === 'admin') {
        navigate('/admin/login');
    } else if (role === 'agent') {
        navigate('/agent/login');
    } else {
        navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};