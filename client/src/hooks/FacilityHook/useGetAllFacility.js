import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchFacility = () => {
  const [facility, setFacility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFacilities = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/location/facility/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFacility(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const refetchFacilities = async () => {
    await fetchFacilities();
  };

  return { facility, loading, error, refetchFacilities };
};

export default useFetchFacility;
