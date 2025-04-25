import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import PrivateRoute from './components/private-route';
import AdminRoute from './components/admin-route';
import MainLayout from './layouts/main-layout';
import AuthLayout from './layouts/auth-layout';

// Auth Pages
import Login from './pages/login';
import Register from './pages/register';

// Main Pages
import Dashboard from './pages/dashboard';
import Accounts from './pages/accounts';
import AccountDetails from './pages/account-details';
import Deposit from './pages/transactions/deposit';
import Withdraw from './pages/transactions/withdraw';
import Transfer from './pages/transactions/transfer';

// Admin Pages
import AdminUsers from './pages/admin/users';
import AdminExport from './pages/admin/export';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Auth Routes */}
          <Route path="/login">
            <AuthLayout>
              <Login />
            </AuthLayout>
          </Route>
          <Route path="/register">
            <AuthLayout>
              <Register />
            </AuthLayout>
          </Route>

          {/* Main Routes - Protected */}
          <PrivateRoute path="/dashboard">
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
          <PrivateRoute exact path="/accounts">
            <MainLayout>
              <Accounts />
            </MainLayout>
          </PrivateRoute>
          <PrivateRoute path="/accounts/:id">
            <MainLayout>
              <AccountDetails />
            </MainLayout>
          </PrivateRoute>
          <PrivateRoute path="/transactions/deposit">
            <MainLayout>
              <Deposit />
            </MainLayout>
          </PrivateRoute>
          <PrivateRoute path="/transactions/withdraw">
            <MainLayout>
              <Withdraw />
            </MainLayout>
          </PrivateRoute>
          <PrivateRoute path="/transactions/transfer">
            <MainLayout>
              <Transfer />
            </MainLayout>
          </PrivateRoute>

          {/* Admin Routes */}
          <AdminRoute path="/admin/users">
            <MainLayout>
              <AdminUsers />
            </MainLayout>
          </AdminRoute>
          <AdminRoute path="/admin/export">
            <MainLayout>
              <AdminExport />
            </MainLayout>
          </AdminRoute>

          {/* Default Route */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;