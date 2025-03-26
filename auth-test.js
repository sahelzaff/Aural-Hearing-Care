/**
 * Authentication Flow Test Script
 * 
 * This script tests the complete authentication flow:
 * 1. Registration
 * 2. Email verification
 * 3. Login
 * 4. Fetching authenticated user data
 * 
 * Run this script with Node.js to test the authentication flow.
 */

const axios = require('axios');

// Base URL for the API
const API_BASE_URL = 'http://localhost:5003/api';

// Test user data
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

// Store tokens and OTP
let authToken = null;
let testOtp = '123456'; // This should be the OTP you receive in your email or test environment

// Helper function to log responses
const logResponse = (step, response) => {
  console.log(`\n===== ${step} =====`);
  console.log('Status:', response.status);
  console.log('Headers:', JSON.stringify(response.headers, null, 2));
  console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Helper function to log errors
const logError = (step, error) => {
  console.error(`\n===== ${step} ERROR =====`);
  console.error('Message:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', JSON.stringify(error.response.data, null, 2));
  }
};

// 1. Test Registration
const testRegistration = async () => {
  try {
    console.log('\n🔹 TESTING REGISTRATION');
    console.log('Request URL:', `${API_BASE_URL}/auth/register`);
    console.log('Request Body:', JSON.stringify(TEST_USER, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, TEST_USER);
    
    logResponse('REGISTRATION RESPONSE', response);
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Registration successful! Token received.');
      console.log('Token:', authToken);
      return true;
    } else {
      console.error('❌ Registration failed: No token received');
      return false;
    }
  } catch (error) {
    logError('REGISTRATION', error);
    return false;
  }
};

// 2. Test Email Verification
const testEmailVerification = async () => {
  try {
    console.log('\n🔹 TESTING EMAIL VERIFICATION');
    console.log('Request URL:', `${API_BASE_URL}/auth/verify-email`);
    console.log('Request Body:', JSON.stringify({
      email: TEST_USER.email,
      otp: testOtp
    }, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
      email: TEST_USER.email,
      otp: testOtp
    });
    
    logResponse('EMAIL VERIFICATION RESPONSE', response);
    
    if (response.data.success) {
      console.log('✅ Email verification successful!');
      return true;
    } else {
      console.error('❌ Email verification failed');
      return false;
    }
  } catch (error) {
    logError('EMAIL VERIFICATION', error);
    return false;
  }
};

// 3. Test Login
const testLogin = async () => {
  try {
    console.log('\n🔹 TESTING LOGIN');
    console.log('Request URL:', `${API_BASE_URL}/auth/login`);
    console.log('Request Body:', JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password
    }, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    logResponse('LOGIN RESPONSE', response);
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login successful! Token received.');
      console.log('Token:', authToken);
      return true;
    } else {
      console.error('❌ Login failed: No token received');
      return false;
    }
  } catch (error) {
    logError('LOGIN', error);
    return false;
  }
};

// 4. Test Fetching User Data
const testGetUserData = async () => {
  try {
    console.log('\n🔹 TESTING GET USER DATA');
    console.log('Request URL:', `${API_BASE_URL}/users/me`);
    console.log('Request Headers:', JSON.stringify({
      Authorization: `Bearer ${authToken}`
    }, null, 2));
    
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    logResponse('GET USER DATA RESPONSE', response);
    
    if (response.data.user) {
      console.log('✅ User data fetched successfully!');
      return true;
    } else {
      console.error('❌ Failed to fetch user data');
      return false;
    }
  } catch (error) {
    logError('GET USER DATA', error);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 STARTING AUTHENTICATION FLOW TESTS');
  
  // 1. Registration
  const registrationSuccess = await testRegistration();
  if (!registrationSuccess) {
    console.error('❌ Registration failed. Stopping tests.');
    return;
  }
  
  // 2. Email Verification
  const verificationSuccess = await testEmailVerification();
  if (!verificationSuccess) {
    console.error('❌ Email verification failed. Continuing with login test...');
  }
  
  // 3. Login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.error('❌ Login failed. Stopping tests.');
    return;
  }
  
  // 4. Get User Data
  const getUserDataSuccess = await testGetUserData();
  if (!getUserDataSuccess) {
    console.error('❌ Failed to fetch user data.');
  }
  
  console.log('\n🏁 AUTHENTICATION FLOW TESTS COMPLETED');
};

// Run the tests
runTests(); 