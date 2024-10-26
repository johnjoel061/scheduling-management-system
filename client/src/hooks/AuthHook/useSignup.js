import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (values) => {
    if (values.password !== values.passwordConfirm) {
      return setError('Passwords are not the same');
    }

    setLoading(true);
    try {
      // Send POST request to register the user
      const response = await axios.post('http://localhost:3000/api/auth/signup', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success(response.data.message || 'Registration successful');
        setError(null); // Reset error on success
      } else if (response.status === 400) {
        setError(response.data.message || 'Invalid data provided');
      } else {
        message.error('Registration failed. Please try again.');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400 && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(`Signup error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser };
};

export default useSignup;
