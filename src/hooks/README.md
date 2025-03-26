# Cart Integration

This directory contains custom hooks for various features in the Aural Hearing Care application.

## useCart Hook

The `useCart` hook provides a complete integration with the backend cart API with local fallback support.

### Features

- Seamless integration with backend cart API
- Automatic handling of both authenticated and guest carts
- Local storage fallback for offline support
- Redux integration for UI components that rely on the Redux store
- Comprehensive error handling and loading states
- **Automatic cart merging** when a guest user logs in
- **Seamless cart initialization** with product add in a single operation

### Usage

```javascript
import useCart from '@/hooks/useCart';

function MyComponent() {
  const { 
    cart,                   // Current cart data
    loading,                // Loading state
    error,                  // Error state
    isEmpty,                // Boolean indicating if cart is empty
    isGuestCart,            // Boolean indicating if this is a guest cart

    // Functions
    fetchCart,              // Refresh cart data
    addItem,                // Add item to cart
    removeItem,             // Remove item from cart
    updateItemQuantity,     // Update item quantity
    clearCart,              // Clear entire cart
    applyCoupon,            // Apply coupon to cart
    removeCoupon,           // Remove coupon from cart
    mergeGuestCart,         // Manually merge guest cart with user cart
    initializeCartWithProduct // Initialize cart and add product in one operation
  } = useCart();

  // Example: Add item to cart
  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  // Example: Initialize cart with a product (for first-time visitors)
  const handleQuickAddToCart = async (product) => {
    const result = await initializeCartWithProduct(product, 1);
    if (result.success) {
      // Success notification
    } else {
      // Error notification
    }
  };

  // Example: Remove item from cart
  const handleRemoveFromCart = (productId, cartItemId) => {
    removeItem(productId, cartItemId);
  };

  // Example: Update quantity
  const handleQuantityChange = (productId, newQuantity, cartItemId) => {
    updateItemQuantity(productId, newQuantity, cartItemId);
  };

  // Example: Clear cart
  const handleClearCart = () => {
    clearCart();
  };

  // Example: Apply coupon
  const handleApplyCoupon = async (code) => {
    const result = await applyCoupon(code);
    if (result.success) {
      // Success notification
    } else {
      // Error notification
    }
  };

  // Display cart info
  return (
    <div>
      {loading && <p>Loading cart...</p>}
      {error && <p>Error: {error}</p>}
      {isEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <p>Items in cart: {cart.item_count}</p>
          <p>Total: ${cart.total}</p>
          <ul>
            {cart.items.map(item => (
              <li key={item.id}>
                {item.product_name} - {item.quantity} x ${item.unit_price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Seamless Cart Initialization

For first-time visitors or when adding a product directly from product pages, the `initializeCartWithProduct` function provides a seamless experience by:

1. Getting or creating a cart (with session token)
2. Immediately adding the product to that cart
3. Returning the updated cart data

This happens in milliseconds, ensuring a smooth user experience without any sequential API calls being visible to the user.

Example usage:

```javascript
// On a product detail page
const handleBuyNow = async () => {
  const result = await initializeCartWithProduct({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image_url
  }, 1);
  
  if (result.success) {
    router.push('/cart');
  } else {
    toast.error(result.message);
  }
};
```

### Cart Object Structure

The cart object returned from the `useCart` hook has the following structure:

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  items: [
    {
      id: "9d0b1126-75fe-4c02-8a4b-df24f4c3a9a0",
      product_id: "7f4b1a43-8d6c-4d2e-a4fc-9eacb295c107",
      variant_id: null,
      quantity: 2,
      unit_price: 99.99,
      total_price: 199.98,
      product_name: "Premium Hearing Aid",
      product_slug: "premium-hearing-aid",
      product_image: "http://localhost:9100/aural-product-images/premium-hearing-aid.jpg"
    }
  ],
  item_count: 1,
  subtotal: 199.98,
  discount_amount: 0,
  tax_amount: 0,
  total: 199.98,
  coupon: null,
  is_guest: false,
  user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  session_token: "c5cebaee-705b-4b31-877f-e5b55f095eee" // Only for guest carts
}
```

### Authentication Handling

The hook automatically handles transitions between guest and authenticated carts by:

1. Listening for authentication state changes
2. Using the appropriate tokens (access token for authenticated users, session token for guest carts)
3. **Automatically merging guest carts** with user carts when a user logs in

When a guest user logs in, the hook will:
1. Detect the authentication change
2. Check if there's a guest cart session token in localStorage
3. Automatically call the `/api/cart/merge` endpoint to merge the carts
4. Update the UI with the merged cart data
5. Show a success notification to the user

### Server Response Handling

The hook properly handles API responses including:
- String vs. numeric price values (parsing as needed)
- Missing or nullable fields
- Session token management for guest carts
- Error messages and error state management

## cartService

The `cartService` module provides direct API calls to the backend cart endpoints:

```javascript
import cartService from '@/services/cartService';

// Example usage
const { success, data } = await cartService.getCart();
```

Available methods:
- `getCart()` - Get current cart
- `addToCart(item)` - Add item to cart
- `updateCartItem(itemId, quantity)` - Update item quantity
- `removeFromCart(itemId)` - Remove item from cart
- `clearCart()` - Clear entire cart
- `applyCoupon(couponCode)` - Apply coupon to cart
- `removeCoupon()` - Remove coupon from cart
- `mergeCart(sessionToken)` - Merge guest cart with user cart 