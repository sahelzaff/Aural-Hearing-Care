'use client';
import React from 'react';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Footer from '@/Components/Global Components/Footer';
import ProductsHero from '@/Components/Products/ProductsHero';
import ProductsGrid from '@/Components/Products/ProductsGrid';
import BrandLogoSlider from '@/Components/Homepage/Brand_logo_slider';

const ProductsPage = () => {
  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      <ProductsHero />
      <ProductsGrid />
      <BrandLogoSlider />
      <Footer />
    </>
  );
};

export default ProductsPage; 