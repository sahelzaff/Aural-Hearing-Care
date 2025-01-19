'use client';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '@/store/cartSlice';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Navbar from '@/Components/Global Components/Navbar';
import Footer from '@/Components/Global Components/Footer';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (status === 'authenticated') {
      router.push('/checkout');
    } else {
      const returnUrl = encodeURIComponent('/checkout');
      router.push(`/login?redirect=${returnUrl}`);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <TopbarBelow />
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 font-poppins">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              href="/products" 
              className="inline-block bg-auralblue text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopbarBelow />
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className=" mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 font-outfit text-auralyellow">Shopping Cart</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center p-6 border-b border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1 ml-6">
                      <h3 className="text-lg font-semibold font-outfit">{item.name}</h3>
                      <p className="text-gray-600 font-poppins">{item.brand}</p>
                      <p className="text-auralblue font-medium font-poppins">₹{item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <div 
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="px-3 py-2 cursor-pointer border-r border-gray-300"
                        >
                          <FaMinus className="text-auralblue w-3 h-3" />
                        </div>
                        <span className="px-4 py-2 font-medium text-gray-700 bg-white">{item.quantity}</span>
                        <div 
                          onClick={() => handleIncreaseQuantity(item)}
                          className="px-3 py-2 cursor-pointer border-l border-gray-300"
                        >
                          <FaPlus className="text-auralblue w-3 h-3" />
                        </div>
                      </div>
                      <FaTrash 
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="text-red-500 w-4 h-4 cursor-pointer hover:text-red-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 font-outfit">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between font-poppins">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-poppins">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-auralblue">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full bg-auralyellow text-white py-3 rounded-md font-medium mt-6 hover:bg-opacity-90 transition-colors"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-md font-medium mt-4 hover:bg-gray-200 transition-colors"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;