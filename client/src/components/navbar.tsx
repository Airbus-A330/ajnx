import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';

const AppNavbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Navbar maxWidth="2xl" className="bg-content1 border-b border-content2/30">
      <NavbarBrand>
        <Icon icon="lucide:shield-check" className="text-primary text-2xl" />
        <p className="font-bold text-inherit ml-2">AJNXBanking</p>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={isActive('/dashboard')}>
          <Link as={RouterLink} to="/dashboard" color={isActive('/dashboard') ? 'primary' : 'foreground'}>
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive('/accounts')}>
          <Link as={RouterLink} to="/accounts" color={isActive('/accounts') ? 'primary' : 'foreground'}>
            Accounts
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActive('/transactions')}>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                className={isActive('/transactions') ? 'text-primary' : 'text-foreground'}
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              >
                Transactions
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Transaction options">
              <DropdownItem as={RouterLink} to="/transactions/deposit">Deposit</DropdownItem>
              <DropdownItem as={RouterLink} to="/transactions/withdraw">Withdraw</DropdownItem>
              <DropdownItem as={RouterLink} to="/transactions/transfer">Transfer</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        
        {isAdmin && (
          <NavbarItem isActive={isActive('/admin')}>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className={isActive('/admin') ? 'text-primary' : 'text-foreground'}
                  endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                >
                  Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Admin options">
                <DropdownItem as={RouterLink} to="/admin/users">Users</DropdownItem>
                <DropdownItem as={RouterLink} to="/admin/export">Export Data</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>
      
      <NavbarContent justify="end">
        {user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                color="primary"
                name={user.name}
                className="cursor-pointer"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default AppNavbar;