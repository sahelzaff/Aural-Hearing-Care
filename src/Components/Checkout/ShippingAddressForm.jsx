'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';

const deliveryLocations = [
  { id: 'home', label: 'Home', timing: '10am - 9pm' },
  { id: 'office', label: 'Office', timing: '9am - 6pm' },
];

const shippingOptions = [
  { id: 'standard', label: 'Standard Delivery', timing: '5-6 business days', cost: 99 },
  { id: 'express', label: 'Express Delivery', timing: '2-3 business days', cost: 199 },
];

const ShippingAddressForm = ({ onShippingMethodChange }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [phone, setPhone] = useState('');
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    defaultValues: {
      shippingMethod: 'standard',
      deliveryLocation: 'home',
      useAsDefault: false,
      useAsBilling: false
    }
  });

  const pincode = watch('pinCode');
  const shippingMethod = watch('shippingMethod');

  // Update shipping method in parent component
  useEffect(() => {
    onShippingMethodChange(shippingMethod);
  }, [shippingMethod, onShippingMethodChange]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAddressDetails = async (pincode) => {
    if (pincode?.length === 6) {
      setIsLoadingPincode(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
          const firstPostOffice = data[0].PostOffice[0];
          setValue('country', firstPostOffice.Country);
          setValue('state', firstPostOffice.State);
          setValue('city', firstPostOffice.Region);
          setValue('area', firstPostOffice.Block);
          
          document.getElementById('country').disabled = true;
          document.getElementById('state').disabled = true;
          document.getElementById('city').disabled = true;
        } else {
          setValue('country', '');
          setValue('state', '');
          setValue('city', '');
          setValue('area', '');
          
          document.getElementById('country').disabled = false;
          document.getElementById('state').disabled = false;
          document.getElementById('city').disabled = false;
        }
      } catch (error) {
        console.error('Error fetching address details:', error);
      } finally {
        setIsLoadingPincode(false);
      }
    }
  };

  // Add the onSubmit handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Update shipping method in parent component
      if (onShippingMethodChange) {
        onShippingMethodChange(data.shippingMethod);
      }

      // Here you would typically send the shipping data to your backend
      console.log('Shipping Form Data:', {
        ...data,
        phone
      });

      // Navigate to payment page after successful form submission
      router.push('/checkout/payment');

    } catch (error) {
      console.error('Error submitting shipping form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6 font-outfit">Shipping Address</h2>
      <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              First Name
            </label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
            Phone Number
          </label>
          <PhoneInput
            country={'in'}
            value={phone}
            onChange={phone => setPhone(phone)}
            inputProps={{
              required: true,
              className: 'w-full py-2 px-3 border border-gray-300 rounded-md'
            }}
          />
        </div>

        {/* Address Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 font-poppins">
            Flat No/Floor/House No
          </label>
          <input
            type="text"
            {...register('flatNo', { required: 'This field is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-poppins">
            Area/Locality
          </label>
          <input
            type="text"
            {...register('area', { required: 'Area is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-poppins">
            Street/Sector/Road
          </label>
          <input
            type="text"
            {...register('street', { required: 'Street address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-poppins">
            Landmark (Optional)
          </label>
          <input
            type="text"
            {...register('landmark')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
          />
        </div>

        {/* PIN Code and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              PIN Code
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('pinCode', {
                  required: 'PIN code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Please enter a valid 6-digit PIN code'
                  },
                  onChange: (e) => fetchAddressDetails(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
              />
              {isLoadingPincode && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-auralblue"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Delivery Location
            </label>
            <select
              {...register('deliveryLocation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue"
            >
              {deliveryLocations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.label} ({location.timing})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auto-populated fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register('city', { required: 'City is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              State
            </label>
            <input
              id="state"
              type="text"
              {...register('state', { required: 'State is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins">
              Country
            </label>
            <input
              id="country"
              type="text"
              defaultValue="India"
              {...register('country', { required: 'Country is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-auralblue focus:ring-auralblue bg-gray-50"
            />
          </div>
        </div>

        {/* Shipping Method */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 font-poppins">
            Shipping Speed
          </label>
          {shippingOptions.map(option => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                id={option.id}
                value={option.id}
                {...register('shippingMethod')}
                className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300"
              />
              <label htmlFor={option.id} className="ml-3">
                <span className="block text-sm font-medium text-gray-900 font-poppins">
                  {option.label} - ₹{option.cost}
                </span>
                <span className="block text-sm text-gray-500 font-poppins">
                  {option.timing}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useAsBilling"
              {...register('useAsBilling')}
              className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
            />
            <label htmlFor="useAsBilling" className="ml-2 block text-sm text-gray-900 font-poppins">
              Use this as billing address
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="useAsDefault"
              {...register('useAsDefault')}
              className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
            />
            <label htmlFor="useAsDefault" className="ml-2 block text-sm text-gray-900 font-poppins">
              Save as default address
            </label>
          </div>
        </div>

        {/* Add Proceed to Payment button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-auralblue text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ShippingAddressForm; 