import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import assets from '../../../public/assets/assets'
import '../Components.css'


const Navbar = () => {
    return (
        <div className='w-full max-w-screen-2xl h-full'>
            <div className='p-6 flex items-center justify-between'>
                <div>
                    <img src={assets.logo} className='w-56' alt="" srcset="" />
                </div>

                <ul className='flex flex-row space-x-8'>
                    <li className='font-montserrat text-lg font-medium cursor-pointer' id='underline2'>Home</li>
                    <li className='font-montserrat text-lg font-medium cursor-pointer' id='underline2'>Products</li>
                    <li className='font-montserrat text-lg font-medium cursor-pointer' id='underline2'>Services</li>
                    <li className='font-montserrat text-lg font-medium cursor-pointer' id='underline2'>About Us</li>
                    <li className='font-montserrat text-lg font-medium cursor-pointer' id='underline2'>Contact</li>
                </ul>

                <div className='flex flex-row space-x-5 pr-5'>
                    <CiHeart className='text-3xl text-gray-600 cursor-pointer '/>
                    <HiOutlineShoppingCart className='text-3xl text-gray-600 cursor-pointer'/>
                    <CgProfile className='text-3xl text-gray-600 cursor-pointer'/>
                </div>
                    {/* <button type="button" className=' font-medium flex flex-row gap-2 items-center text-white py-3 px-3 rounded-lg bg-auralyellow hover:scale-105 transition-all duration-300 ease-in-out '><FaPhoneAlt /> <span>+91 98234 49422</span></button> */}
            </div>
        </div>
    )
}

export default Navbar