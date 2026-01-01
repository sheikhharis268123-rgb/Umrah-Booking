
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent, Customer } from '../types';

const API_URL = 'https://sandybrown-parrot-500490.hostingersite.com/api.php';

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
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('user');
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
        sessionStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    try {
        const response = await fetch(`${API_URL}?endpoint=login`, {
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
        sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}?endpoint=signup`, {
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
    sessionStorage.removeItem('user');
    
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
