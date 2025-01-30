'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import ShippingAddressForm from '@/Components/Checkout/ShippingAddressForm';
import LoadingScreen from '@/Components/LoadingScreen';
import OrderSummary from '@/Components/Checkout/OrderSummary';

const CheckoutPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [shippingMethod, setShippingMethod] = useState('standard');

  useEffect(() => {
    const checkAccess = async () => {
      // If cart is empty, redirect to cart page
      if (cartItems.length === 0) {
        await router.replace('/cart');
        return;
      }

      // If user is not authenticated, redirect to login
      if (status === 'unauthenticated') {
        const returnUrl = encodeURIComponent('/checkout');
        await router.replace(`/login?redirect=${returnUrl}`);
        return;
      }
    };

    checkAccess();
  }, [cartItems.length, status, router]);

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
  };

  if (status === 'loading' || cartItems.length === 0) {
    return <LoadingScreen />;
  }

  if (!session) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shipping Address Form */}
            <div className="md:col-span-2">
              <ShippingAddressForm onShippingMethodChange={handleShippingMethodChange} />
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4 font-outfit">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium font-poppins">{item.name}</p>
                      <p className="text-sm text-gray-500 font-poppins">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium font-poppins">₹{item.totalPrice.toLocaleString()}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="font-poppins">Total</span>
                    <span className="font-poppins">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage; 