'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCreditCard, FaWallet, FaTruck, FaMobile } from 'react-icons/fa';
import { BsCashStack, BsClock } from 'react-icons/bs';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import Breadcrumbs from '@/Components/Global Components/Breadcrumbs';

const paymentMethods = [
  { 
    id: 'credit', 
    label: 'Credit Card',
    icon: <FaCreditCard className="text-xl" />,
    description: 'Secure payment with credit card'
  },
  { 
    id: 'debit', 
    label: 'Debit Card',
    icon: <FaCreditCard className="text-xl" />,
    description: 'Pay directly from your bank account'
  },
  { 
    id: 'bnpl', 
    label: 'Buy Now Pay Later',
    icon: <BsClock className="text-xl" />,
    description: 'Split your payment into easy installments'
  },
  { 
    id: 'upi', 
    label: 'UPI',
    icon: <FaMobile className="text-xl" />,
    description: 'Pay using any UPI app'
  },
  { 
    id: 'wallet', 
    label: 'Wallets',
    icon: <FaWallet className="text-xl" />,
    description: 'Pay using digital wallets'
  },
  { 
    id: 'cod', 
    label: 'Cash On Delivery',
    icon: <BsCashStack className="text-xl" />,
    description: 'Pay when you receive your order'
  }
];

const PaymentPage = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const shippingCost = 99; // Replace with actual selected shipping cost
  const gstAmount = totalAmount * 0.05; // 5% GST

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Shipping', href: '/checkout' },
    { label: 'Payment' },
  ];

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/cart');
    }
    window.scrollTo(0, 0);
  }, [cartItems.length, router]);

  const handlePromoCode = async () => {
    setIsApplyingPromo(true);
    try {
      // Add your promo code validation logic here
      console.log('Applying promo code:', promoCode);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePaymentSubmit = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (selectedPayment === 'cod') {
      // Generate a random order ID
      const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    } else {
      alert('Payment Method not available at the moment');
    }
  };

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Details and Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-4 font-outfit">Order Details</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <img 
                        src={item.images[0].url} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-outfit font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-poppins">Brand: {item.brand}</p>
                        <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                        <p className="text-sm text-auralblue font-poppins">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-gray-600">
                  <FaTruck className="mr-2" />
                  <span className="font-poppins text-sm">Standard Delivery (5-6 business days)</span>
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6 font-outfit">Select Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === method.id 
                          ? 'border-auralblue bg-blue-50 shadow-md' 
                          : 'hover:border-auralblue hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="text-auralblue"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            {method.icon}
                            <span className="ml-2 font-poppins font-medium">{method.label}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 font-poppins">{method.description}</p>
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Payment Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6 font-outfit">Payment Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue font-poppins"
                    />
                    <button
                      onClick={handlePromoCode}
                      disabled={isApplyingPromo || !promoCode}
                      className="px-4 py-2 bg-auralblue text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 font-poppins"
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-poppins">Subtotal</span>
                    <span className="font-poppins">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-poppins">GST (5%)</span>
                    <span className="font-poppins">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-poppins">Shipping</span>
                    <span className="font-poppins">₹{shippingCost}</span>
                  </div>
                  {/* Add discount line if promo code is applied */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="font-poppins">Total</span>
                      <span className="font-poppins text-auralblue">
                        ₹{(totalAmount + gstAmount + shippingCost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={!selectedPayment}
                  className="w-full mt-6 bg-auralblue text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage; 