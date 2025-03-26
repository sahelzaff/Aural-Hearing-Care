'use client';
import React, { useState, useEffect } from 'react';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Footer from '@/Components/Global Components/Footer';
import ProductsHero from '@/Components/Products/ProductsHero';
import ProductsGrid from '@/Components/Products/ProductsGrid';
import BrandLogoSlider from '@/Components/Homepage/Brand_logo_slider';
import MaintenanceScreen from '@/Components/MaintenanceScreen';
import useProducts from '@/hooks/useProducts';

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const { fetchCategories } = useProducts();

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData || []);
    };
    
    getCategories();
  }, [fetchCategories]);

  return (
    <>
      {/* <TopbarBelow /> */}
      {/* <ClientNavbar /> */}
      <ProductsHero />
      <ProductsGrid categories={categories} />
      <BrandLogoSlider />
      {/* <Footer /> */}
      {/* <MaintenanceScreen /> */}
    </>
  );
};

export default ProductsPage; 