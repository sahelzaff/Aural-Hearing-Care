'use client';

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false })

const ClientNavbar = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Navbar />;
}

export default ClientNavbar;
