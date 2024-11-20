'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/lib/validations';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { AiFillApple } from 'react-icons/ai';
import '@/app/signup/signup.css';
import { signIn } from 'next-auth/react';
import { countries } from 'countries-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    gender: 'other',
    mobile: '',
    alternate_mobile: '',
    country: '',
    address: '',
    default_address: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const router = useRouter();
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91'); // Default to India

  // Convert countries object to array and sort by name
  const countryList = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
    dial_code: country.phone[0]
  })).sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      return true;
    } catch (error) {
      if (error.errors) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general: 'Validation failed. Please check your inputs.'
        });
      }
      return false;
    }
  };

  // Password validation effect
  useEffect(() => {
    const { password } = formData;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [formData.password]);

  // Password match check
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const ValidationItem = ({ isValid, text }) => (
    <div className="validation-item">
      <span className={`validation-icon ${isValid ? 'success' : 'error'}`}>
        {isValid ? <FaCheck /> : <FaTimes />}
      </span>
      <span>{text}</span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      // Add country code to mobile number
      dataToSend.mobile = `${selectedCountryCode}${dataToSend.mobile}`;

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful!');
        
        // Auto login after successful registration
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginResult.error) {
          toast.error('Auto-login failed. Please login manually.');
          router.push('/login');
        } else {
          router.push('http://localhost:3000');
        }
      } else {
        toast.error(data.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error('An error occurred while creating your account');
    }
  };

  return (
    <div className="signup-container">
      <form className="formsignup" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>

        <div className="signup-grid">
          <div className="signup-field">
            <label>First Name</label>
            <div className="inputForm">
              <input
                type="text"
                name="first_name"
                className="input"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            {errors.first_name && <p className="error-text">{errors.first_name}</p>}
          </div>

          <div className="signup-field">
            <label>Last Name</label>
            <div className="inputForm">
              <input
                type="text"
                name="last_name"
                className="input"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            {errors.last_name && <p className="error-text">{errors.last_name}</p>}
          </div>
        </div>

        <div className="signup-grid">
          <div className="signup-field">
            <label>Email</label>
            <div className="inputForm">
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="signup-field">
            <label>Mobile Number</label>
            <PhoneInput
              country={'in'}
              value={formData.mobile}
              onChange={phone => {
                setFormData(prev => ({
                  ...prev,
                  mobile: phone
                }));
              }}
              inputClass="phone-input"
              containerClass="phone-container"
              buttonClass="country-dropdown"
              enableSearch={true}
              searchPlaceholder="Search country..."
              disableSearchIcon={false}
              searchNotFound="No country found"
              preferredCountries={['in', 'us', 'gb', 'ca', 'au']}
            />
            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
          </div>
        </div>

        <div className="signup-grid">
          <div className="signup-field">
            <label>Password</label>
            <div className="inputForm password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <div className="password-toggle">
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(true)} />
                )}
              </div>
              {isPasswordFocused && (
                <div className="password-validation-box">
                  <ValidationItem 
                    isValid={passwordValidation.length} 
                    text="At least 8 characters" 
                  />
                  <ValidationItem 
                    isValid={passwordValidation.uppercase} 
                    text="One uppercase letter" 
                  />
                  <ValidationItem 
                    isValid={passwordValidation.number} 
                    text="One number" 
                  />
                  <ValidationItem 
                    isValid={passwordValidation.special} 
                    text="One special character" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="signup-field">
            <label>Confirm Password</label>
            <div className="inputForm password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="password-toggle">
                {showConfirmPassword ? (
                  <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowConfirmPassword(true)} />
                )}
              </div>
            </div>
            {formData.confirmPassword && (
              <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'mismatch'}`}>
                {passwordsMatch ? (
                  <>
                    <FaCheck /> Passwords match
                  </>
                ) : (
                  <>
                    <FaTimes /> Passwords don't match
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="signup-button" type="submit">Sign Up</button>

        <div className="social-buttons">
          <button type="button" className="social-button">
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>
          <button type="button" className="social-button">
            <AiFillApple size={20} />
            <span>Sign up with Apple</span>
          </button>
        </div>
        
        <p className="signup-footer">
          Already have an account? <span onClick={() => router.push('/login')}>Sign In</span>
        </p>
      </form>
    </div>
  );
}
