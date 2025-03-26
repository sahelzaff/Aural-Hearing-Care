'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEdit, FaKey, FaShieldAlt, FaTimes, FaCheck, FaSignOutAlt, FaMobileAlt, FaDesktop, FaLaptop, FaTabletAlt, FaBirthdayCake, FaTrash, FaStar, FaPlus } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { toast } from 'react-hot-toast';
// import TopbarBelow from '@/Components/Global Components/TopbarBelow';
// import Navbar from '@/Components/Global Components/Navbar';
// import Footer from '@/Components/Global Components/Footer';
import LoadingScreen from '@/Components/LoadingScreen';
import Breadcrumbs from '@/Components/Global Components/Breadcrumbs';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

// Auth and User Service URLs
const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:5004';
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:5003';

export default function MyInfoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    gender: '',
    country: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    bio: '',
  });

  // Session management states
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevokingSession, setIsRevokingSession] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState('add'); // 'add' or 'edit'
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    address_type: 'home',
    is_default: false,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
    is_billing_address: false,
    is_shipping_address: false
  });

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        // Store the current path to redirect back after login
        localStorage.setItem('redirectAfterLogin', '/my-info');
        toast.error('Please sign in to access your account');
        router.push('/login');
      } else {
        // Fetch user data if authenticated
        fetchUserData();
        fetchUserAddresses();
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch user data from API
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch user profile from user service
      const response = await axios.get(`${USER_SERVICE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const { profile, user } = response.data.data;
        
        // Format the data from the API response
        const formattedUserData = {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone_number || '',
          alternatePhone: profile?.alternate_phone || '',
          gender: profile?.gender || '',
          country: profile?.country || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          pincode: profile?.pincode || '',
          dateOfBirth: profile?.date_of_birth || '',
          bio: profile?.bio || '',
          profilePicture: profile?.profile_picture_url || '',
          joinedDate: new Date(user.created_at).toISOString().split('T')[0] || '',
          lastLogin: new Date().toISOString().split('T')[0],
          orders: 0,
          wishlist: 0,
          emailVerified: user.is_verified || false,
          phoneVerified: false,
        };
        
        setUserData(formattedUserData);
        setFormData({
          firstName: formattedUserData.firstName,
          lastName: formattedUserData.lastName,
          email: formattedUserData.email,
          phone: formattedUserData.phone,
          alternatePhone: formattedUserData.alternatePhone,
          gender: formattedUserData.gender,
          country: formattedUserData.country,
          address: formattedUserData.address,
          city: formattedUserData.city,
          state: formattedUserData.state,
          pincode: formattedUserData.pincode,
          dateOfBirth: formattedUserData.dateOfBirth,
          bio: formattedUserData.bio,
        });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data. Please try again.');
      
      // Redirect to login if authentication error
      if (error.response?.status === 401) {
        localStorage.setItem('redirectAfterLogin', '/my-info');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user addresses from API
  const fetchUserAddresses = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Fetching addresses...');
      const response = await axios.get(`${USER_SERVICE_URL}/api/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Address response:', response.data);
      
      if (response.data.success) {
        const addresses = response.data.data.addresses;
        const defaultAddress = addresses.find(addr => addr.is_default);
        
        setUserData(prev => ({
          ...prev,
          address: defaultAddress ? `${defaultAddress.address_line1}, ${defaultAddress.address_line2 ? defaultAddress.address_line2 + ', ' : ''}${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.postal_code}` : 'No default address provided',
          addresses: addresses
        }));
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses. Please try again.');
    }
  };

  // Format Date of Birth
  const formatDateOfBirth = (dob) => {
    return new Date(dob).toLocaleDateString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Prepare the data to update
      const updateData = {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone
        },
        profile: {
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          bio: formData.bio,
          country: formData.country,
          address: formData.address,
          alternate_phone: formData.alternatePhone
        }
      };
      
      // Make the update request
      const response = await axios.put(
        `${USER_SERVICE_URL}/users/profile`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        
        // Update local state with the response
        const { profile, user } = response.data.data;
        
        setUserData(prev => ({
          ...prev,
          firstName: user.first_name || formData.firstName,
          lastName: user.last_name || formData.lastName,
          email: user.email || formData.email,
          phone: user.phone_number || formData.phone,
          alternatePhone: profile?.alternate_phone || formData.alternatePhone,
          gender: profile?.gender || formData.gender,
          country: profile?.country || formData.country,
          address: profile?.address || formData.address,
          dateOfBirth: profile?.date_of_birth || formData.dateOfBirth,
          bio: profile?.bio || formData.bio
        }));
        
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new address
  const addAddress = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(`${USER_SERVICE_URL}/api/users/addresses`, addressFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Address added successfully');
        setShowAddressModal(false);
        fetchUserAddresses();
        resetAddressForm();
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address. Please try again.');
    }
  };

  // Update an existing address
  const updateAddress = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.put(`${USER_SERVICE_URL}/api/users/addresses/${currentAddress.id}`, addressFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Address updated successfully');
        setShowAddressModal(false);
        fetchUserAddresses();
        resetAddressForm();
      } else {
        throw new Error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address. Please try again.');
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.delete(`${USER_SERVICE_URL}/api/users/addresses/${addressId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Address deleted successfully');
        fetchUserAddresses();
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    }
  };

  // Set an address as default
  const setDefaultAddress = async (addressId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.patch(`${USER_SERVICE_URL}/api/users/addresses/${addressId}/default`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Default address updated successfully');
        fetchUserAddresses();
      } else {
        throw new Error('Failed to update default address');
      }
    } catch (error) {
      console.error('Error updating default address:', error);
      toast.error('Failed to update default address. Please try again.');
    }
  };

  // Handle address form input changes
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressFormData({
      address_type: 'home',
      is_default: false,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone_number: '',
      is_billing_address: false,
      is_shipping_address: false
    });
    setCurrentAddress(null);
  };

  // Open modal for adding a new address
  const openAddAddressModal = () => {
    resetAddressForm();
    setAddressModalMode('add');
    setShowAddressModal(true);
  };

  // Open modal for editing an existing address
  const openEditAddressModal = (address) => {
    setCurrentAddress(address);
    setAddressFormData({
      address_type: address.address_type,
      is_default: address.is_default,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone_number: address.phone_number,
      is_billing_address: address.is_billing_address,
      is_shipping_address: address.is_shipping_address
    });
    setAddressModalMode('edit');
    setShowAddressModal(true);
  };

  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (addressModalMode === 'add') {
      await addAddress();
    } else {
      await updateAddress();
    }
  };

  // Updated motion config for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  // Add these animation variants
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300 }
    },
    active: {
      scale: 1.05,
      color: "#2d79f3",
      borderBottom: "2px solid #2d79f3"
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const accessToken = getAuthToken();
      
      if (!accessToken) {
        toast.error("Authentication token not found");
        return;
      }
      
      const response = await axios.get(`${AUTH_SERVER_URL}/api/sessions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSessions(response.data.data.sessions);
      } else {
        toast.error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Only show toast message, don't redirect on this error
      // This way the user can still use the profile page even if session fetching fails
      toast.error("Couldn't load active sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Revoke a specific session
  const revokeSession = async (sessionId) => {
    setIsRevokingSession(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        toast.error("Authentication token not found");
        return;
      }
      
      const response = await axios.delete(`${AUTH_SERVER_URL}/api/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success("Session revoked successfully");
        fetchActiveSessions(); // Refresh the sessions list
      } else {
        toast.error("Failed to revoke session");
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      toast.error(error.response?.data?.message || "An error occurred while revoking the session");
    } finally {
      setIsRevokingSession(false);
    }
  };

  // Revoke all sessions except current
  const revokeAllSessions = async () => {
    setIsRevokingSession(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        toast.error("Authentication token not found");
        return;
      }
      
      const response = await axios.delete(`${AUTH_SERVER_URL}/api/sessions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success("All sessions revoked successfully");
        fetchActiveSessions(); // Refresh the sessions list
      } else {
        toast.error("Failed to revoke all sessions");
      }
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      toast.error(error.response?.data?.message || "An error occurred while revoking sessions");
    } finally {
      setIsRevokingSession(false);
    }
  };

  // Fetch sessions when security tab is activated
  useEffect(() => {
    if (activeTab === 'security') {
      fetchActiveSessions();
    }
  }, [activeTab]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* <TopbarBelow /> */}
      {/* <Navbar /> */}
      
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="mb-4 border-b border-gray-200 py-2"
          >
            <Breadcrumbs items={[
              { href: "/", label: "Home" },
              { label: "My Account" }
            ]} />
            <h1 className="text-2xl font-bold text-auralblue font-outfit mb-1">Account Overview</h1>
            <p className="text-sm text-gray-600 font-poppins">Manage your personal information and security settings</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/4"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 bg-auralblue text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <FaUser size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-outfit">{userData?.firstName || 'User'} {userData?.lastName || ''}</h2>
                      <p className="text-sm opacity-80 font-poppins">{userData?.email || 'Loading...'}</p>
                    </div>
                  </div>
                </div>
                
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('personal')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                          activeTab === 'personal' 
                            ? 'bg-auralblue/10 text-auralblue font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaUser className="flex-shrink-0" />
                        <span>Personal Information</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('address')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                          activeTab === 'address' 
                            ? 'bg-auralblue/10 text-auralblue font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaMapMarkerAlt className="flex-shrink-0" />
                        <span>Addresses</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                          activeTab === 'security' 
                            ? 'bg-auralblue/10 text-auralblue font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaShieldAlt className="flex-shrink-0" />
                        <span>Security & Sessions</span>
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="p-4 border-t border-gray-100">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Member since</span>
                      <span className="font-medium">{userData?.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last login</span>
                      <span className="font-medium">{userData?.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-auralblue">{userData?.orders || 0}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-auralblue">{userData?.wishlist || 0}</div>
                    <div className="text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-3/4"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 font-outfit">
                    {activeTab === 'personal' && 'Personal Information'}
                    {activeTab === 'address' && 'Address Information'}
                    {activeTab === 'security' && 'Security Settings'}
                  </h2>
                  
                  {(activeTab === 'personal' || activeTab === 'address') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 text-auralblue hover:text-auralblue/80 transition-colors"
                    >
                      {isEditing ? <FaTimes /> : <FaEdit />}
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </motion.button>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  {activeTab === 'personal' && (
                    <motion.div
                      key="personal"
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                      {!isEditing ? (
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaUser />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Full Name</h3>
                                <p className="text-gray-600">{userData?.firstName || 'Not provided'} {userData?.lastName || ''}</p>
                              </div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaEnvelope />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                <p className="text-gray-600">{userData?.email || 'Not provided'}</p>
                                {userData?.emailVerified && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                    <MdVerified className="mr-1" /> Verified
                                  </span>
                                )}
                              </div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaPhoneAlt />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Phone Number</h3>
                                <p className="text-gray-600">{userData?.phone || 'Not provided'}</p>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaPhoneAlt />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Alternate Phone</h3>
                                <p className="text-gray-600">{userData?.alternatePhone || 'Not provided'}</p>
                              </div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaBirthdayCake />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Date of Birth</h3>
                                <p className="text-gray-600">{userData?.dateOfBirth ? formatDateOfBirth(userData.dateOfBirth) : 'Not provided'}</p>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaUser />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Gender</h3>
                                <p className="text-gray-600">{userData?.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not specified'}</p>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="md:col-span-2 flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaUser />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                                <p className="text-gray-600">{userData?.bio || 'No bio provided'}</p>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaMapMarkerAlt />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Country</h3>
                                <p className="text-gray-600">{userData?.country || 'Not specified'}</p>
                              </div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                                <FaMapMarkerAlt />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                                <p className="text-gray-600">{userData?.address || 'No address provided'}</p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                                required
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                                required
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                                required
                              />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">Alternate Phone</label>
                              <input
                                type="tel"
                                id="alternatePhone"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                              <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                              </select>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                              <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                              <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue sm:text-sm"
                              />
                            </motion.div>
                          </div>
                          
                          <motion.div variants={itemVariants} className="flex justify-end">
                            <button
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-auralblue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auralblue"
                            >
                              Save Changes
                            </button>
                          </motion.div>
                        </form>
                      )}
                    </motion.div>
                  )}
                  
                  {activeTab === 'address' && (
                    <motion.div
                      key="address"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={containerVariants}
                      className="p-6"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Your Addresses</h2>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={openAddAddressModal}
                          className="flex items-center gap-2 px-4 py-2 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors"
                        >
                          <FaPlus /> Add New Address
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userData?.addresses?.map((address) => (
                          <motion.div 
                            key={address.id} 
                            variants={itemVariants}
                            className="relative bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditAddressModal(address)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                                title="Edit Address"
                              >
                                <FaEdit size={16} />
                              </motion.button>
                              {!address.is_default && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="p-2 bg-gray-100 hover:bg-yellow-100 rounded-full text-gray-600 hover:text-yellow-600 transition-colors"
                                  title="Set as Default"
                                >
                                  <FaStar size={16} />
                                </motion.button>
                              )}
                              {userData?.addresses?.length > 1 && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteAddress(address.id)}
                                  className="p-2 bg-gray-100 hover:bg-red-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                                  title="Delete Address"
                                >
                                  <FaTrash size={16} />
                                </motion.button>
                              )}
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue flex-shrink-0">
                                <FaMapMarkerAlt />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                                    {address.address_type} Address
                                  </h3>
                                  {address.is_default && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-1">
                                  {address.address_line1}
                                  {address.address_line2 && `, ${address.address_line2}`}
                                </p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state}, {address.postal_code}
                                </p>
                                <p className="text-gray-600">{address.country}</p>
                                <p className="text-gray-600 mt-2">Phone: {address.phone_number}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {address.is_billing_address && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Billing
                                    </span>
                                  )}
                                  {address.is_shipping_address && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      Shipping
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {(!userData?.addresses || userData.addresses.length === 0) && (
                          <motion.div 
                            variants={itemVariants}
                            className="col-span-full text-center py-10"
                          >
                            <p className="text-gray-500">You don't have any saved addresses yet.</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={openAddAddressModal}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors"
                            >
                              <FaPlus /> Add Your First Address
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={containerVariants}
                      className="p-6"
                    >
                      <div className="space-y-8">
                        <motion.div variants={itemVariants} className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                            <FaKey />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Password</h3>
                                <p className="text-gray-600">Last changed 3 months ago</p>
                              </div>
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Change Password
                              </button>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                            <FaShieldAlt />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                                <p className="text-gray-600">Add an extra layer of security to your account</p>
                              </div>
                              <button className="px-4 py-2 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors">
                                Enable
                              </button>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Active Sessions Section */}
                        <motion.div variants={itemVariants} className="mt-8 border-t pt-8">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-xl font-medium text-gray-900">Active Sessions</h3>
                              <p className="text-gray-600 text-sm">Devices currently signed in to your account</p>
                            </div>
                            <button 
                              onClick={revokeAllSessions}
                              disabled={isRevokingSession}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isRevokingSession ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <FaSignOutAlt />
                                  Sign Out All Devices
                                </>
                              )}
                            </button>
                          </div>
                          
                          {isLoadingSessions ? (
                            <div className="flex justify-center items-center py-12">
                              <svg className="animate-spin h-8 w-8 text-auralblue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                          ) : sessions.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                              <p className="text-gray-600">No active sessions found</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {sessions.map((session) => (
                                <div key={session.id} className="bg-white border rounded-lg p-4 flex items-start justify-between">
                                  <div className="flex items-start space-x-4">
                                    <div className="mt-1">
                                      {session.device.toLowerCase().includes('mobile') ? (
                                        <FaMobileAlt size={20} className="text-gray-500" />
                                      ) : session.device.toLowerCase().includes('tablet') ? (
                                        <FaTabletAlt size={20} className="text-gray-500" />
                                      ) : (
                                        <FaDesktop size={20} className="text-gray-500" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{session.device}</h4>
                                      <div className="text-sm text-gray-500">
                                        <p>IP: {session.ip_address}</p>
                                        <p>Last active: {new Date(session.last_active).toLocaleString()}</p>
                                        {session.is_current && (
                                          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Current Session
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {!session.is_current && (
                                    <button
                                      onClick={() => revokeSession(session.id)}
                                      disabled={isRevokingSession}
                                      className="ml-4 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isRevokingSession ? 'Revoking...' : 'Revoke'}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-auralblue/10 flex items-center justify-center text-auralblue">
                            <FaEnvelope />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Email Verification</h3>
                                <p className="text-gray-600">{userData?.emailVerified ? 'Your email has been verified' : 'Please verify your email'}</p>
                              </div>
                              <div className="flex items-center">
                                {userData?.emailVerified ? (
                                  <span className="flex items-center text-green-600">
                                    <MdVerified className="mr-1" /> Verified
                                  </span>
                                ) : (
                                  <button className="px-4 py-2 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors">
                                    Verify Email
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* <Footer /> */}

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {addressModalMode === 'add' ? 'Add New Address' : 'Edit Address'}
                </h2>
              </div>
              
              <form onSubmit={handleAddressSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select
                      name="address_type"
                      value={addressFormData.address_type}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={addressFormData.address_line1}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={addressFormData.address_line2}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressFormData.city}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressFormData.state}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={addressFormData.postal_code}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={addressFormData.country}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={addressFormData.phone_number}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-auralblue focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        checked={addressFormData.is_default}
                        onChange={handleAddressInputChange}
                        className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
                      />
                      <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_billing_address"
                        name="is_billing_address"
                        checked={addressFormData.is_billing_address}
                        onChange={handleAddressInputChange}
                        className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
                      />
                      <label htmlFor="is_billing_address" className="ml-2 block text-sm text-gray-700">
                        Use as billing address
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_shipping_address"
                        name="is_shipping_address"
                        checked={addressFormData.is_shipping_address}
                        onChange={handleAddressInputChange}
                        className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
                      />
                      <label htmlFor="is_shipping_address" className="ml-2 block text-sm text-gray-700">
                        Use as shipping address
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors"
                  >
                    {addressModalMode === 'add' ? 'Add Address' : 'Update Address'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 
