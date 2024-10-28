import { useState } from "react";
import { Button, Modal, Typography  } from "antd";
import { Box } from "@mui/material";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import useDeleteSchedulingRequest from "../../hooks/SchedulingRequestHook/useDeleteSchedulingRequest";

const localizer = momentLocalizer(moment); // Set up localizer

const ApprovedSchedule = () => {
  const { schedulingRequests, refetchSchedulingRequests } = useFetchSchedulingRequest();
  const { deleteSchedulingRequestById, loading: deletingLoading } = useDeleteSchedulingRequest();
  const approvedRequests = schedulingRequests.filter(request => request.status === "approved");

  // Transform approvedRequests into the format required by the calendar
  const events = approvedRequests.map(request => ({
    title: request.eventTitle,
    start: new Date(`${request.startDate}T${request.startTime}`),
    end: new Date(`${request.endDate}T${request.endTime}`),
    description: request.eventDescription,
    numberOfParticipants: request.numberOfParticipant,
    participants: request.participant,
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    id: request._id,
  }));

  // State to manage the visibility of the modal and selected event data
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); 

  // Function to handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  // Function to toggle the description
  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  // Function to handle delete request
  const handleDelete = async () => {
    if (selectedEvent) {
      await deleteSchedulingRequestById(selectedEvent.id);
      await refetchSchedulingRequests(); // Refetch requests after deletion
      handleModalClose(); // Close the modal after deletion
    }
  };

  return (
    <Box m="20px">
      <Typography.Title level={4}>Approved Schedule Requests</Typography.Title>
      <Box
        m="30px 0 0 0"
        width="72vw"
        sx={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
       {/* Render the calendar */}
       <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          tooltipAccessor={(event) =>
            `${event.description}\nParticipants: ${event.participants} (${event.numberOfParticipants})`
          }
          onSelectEvent={handleEventClick} // Handle event click
        />
      </Box>

      {/* Modal to display event details */}
      <Modal
        title="Event Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="delete" type="primary" danger loading={deletingLoading} onClick={handleDelete}>
            Delete
          </Button>,
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>
        ]}
      >
        {selectedEvent && (
          <Box>
            {/* Apply here the delete button to delete request */}
            <Typography.Title level={5}>{selectedEvent.title}</Typography.Title>
            <Typography.Paragraph>
              <strong>Description:</strong>{" "}
              {isDescriptionExpanded
                ? selectedEvent.description
                : `${selectedEvent.description.substring(0, 200)}...`} {/* Truncate the description */}
              <span
                onClick={toggleDescription}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {isDescriptionExpanded ? " Read Less" : " Read More"}
              </span>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Date:</strong> {moment(selectedEvent.start).format("MMMM D, YYYY")} - {moment(selectedEvent.end).format("MMMM D, YYYY")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Time:</strong> {moment(selectedEvent.start).format("h:mm A")} - {moment(selectedEvent.end).format("h:mm A")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Participants:</strong> {selectedEvent.participants}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>No. of Participants:</strong> ({selectedEvent.numberOfParticipants})
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Name of Requestor:</strong> {selectedEvent.firstName} {selectedEvent.lastName}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Email:</strong> {selectedEvent.email} 
            </Typography.Paragraph>
          </Box>  
        )}
      </Modal>
    </Box>
  );
};

export default ApprovedSchedule;
