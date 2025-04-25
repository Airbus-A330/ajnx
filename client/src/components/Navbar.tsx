import React from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const NavbarComponent: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("token") !== null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push("/login");
    };

    return (
        <Navbar maxWidth="xl">
            <NavbarBrand>
                <RouterLink to="/" className="flex items-center gap-2">
                    <Icon
                        icon="lucide:landmark"
                        width={24}
                        height={24}
                        className="text-primary"
                    />
                    <p className="font-bold text-inherit">AJNX Banking</p>
                </RouterLink>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {isAuthenticated && (
                    <>
                        <NavbarItem
                            isActive={location.pathname === "/dashboard"}
                        >
                            <Link
                                as={RouterLink}
                                to="/dashboard"
                                color={
                                    location.pathname === "/dashboard"
                                        ? "primary"
                                        : "foreground"
                                }
                            >
                                Dashboard
                            </Link>
                        </NavbarItem>
                        <NavbarItem
                            isActive={location.pathname === "/accounts"}
                        >
                            <Link
                                as={RouterLink}
                                to="/accounts"
                                color={
                                    location.pathname === "/accounts"
                                        ? "primary"
                                        : "foreground"
                                }
                            >
                                Accounts
                            </Link>
                        </NavbarItem>
                        <NavbarItem
                            isActive={location.pathname === "/transactions"}
                        >
                            <Link
                                as={RouterLink}
                                to="/transactions"
                                color={
                                    location.pathname === "/transactions"
                                        ? "primary"
                                        : "foreground"
                                }
                            >
                                Transactions
                            </Link>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarContent justify="end">
                {isAuthenticated ? (
                    <>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="light"
                                    startContent={<Icon icon="lucide:user" />}
                                >
                                    Account
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Account actions">
                                <DropdownItem
                                    key="admin-users"
                                    as={RouterLink}
                                    to="/admin/users"
                                >
                                    Admin: Users
                                </DropdownItem>
                                <DropdownItem
                                    key="admin-export"
                                    as={RouterLink}
                                    to="/admin/export"
                                >
                                    Admin: Export
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    onPress={handleLogout}
                                    className="text-danger"
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <NavbarItem>
                            <Link as={RouterLink} to="/login">
                                Login
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={RouterLink}
                                to="/register"
                                color="primary"
                                variant="flat"
                            >
                                Register
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
};

export default NavbarComponent;
