import { useState } from "react";
import { Button, Modal, Typography, Table, Popconfirm, Input } from "antd";
import { Box } from "@mui/material";
import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import useDeleteSchedulingRequest from "../../hooks/SchedulingRequestHook/useDeleteSchedulingRequest";

const DisapprovedSchedule = () => {
  const { schedulingRequests, loading, refetchSchedulingRequests } = useFetchSchedulingRequest();
  const { deleteSchedulingRequestById, loading: deletingLoading } = useDeleteSchedulingRequest();

  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [searchText, setSearchText] = useState(""); 

  const disapprovedRequests = schedulingRequests.filter(request => request.status === "disapproved");

   // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter pending requests based on search text
  const filteredRequests = disapprovedRequests.filter(request =>
    request.eventTitle.toLowerCase().includes(searchText.toLowerCase()) ||
    request.eventDescription.toLowerCase().includes(searchText.toLowerCase()) ||
    request.venue.toLowerCase().includes(searchText.toLowerCase()) ||
    request.participant.toLowerCase().includes(searchText.toLowerCase()) ||
    request.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    request.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    request.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const columns = [
    { title: "Event Title", dataIndex: "eventTitle", key: "eventTitle", width: 500, ellipsis: true },
    {
      title: "Event Description",
      dataIndex: "eventDescription",
      key: "eventDescription",
      width: 500,
      render: (text) => (
        <Button type="link" onClick={() => handleDescriptionClick(text)}>
          {text.length > 50 ? `${text.slice(0, 50)}...` : text}
        </Button>
      ),
    },
    { title: "Event Venue", dataIndex: "venue", key: "venue", width: 500, ellipsis: true },
    { title: "Participants", dataIndex: "participant", key: "participant", width: 500, ellipsis: true },
    { title: "Date Requested", dataIndex: "dateRequested", key: "dateRequested", width: 500, ellipsis: true },
    { title: "Start Date", dataIndex: "startDate", key: "startDate", width: 500, ellipsis: true },
    { title: "End Date", dataIndex: "endDate", key: "endDate", width: 500, ellipsis: true },
    { title: "Start Time", dataIndex: "startTime", key: "startTime", width: 500, ellipsis: true, render: (text) => formatTime(text) },
    { title: "End Time", dataIndex: "endTime", key: "endTime", width: 500, ellipsis: true, render: (text) => formatTime(text) },
    { title: "First Name", dataIndex: "firstName", key: "firstName", width: 500, ellipsis: true },
    { title: "Last Name", dataIndex: "lastName", key: "lastName", width: 500, ellipsis: true },
    { title: "Job/Work", dataIndex: "occupation", key: "occupation", width: 500, ellipsis: true },
    { title: "Email", dataIndex: "email", key: "email", width: 500, ellipsis: true },
    { title: "Status", dataIndex: "status", key: "status", width: 500, ellipsis: true, 
      render: (text) => (<span style={{ fontWeight: "bold", color: "#E24036" }}>{text}</span>) 
    },
    {
      title: "Actions",
      key: "actions",
      width: 500,
      render: (text, record) => (
        <Box display="flex" gap={1} justifyContent="space-between">
          <Popconfirm
            title="Are you sure to delete this request schedule?"
            onConfirm={() => handleDeleteClick(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "red" }}>Delete</Button>
          </Popconfirm>
        </Box>
      ),
    },
  ];

  const handleDescriptionClick = (description) => {
    setCurrentDescription(description);
    setIsDescriptionModalVisible(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteSchedulingRequestById(id);
      refetchSchedulingRequests(); // Refresh the request list after deletion
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  return (
    <Box m="20px">
      <Typography.Title level={4}>Disapproved Schedule Requests</Typography.Title>
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
        {/* Search Filter */}
        <Input.Search
          placeholder="Search by title, description, venue, or participant..."
          value={searchText}
          onChange={handleSearch}
          onSearch={(value) => console.log(value)} 
          style={{ marginBottom: 20, width: "24vw" }} 
        />

        {/* ADD SEARCH FILTER HERE */}
        <Table
          columns={columns}
          dataSource={filteredRequests}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          style={{ width: "100%" }}
          scroll={{ x: true }}
        />
      </Box>

      {/* Event Description Modal */}
      <Modal
        title="Event Description"
        visible={isDescriptionModalVisible}
        onOk={() => setIsDescriptionModalVisible(false)}
        onCancel={() => setIsDescriptionModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsDescriptionModalVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Typography.Text>{currentDescription}</Typography.Text>
      </Modal>
    </Box>
  );
};

export default DisapprovedSchedule;
