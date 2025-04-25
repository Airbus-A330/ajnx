import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Spinner } from '@heroui/react';

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

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

        return isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;