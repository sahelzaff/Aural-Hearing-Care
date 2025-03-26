/**
 * Token Storage Test Script
 * 
 * This script tests the token storage functionality.
 * It simulates a registration and checks if the token is properly stored in localStorage.
 * 
 * Run this script in the browser console to test the token storage.
 */

// Function to test token storage
async function testTokenStorage() {
  console.log('Starting token storage test...');
  
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('tempPassword');
  
  console.log('localStorage cleared');
  
  // Test data
  const userData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };
  
  console.log('Test user data:', { ...userData, password: '********', confirmPassword: '********' });
  
  try {
    // Simulate registration
    console.log('Simulating registration...');
    const response = await fetch('http://localhost:5003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.success && data.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('tempPassword', userData.password);
      
      console.log('Token stored in localStorage:', localStorage.getItem('authToken').substring(0, 10) + '...');
      console.log('Email stored in localStorage:', localStorage.getItem('userEmail'));
      console.log('Password stored in localStorage:', '********');
      
      // Check if token is stored
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        console.log('✅ Token storage test passed!');
      } else {
        console.log('❌ Token storage test failed: Token not stored in localStorage');
      }
    } else {
      console.log('❌ Token storage test failed: No token in response');
    }
  } catch (error) {
    console.error('❌ Token storage test failed:', error);
  }
}

// Run the test
testTokenStorage(); 