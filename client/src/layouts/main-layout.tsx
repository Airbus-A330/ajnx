import React from 'react';
import AppNavbar from '../components/navbar';
import Footer from '../components/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      
      <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;