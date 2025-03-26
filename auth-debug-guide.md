# Authentication Flow Debugging Guide

This guide provides detailed instructions for testing and debugging the authentication flow in your application.

## Required Backend Endpoints

### 1. Registration Endpoint
- **URL**: `http://localhost:5003/api/auth/register`
- **Method**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "SecureP@ss123",
    "confirmPassword": "SecureP@ss123"
  }
  ```
- **Expected Response** (Status 201):
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "emailVerified": false,
      "role": "user",
      "createdAt": "timestamp"
    }
  }
  ```

### 2. Email Verification Endpoint
- **URL**: `http://localhost:5003/api/auth/verify-email`
- **Method**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Expected Response** (Status 200):
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "emailVerified": true,
      "role": "user",
      "createdAt": "timestamp"
    }
  }
  ```

### 3. Login Endpoint
- **URL**: `http://localhost:5003/api/auth/login`
- **Method**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecureP@ss123"
  }
  ```
- **Expected Response** (Status 200):
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "emailVerified": true,
      "role": "user",
      "createdAt": "timestamp"
    }
  }
  ```

### 4. Get User Data Endpoint
- **URL**: `http://localhost:5003/api/users/me`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Expected Response** (Status 200):
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "emailVerified": true,
      "role": "user",
      "createdAt": "timestamp"
    }
  }
  ```

### 5. Logout Endpoint (Optional)
- **URL**: `http://localhost:5003/api/auth/logout`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Expected Response** (Status 200):
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## Testing the Authentication Flow

### Method 1: Using the Test Script

1. Run the `auth-test.js` script to test all endpoints:
   ```
   node auth-test.js
   ```

2. Check the console output for detailed information about each request and response.

### Method 2: Manual Testing with Browser DevTools

1. **Registration**:
   - Open your browser's DevTools (F12)
   - Go to the Network tab
   - Fill out the registration form and submit
   - Look for the `/api/auth/register` request
   - Check the response to ensure it contains a token
   - Verify the token is stored in localStorage

2. **Email Verification**:
   - Enter the OTP in the verification form
   - Look for the `/api/auth/verify-email` request
   - Check the response to ensure it indicates success
   - If automatic login is attempted, look for the `/api/auth/login` request

3. **User Data Fetch**:
   - After verification, look for the `/api/users/me` request
   - Check the request headers to ensure the Authorization header is set correctly
   - Check the response to ensure it contains user data

## Common Issues and Solutions

### 1. Token Not Being Stored

**Symptoms**:
- After registration, `localStorage.getItem('authToken')` returns null
- Authentication fails after email verification

**Possible Causes**:
- Backend not returning a token in the registration response
- Frontend not properly storing the token

**Solutions**:
- Check the registration response in DevTools to ensure it contains a token
- Verify the token is being stored in localStorage with:
  ```javascript
  console.log('Token:', localStorage.getItem('authToken'));
  ```

### 2. Authentication Header Not Being Set

**Symptoms**:
- User data fetch fails with 401 Unauthorized
- User is redirected to login page after verification

**Possible Causes**:
- Token not being included in the Authorization header
- Token format incorrect

**Solutions**:
- Check the request headers for the `/api/users/me` request
- Ensure the Authorization header is set correctly:
  ```javascript
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  ```
- Verify the token format matches what the backend expects

### 3. Email Verification Not Working

**Symptoms**:
- OTP verification fails
- User not marked as verified after entering OTP

**Possible Causes**:
- Incorrect OTP format
- Backend not properly handling the verification

**Solutions**:
- Check the request payload for the `/api/auth/verify-email` request
- Ensure the OTP is being sent in the correct format
- Verify the backend is properly updating the user's verification status

### 4. Redirect Issues

**Symptoms**:
- User not redirected after successful verification
- User redirected to wrong page

**Possible Causes**:
- Navigation code not executing
- Conditional logic preventing redirect

**Solutions**:
- Use `window.location.href` for direct navigation:
  ```javascript
  window.location.href = '/';
  ```
- Add console logs before and after navigation code to track execution

## Debugging Tools

### 1. Console Logging

Add detailed console logs at key points in the authentication flow:

```javascript
// Before making API requests
console.log('Making request to:', url, 'with data:', data);

// After receiving responses
console.log('Response:', response.data);

// Before navigation
console.log('Redirecting to:', path);
```

### 2. localStorage Inspection

Check localStorage contents in the browser console:

```javascript
// View all localStorage items
console.log('localStorage:', { ...localStorage });

// Check specific items
console.log('authToken:', localStorage.getItem('authToken'));
console.log('userEmail:', localStorage.getItem('userEmail'));
```

### 3. Network Request Inspection

In the browser's DevTools Network tab:

1. Filter requests by:
   - `/api/auth/register`
   - `/api/auth/verify-email`
   - `/api/auth/login`
   - `/api/users/me`

2. For each request, check:
   - Request headers
   - Request payload
   - Response status
   - Response body

## Final Checklist

- [ ] Backend returns a token on successful registration
- [ ] Token is stored in localStorage
- [ ] Email verification endpoint returns success
- [ ] Authorization header is set correctly for authenticated requests
- [ ] User data can be fetched with the token
- [ ] User is redirected to the home page after successful verification
- [ ] User remains authenticated after page refresh

## Important Notes for Backend Implementation

1. **Token Format**: The token should be a JWT (JSON Web Token) with the following structure:
   ```
   header.payload.signature
   ```
   Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

2. **Token Generation**: Ensure that the JWT token is properly generated with the user's ID and appropriate expiration time.

3. **Token Verification**: Properly verify the token in protected routes.

4. **Email Verification**: Update the user's `emailVerified` status in the database after successful verification.

5. **Error Handling**: Return appropriate error messages and status codes for different error scenarios.

6. **CORS Configuration**: Ensure that CORS is properly configured to allow requests from the frontend.

7. **Security Considerations**:
   - Use HTTPS in production
   - Implement rate limiting
   - Hash passwords before storing them
   - Set appropriate token expiration times
   - Use secure cookies if applicable 