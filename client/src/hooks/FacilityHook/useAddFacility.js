import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddFacility = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addFacility = async (facilityName) => {
    if (!facilityName) {
      return setError('Facility name is required');
    }

    setLoading(true);
    try {
      // Send POST request to add a new facility
      const response = await axios.post(
        'http://localhost:3000/api/location/facility/add',
        { facilityName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        message.success(response.data.message || 'Facility added successfully');
        setError(null); // Reset error on success
      } else if (response.status === 400) {
        setError(response.data.message || 'Facility already exists');
      } else {
        message.error('Failed to add facility. Please try again.');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400 && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(`Add facility error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addFacility };
};

export default useAddFacility;
