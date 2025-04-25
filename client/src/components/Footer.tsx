import React from "react";
import { Link } from "@heroui/react";

const Footer: React.FC = () => {
    return (
        <footer className="py-4 px-6 border-t border-divider">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-default-500">
                        © 2023 AJNX Banking. All rights reserved.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="#" size="sm" color="foreground">
                        Privacy Policy
                    </Link>
                    <Link href="#" size="sm" color="foreground">
                        Terms of Service
                    </Link>
                    <Link href="#" size="sm" color="foreground">
                        Contact Us
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
