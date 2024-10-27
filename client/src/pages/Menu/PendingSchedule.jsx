import { useState } from "react";
import { Button, Modal, Typography, Table, Popconfirm, message, Input } from "antd";
import { Box } from "@mui/material";
import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import useHandleSchedulingRequest from "../../hooks/SchedulingRequestHook/useHandleSchedulingRequest";

const PendingSchedule = () => {
  const { schedulingRequests, loading, refetchSchedulingRequests } = useFetchSchedulingRequest();
  const { handleSchedulingRequest, loading: handlingLoading, error: handlingError } = useHandleSchedulingRequest();

  const [isDisapproveModalVisible, setIsDisapproveModalVisible] = useState(false);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [disapprovedReason, setDisapprovedReason] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [searchText, setSearchText] = useState(""); 

  const pendingRequests = schedulingRequests.filter(request => request.status === "pending");

   // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter pending requests based on search text
  const filteredRequests = pendingRequests.filter(request =>
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
    { title: "Status", dataIndex: "status", key: "status", width: 500, ellipsis: true, render: (text) => (<span style={{ fontWeight: "bold", color: "#f2bd32" }}>{text}</span>) },
    {
      title: "Actions",
      key: "actions",
      width: 500,
      render: (text, record) => (
        <Box display="flex" gap={1} justifyContent="space-between">
          <Popconfirm
            title="Are you sure to approve this request schedule?"
            onConfirm={() => handleApprove(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "green" }}>Approve</Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure to disapprove this request schedule?"
            onConfirm={() => handleDisapproveClick(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "red" }}>Disapprove</Button>
          </Popconfirm>
        </Box>
      ),
    },
  ];

  const handleApprove = async (id) => {
    try {
      await handleSchedulingRequest(id, "approve"); // Call your approve function
      message.success(`Request Schedule has been approved`);
      // Optionally update the local state here
      refetchSchedulingRequests(); // Refetch data after approving
    } catch (error) {
      message.error("Failed to approve the request. Please try again.");
    }
  };

  const handleDisapproveClick = (id) => {
    setCurrentRequestId(id);
    setIsDisapproveModalVisible(true);
  };

  const handleDisapprove = async () => {
    if (!disapprovedReason) {
      message.error("Please provide a reason for disapproval");
      return;
    }

    try {
      await handleSchedulingRequest(currentRequestId, "disapprove", disapprovedReason);
      message.success(`Request Schedule has been disapproved`);
      setIsDisapproveModalVisible(false);
      setDisapprovedReason("");
      refetchSchedulingRequests(); // Refetch data after disapproving
    } catch (error) {
      message.error("Failed to disapprove the request. Please try again.");
    }
  };

  const handleDescriptionClick = (description) => {
    setCurrentDescription(description);
    setIsDescriptionModalVisible(true);
  };

  return (
    <Box m="20px">
      <Typography.Title level={4}>Pending Schedule Requests</Typography.Title>
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

      {/* Disapprove Reason Modal */}
      <Modal
        title="Disapprove Reason"
        visible={isDisapproveModalVisible}
        onOk={handleDisapprove}
        onCancel={() => setIsDisapproveModalVisible(false)}
        confirmLoading={handlingLoading}
      >
        <Typography.Text>
          Please provide a reason for disapproving this request:
        </Typography.Text>
        <textarea
          rows={4}
          value={disapprovedReason}
          onChange={(e) => setDisapprovedReason(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
        {handlingError && (
          <div style={{ color: "red", marginTop: "10px" }}>{handlingError}</div>
        )}
      </Modal>

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

export default PendingSchedule;
