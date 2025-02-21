'use client';

import React, { useEffect, useState } from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import assets from '../../../public/assets/assets'
import Image from 'next/image';
import '../Components.css'
import { useSelector, useDispatch } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';
import { login, logout } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../LoadingScreen';
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const Navbar = () => {
    const { data: session, status } = useSession();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const wishlistCount = useSelector((state) => state.wishlist.items.length);
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        
        // Set isScrolled based on whether we've scrolled at all
        setIsScrolled(latest > 0);
        
        // Only hide/show navbar after we've scrolled a bit
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else {
            if (status === 'authenticated' && session) {
                dispatch(login({ email: session.user.email }));
            } else if (status === 'unauthenticated') {
                dispatch(logout());
            }
            setIsLoading(false);
        }
    }, [status, session, dispatch]);

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut({ 
            redirect: false,
            callbackUrl: '/'
        });
        dispatch(logout());
        router.push('/');
        setIsLoading(false);
    };

    // Get user's name from session
    const userName = session?.user?.name || '';
    const firstName = userName.split(' ')[0];

    // Function to check if a path matches current pathname
    const isActivePath = (path) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`w-full bg-white z-50 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-sm' : ''}`}
        >
            <div className='w-full h-full Homepage'>
                <div className='py-6 flex items-center justify-between'>
                    <Link href='/#'>
                        <Image
                            src={assets.logo}
                            alt="Aural Hearing Care Logo"
                            width={250}
                            height={80}
                            priority
                            className="object-contain"
                        />
                    </Link>
                    <div className='flex flex-row space-x-4 items-center'>
                        <ul className='flex flex-row space-x-8'>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/">
                                    <span className={`hover-underline-animation ${isActivePath('/') ? 'active-link' : ''}`}>
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/products" className={`${isActivePath('/products') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Products
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/services">
                                    <span className={`hover-underline-animation ${isActivePath('/services') ? 'active-link' : ''}`}>
                                        Services
                                    </span>
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/About-us">
                                    <span className={`hover-underline-animation ${isActivePath('/About-us') ? 'active-link' : ''}`}>
                                        About Me
                                    </span>
                                </Link>
                            </li>
                            {/* <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/online-hearing-test" className={`${isActivePath('/online-hearing-test') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Online Hearing Test
                                </Link>
                            </li> */}
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/blog" className={`${isActivePath('/blog') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Blog
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/contact" className={`${isActivePath('/contact') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                        <div className='h-14 rounded-xl w-[3.5px] bg-auralblue'></div>

                        <div className='flex flex-row space-x-5 pr-5 items-center'>
                            <Link href="/wishlist" className="relative">
                                <CiHeart className='text-3xl text-gray-600 cursor-pointer' />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/cart" className="relative">
                                <HiOutlineShoppingCart className='text-3xl text-gray-600 cursor-pointer' />
                                {cartQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartQuantity}
                                    </span>
                                )}
                            </Link>
                            {isAuthenticated ? (
                                <div className="relative">
                                    <CgProfile 
                                        className='text-3xl text-gray-600 cursor-pointer' 
                                        onMouseEnter={() => setShowDropdown(true)}
                                        onMouseLeave={() => setShowDropdown(false)}
                                    />
                                    {showDropdown && (
                                        <div 
                                            className="absolute right-[-50px] w-44 bg-white rounded-md shadow-lg py-1 font-montserrat font-medium text-sm z-50"
                                            onMouseEnter={() => setShowDropdown(true)}
                                            onMouseLeave={() => setShowDropdown(false)}
                                        >
                                            <div className="block px-4 py-2 text-sm text-auralblue font-medium border-b border-gray-100 font-montserrat">
                                                Hi, {firstName}
                                            </div>
                                            <Link href="/my-info" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white font-montserrat">
                                                My Info
                                            </Link>
                                            <Link href="/my-orders" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white font-montserrat">
                                                My Orders
                                            </Link>
                                            <Link href="/saved-address" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white">
                                                Saved Address
                                            </Link>
                                            <p className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white cursor-pointer font-montserrat" onClick={handleLogout}>
                                                Log Out 
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login">
                                    <button className='px-4 py-3 rounded-full bg-transparent text-black border-2 border-auralblue hover:bg-auralblue hover:text-white font-montserrat font-medium'>Sign In / Sign Up</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Navbar
