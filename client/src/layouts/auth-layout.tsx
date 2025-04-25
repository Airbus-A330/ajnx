import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@heroui/react';
import { Icon } from '@iconify/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Icon icon="lucide:shield-check" className="text-primary text-2xl" />
            <span className="font-bold text-foreground ml-2">AJNXBanking</span>
          </div>
          <div>
            <Link as={RouterLink} to="/" color="primary" className="text-sm">
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-gradient">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className="w-full py-4 px-6 bg-content1">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-default-500">
          <div>© {new Date().getFullYear()} AJNXBanking. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="#" size="sm">Terms</Link>
            <Link href="#" size="sm">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;