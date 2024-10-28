import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchSchedulingRequest = () => {
  const [schedulingRequests, setSchedulingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedulingRequests = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://debesmscat-scheduling-and-reservation.onrender.com/api/book/schedule-request/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSchedulingRequests(response.data.schedulingRequests);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedulingRequests();
  }, [fetchSchedulingRequests]);

  const refetchSchedulingRequests = async () => {
    await fetchSchedulingRequests();
  };

  return { schedulingRequests, loading, error, refetchSchedulingRequests };
};

export default useFetchSchedulingRequest;
