'use client';
import { useSelector } from 'react-redux';

const OrderSummary = ({ shippingMethod }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.totalAmount);
  
  const shippingCost = shippingMethod === 'express' ? 199 : 99;
  const gstAmount = subtotal * 0.05; // 5% GST
  const total = subtotal + shippingCost + gstAmount;

  return (
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
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span className="font-poppins">Subtotal</span>
            <span className="font-poppins">₹{subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span className="font-poppins">Shipping</span>
            <span className="font-poppins">₹{shippingCost}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span className="font-poppins">GST (5%)</span>
            <span className="font-poppins">₹{gstAmount.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span className="font-poppins">Total</span>
            <span className="font-poppins text-auralblue">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        form="shipping-form" // This connects the button to the form
        className="w-full bg-auralblue text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors mt-6"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default OrderSummary; 