import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddSchedulingRequest = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSchedulingRequest = async (values) => {
    setLoading(true);
    setError(null); // Reset error before making the request

    try {
      // Send POST request
      const response = await axios.post('http://localhost:3000/api/book/schedule-request/add', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check for successful response
      if (response.status === 201) {
        message.success(response.data.message || 'Booking schedule successful');
        return response.data; // Return the successful response data
      } else {
        // Handle other response statuses
        setError(response.data.message || 'Submitting request failed. Please try again.');
        message.error('Submitting request failed. Please try again.');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400 && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(`Scheduling error: ${error.message}`);
    } finally {
      setLoading(false);
    }
    
    return null; // Ensure a return value in case of failure
  };

  return { loading, error, addSchedulingRequest };
};

export default useAddSchedulingRequest;
