import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    synced: false,  // Track if Redux cart is synced with backend
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemQuantity = newItem.quantity || 1;
      
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: itemQuantity,
          totalPrice: newItem.price * itemQuantity,
        });
        state.totalQuantity += itemQuantity;
      } else {
        existingItem.quantity += itemQuantity;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
        state.totalQuantity += itemQuantity;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );
      
      // Mark as synced if this is coming from the backend
      if (action.payload.synced) {
        state.synced = true;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    // New action to synchronize cart with backend data
    syncCartFromBackend: (state, action) => {
      const backendCart = action.payload;
      
      if (backendCart && backendCart.items) {
        state.items = backendCart.items.map(item => ({
          id: item.product_id,
          cartItemId: item.id,
          name: item.product_name || 'Product',
          price: typeof item.unit_price === 'string' ? parseFloat(item.unit_price) : item.unit_price,
          quantity: item.quantity,
          totalPrice: typeof item.total_price === 'string' ? parseFloat(item.total_price) : item.total_price,
          image: item.product_image || '',
        }));
        
        state.totalQuantity = backendCart.item_count || state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = backendCart.subtotal || state.items.reduce((total, item) => total + item.totalPrice, 0);
        state.synced = true;
      }
    }
  },
});

export const { addToCart, removeFromCart, clearCart, syncCartFromBackend } = cartSlice.actions;
export default cartSlice.reducer; 