import React from 'react';
import { Link } from '@heroui/react';
import { Icon } from '@iconify/react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-5 px-6 bg-content1 border-t border-content2/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Icon icon="lucide:shield-check" className="text-primary text-xl mr-2" />
          <span className="font-semibold text-foreground">AJNXBanking</span>
          <span className="text-xs text-default-500 ml-2">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex gap-6 text-default-500">
          <Link href="#" className="text-sm hover:text-primary">Terms</Link>
          <Link href="#" className="text-sm hover:text-primary">Privacy</Link>
          <Link href="#" className="text-sm hover:text-primary">Security</Link>
          <Link href="#" className="text-sm hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;