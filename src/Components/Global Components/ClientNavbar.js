'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamically import Navbar with no SSR to prevent hydration issues
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

// Simple wrapper component that conditionally renders the Navbar
const ClientNavbar = () => {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    
    // Only render on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Don't render on login or signup pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    
    if (!isMounted) {
        return null; // Return null on server-side
    }
    
    // Skip rendering on auth pages
    if (isAuthPage) {
        return null;
    }
    
    return (
        <Navbar />
    );
};

export default ClientNavbar;
