import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Fix: Use useHistory instead of useNavigate for react-router-dom v5 compatibility.
import { useHistory } from 'react-router-dom';
import { Agent, Customer } from '../types';
import { API_BASE_URL } from '../apiConfig';

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
  // Fix: Use useHistory instead of useNavigate.
  const history = useHistory();

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
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: idOrEmail, password: pass, role, endpoint: 'login' })
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
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass, role: 'customer', endpoint: 'signup' })
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
    
    // Fix: Use history.push instead of navigate.
    if (role === 'admin') {
        history.push('/admin/login');
    } else if (role === 'agent') {
        history.push('/agent/login');
    } else {
        history.push('/login');
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