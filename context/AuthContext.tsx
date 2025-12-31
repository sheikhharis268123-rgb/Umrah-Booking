import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgency } from './AgencyContext';
// FIX: Import Customer type
import { Agent, Customer } from '../types';

// FIX: Add 'customer' to UserRole
type UserRole = 'admin' | 'agent' | 'customer';

interface User {
  id: string;
  role: UserRole;
  // FIX: Allow data to be Agent or Customer
  data?: Agent | Customer; // Store agent data on login
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (id: string, pass: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { agencies } = useAgency();
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

  const login = (id: string, pass: string, role: UserRole): boolean => {
    let authenticatedUser: User | null = null;
    
    if (role === 'admin') {
      if (id === '990990' && pass === 'Haris@1122@11') {
        authenticatedUser = { id, role };
      }
    } else if (role === 'agent') {
      const agent = agencies.find(a => a.id === id && a.profile.password === pass);
      if (agent) {
        authenticatedUser = { id: agent.id, role, data: agent };
      }
    // FIX: Add login logic for 'customer' role
    } else if (role === 'customer') {
      // This is a simplified customer login. A real app would use CustomerContext or an API.
      if (id === 'customer@example.com' && pass === 'password123') {
        const customer: Customer = { id, name: 'Test Customer', password: pass };
        authenticatedUser = { id: customer.id, role, data: customer };
      }
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    const role = user?.role;
    setUser(null);
    sessionStorage.removeItem('user');
    // FIX: Handle customer logout redirection
    if (role === 'admin') {
        navigate('/admin/login');
    } else if (role === 'agent') {
        navigate('/agent/login');
    } else {
        navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
