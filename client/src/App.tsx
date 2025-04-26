import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import CardsPage from "./pages/CardsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminExportPage from "./pages/AdminExportPage";

const App: React.FC = () => {
    const isAuthenticated = () => {
        return localStorage.getItem("token") !== null;
    };

    const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow page-container">
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute
                            path="/dashboard"
                            component={DashboardPage}
                        />
                        <PrivateRoute
                            path="/accounts"
                            component={AccountsPage}
                        />
                        <PrivateRoute
                            path="/transactions"
                            component={TransactionsPage}
                        />
                        <PrivateRoute path="/card" component={CardsPage} />
                        <PrivateRoute
                            path="/admin/users"
                            component={AdminUsersPage}
                        />
                        <PrivateRoute
                            path="/admin/export"
                            component={AdminExportPage}
                        />
                    </Switch>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
