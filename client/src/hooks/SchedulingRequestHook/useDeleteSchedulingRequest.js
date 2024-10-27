import { useState, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Import message from Ant Design
import useFetchSchedulingRequest from './useFetchSchedulingRequest'; // Import the fetch hook to refetch after deletion

const useDeleteSchedulingRequest = () => {
  const { refetchSchedulingRequests } = useFetchSchedulingRequest(); // Get the refetch function from the fetch hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteSchedulingRequestById = useCallback(async (id) => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset any previous error
    try {
      await axios.delete(`http://localhost:3000/api/book/schedule-request/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refetch scheduling requests to update the list
      await refetchSchedulingRequests();
      message.success("Schedule request deleted successfully!"); // Success message
    } catch (err) {
      setError(err); // Set error state if there was an error
      message.error("Failed to delete the schedule request. Please try again."); // Error message
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [refetchSchedulingRequests]);

  return { deleteSchedulingRequestById, loading, error };
};

export default useDeleteSchedulingRequest;
