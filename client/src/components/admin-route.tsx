import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Spinner } from '@heroui/react';

interface AdminRouteProps extends RouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) {
          return (
            <div className="flex items-center justify-center h-screen">
              <Spinner size="lg" color="primary" />
            </div>
          );
        }

        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          );
        }

        return isAdmin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/dashboard',
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};

export default AdminRoute;