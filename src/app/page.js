import Footer from '@/Components/Global Components/Footer'
import Navbar from '@/Components/Global Components/Navbar'
import TopbarBelow from '@/Components/Global Components/TopbarBelow'
import Appointment_booking from '@/Components/Homepage/Appointment_booking'
import BrandLogoSlider from '@/Components/Homepage/Brand_logo_slider'
import Contact from '@/Components/Homepage/Contact'
import First_visit from '@/Components/Homepage/First_visit'
import ProductSlider from '@/Components/Homepage/Product_Slider'
import Products from '@/Components/Homepage/Products'
import Slider from '@/Components/Homepage/Slider'
import Specialized from '@/Components/Homepage/Speacialized'
import Testimonial from '@/Components/Homepage/Testimonial'
import Welcome from '@/Components/Homepage/Welcome'
import React from 'react'

const page = () => {
  return (
    <>
    <TopbarBelow/>
    <Navbar/>
    <Slider/>
    <Welcome/>
    <BrandLogoSlider/>
    <First_visit/>
    <Specialized/>
    <Appointment_booking/>
    <Testimonial/>
    <Products/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default page