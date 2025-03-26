import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5006/api/v1';

const useAppointment = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all time slots from the API
  const fetchTimeSlots = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/time-slots`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch time slots: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTimeSlots(data.data.timeSlots);
        return data.data.timeSlots;
      } else {
        throw new Error(data.message || 'Failed to fetch time slots');
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a single time slot by ID
  const getTimeSlotById = async (slotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/time-slots/${slotId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch time slot: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.timeSlot;
      } else {
        throw new Error(data.message || 'Failed to fetch time slot');
      }
    } catch (err) {
      console.error('Error fetching time slot by ID:', err);
      throw err;
    }
  };

  // Fetch availability for a specific date
  const getAvailabilityForDate = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/time-slots/availability/${date}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch availability: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.availability;
      } else {
        throw new Error(data.message || 'Failed to fetch availability');
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Format time for display (e.g., "09:00:00" to "9:00 AM")
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${displayHour}:${minutes} ${period}`;
  };

  // Book an appointment
  const bookAppointment = async (appointmentData) => {
    setLoading(true);
    
    try {
      // Restructure the data to match the API's expected format
      const { 
        first_name, last_name, phone_number, email, date_of_birth, gender, address,
        appointment_date, sub_slot_id, notes
      } = appointmentData;
      
      const payload = {
        patientData: {
          first_name,
          last_name,
          phone_number,
          email,
          date_of_birth,
          gender,
          address: address || ''
        },
        appointmentData: {
          appointment_date,
          sub_slot_id,
          notes: notes || '',
          source: 'online'
        }
      };
      
      console.log('Booking appointment with payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to book appointment: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Generate available time slots for a given date and slot
  const getAvailableTimeSlots = async (date, slotId) => {
    try {
      // In a real implementation, you would check availability for each time slot
      // For now, we'll return a simple array of times based on the slot
      const slot = await getTimeSlotById(slotId);
      
      if (!slot) {
        throw new Error('Time slot not found');
      }
      
      const startTime = new Date(`2000-01-01T${slot.start_time}`);
      const endTime = new Date(`2000-01-01T${slot.end_time}`);
      
      // Generate time slots every 30 minutes
      const timeSlots = [];
      let currentTime = new Date(startTime);
      
      while (currentTime < endTime) {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedTime = formatTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
        
        timeSlots.push(formattedTime);
        
        // Add 30 minutes
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
      
      return timeSlots;
    } catch (err) {
      console.error('Error generating available time slots:', err);
      throw err;
    }
  };

  // Load time slots on hook initialization
  useEffect(() => {
    fetchTimeSlots().catch(err => {
      console.error('Failed to fetch time slots during initialization:', err);
    });
  }, []);

  return {
    timeSlots,
    loading,
    error,
    fetchTimeSlots,
    getTimeSlotById,
    getAvailabilityForDate,
    bookAppointment,
    formatTime,
    getAvailableTimeSlots,
  };
};

export default useAppointment; 