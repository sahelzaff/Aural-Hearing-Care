'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import LoadingScreen from '@/Components/LoadingScreen';

export default function CheckoutConfirmation() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CheckoutConfirmationContent />
    </Suspense>
  );
}

function CheckoutConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const cartItems = useSelector((state) => state.cart.items);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.replace('/cart');
    }
    
    // Trigger confetti animation
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    // Show loading state briefly for animation
    setTimeout(() => {
      setIsLoading(false);
      triggerConfetti();
    }, 1000);

    window.scrollTo(0, 0);
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-auralblue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-outfit">Order Confirmed!</h1>
              <p className="text-gray-600 font-poppins">Thank you for your purchase</p>
            </div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-t border-b py-6 mb-6"
            >
              <div className="flex items-center mb-4">
                <FaBox className="text-auralblue mr-2" />
                <h2 className="text-xl font-semibold font-outfit">Order Details</h2>
              </div>
              <div className="space-y-2 font-poppins">
                <p><span className="font-medium">Order ID:</span> {orderId}</p>
                <p><span className="font-medium">Order Date:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="font-medium">Payment Method:</span> Cash on Delivery</p>
              </div>
            </motion.div>

            {/* Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-4 font-outfit">Products Ordered</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-outfit font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                      <p className="text-sm text-auralblue font-poppins">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-auralblue mr-2" />
                <h3 className="text-lg font-semibold font-outfit">Shipping Address</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg font-poppins">
                <p className="font-medium">John Doe</p>
                <p className="text-gray-600">123 Main Street</p>
                <p className="text-gray-600">Apartment 4B</p>
                <p className="text-gray-600">New York, NY 10001</p>
                <p className="text-gray-600">Phone: +1 234 567 890</p>
              </div>
            </motion.div>

            {/* Delivery Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center bg-blue-50 p-6 rounded-lg"
            >
              <FaTruck className="w-8 h-8 text-auralblue mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2 font-outfit">Delivery Status</h3>
              <p className="text-gray-600 font-poppins">Your order will be delivered within 5-6 business days</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-auralblue text-white rounded-md hover:bg-opacity-90 transition-colors font-poppins"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {/* Add track order functionality */}}
                className="px-6 py-3 border border-auralblue text-auralblue rounded-md hover:bg-blue-50 transition-colors font-poppins"
              >
                Track Order
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
} 