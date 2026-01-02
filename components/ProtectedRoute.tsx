import React, { ReactElement } from 'react';
// Fix: Use Redirect instead of Navigate for react-router-dom v5 compatibility.
import { Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactElement;
  // FIX: Allow 'customer' role
  role: 'admin' | 'agent' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a proper loading spinner component
    return <div className="flex h-screen items-center justify-center"><div>Loading...</div></div>;
  }

  if (!user || user.role !== role) {
    // FIX: Update login path logic to handle all roles correctly
    let loginPath = '/login';
    if (role === 'admin') {
      loginPath = '/admin/login';
    } else if (role === 'agent') {
      loginPath = '/agent/login';
    }
    // Redirect them to the login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    // Fix: Use Redirect component with object syntax for 'to' prop for v5.
    return <Redirect to={{ pathname: loginPath, state: { from: location } }} />;
  }

  return children;
};

export default ProtectedRoute;