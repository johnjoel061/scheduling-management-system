import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Input, Typography, Select } from "antd";
import Logo from "../../assets/logo.jpg";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import useAddSchedulingRequest from "../../hooks/SchedulingRequestHook/useAddSchedulingRequest";
import useGetAllFacility from "../../hooks/FacilityHook/useGetAllFacility";
import { motion } from "framer-motion";

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    loading: requestLoading,
    error,
    addSchedulingRequest,
  } = useAddSchedulingRequest();

  const {
    facility,
    loading: facilityLoading,
    error: facilityError,
    refetchFacilities,
  } = useGetAllFacility();

  const handleFormSubmit = async (values) => {
    try {
      const response = await addSchedulingRequest(values);
      console.log("Response from scheduling request:", response); // Log response for debugging

      // Assuming a successful response is truthy
      if (response) {
        setIsModalOpen(false); // Close the modal
      }
    } catch (error) {
      console.error("Error submitting scheduling request:", error); // Log error for debugging
    }
  };

  return (
    <div className="homepage-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <div className="header">
        <Link to="/login" className="login-button">
          Admin Login
        </Link>
      </div>
      <div className="content">
        <div className="title-container">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            DEBESMSCAT
          </motion.h1>
          <motion.h3
            className="subtitle"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Scheduling and Reservation
          </motion.h3>
          <motion.div
            className="description"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p>
              Discover the convenience of hassle-free scheduling with our
              system! Whether you're planning a group event, our platform makes
              it simple to book, manage, and confirm your schedules in just a
              few clicks.
            </p>
          </motion.div>

          <button
            className="schedule-button"
            onClick={() => setIsModalOpen(true)}
          >
            <BookmarkAddOutlinedIcon /> BOOK SCHEDULE
          </button>
          <Link to="/scheduled-events" className="event-button">
            <EventAvailableOutlinedIcon /> SCHEDULED EVENTS
          </Link>
        </div>
      </div>

      {/* Modal for Adding New Scheduling Request */}
      <Modal
        title="Book Schedule"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Event Title"
            name="eventTitle"
            rules={[
              { required: true, message: "Please enter the event title" },
            ]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="Event Description"
            name="eventDescription"
            rules={[
              { required: true, message: "Please enter the event description" },
            ]}
          >
            <Input.TextArea
              rows={4} // You can adjust the number of rows to make it taller
              placeholder="Enter event description here..." // Optional placeholder
            />
          </Form.Item>

          {/* Populate facilities in Event Venue selection */}
          <Form.Item
            label="Event Venue"
            name="venue"
            rules={[{ required: true, message: "Please select a venue" }]}
          >
            <select
              onClick={refetchFacilities}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
              }}
            >
              <option value="" disabled selected>
                Select venue
              </option>
              {facility.map((fac) => (
                <option key={fac._id} value={fac.facilityName}>
                  {fac.facilityName}
                </option>
              ))}
            </select>
          </Form.Item>

          <Form.Item
            label="Participant/s"
            name="participant"
            rules={[{ required: true, message: "Please enter participants" }]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="No. of Participants"
            name="numberOfParticipant"
            rules={[
              {
                required: true,
                message: "Please enter the number of participants",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please enter start date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please enter end date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Please enter start time" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Please enter end time" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="Job/Work"
            name="occupation"
            rules={[{ required: true, message: "Please enter your job/work" }]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={requestLoading}
              style={{
                width: "100%",
                background: "#0A5E4F",
              }}
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>

        {/* Show error message */}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
        {facilityError && (
          <Typography.Text type="danger">{facilityError}</Typography.Text>
        )}
      </Modal>
    </div>
  );
};

export default Homepage;
