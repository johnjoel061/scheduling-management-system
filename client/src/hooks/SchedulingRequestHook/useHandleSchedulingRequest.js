import { useState } from "react";
import axios from "axios";

const useHandleSchedulingRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSchedulingRequest = async (requestId, action, disapprovedReason) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put("http://localhost:3000/api/book/schedule-request/update", {
        requestId,
        action,
        disapprovedReason,
      });
      setSuccessMessage(response.data.message);
      return response.data.schedulingRequest; // Return the updated scheduling request if needed
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error handling request");
    } finally {
      setLoading(false);
    }
  };

  return { handleSchedulingRequest, loading, error, successMessage };
};

export default useHandleSchedulingRequest;
