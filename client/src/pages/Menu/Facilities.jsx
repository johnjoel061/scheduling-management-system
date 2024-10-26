import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Table,
  Popconfirm,
  message,
} from "antd";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box } from "@mui/material";
import useAddFacility from "../../hooks/FacilityHook/useAddFacility";
import useGetAllFacility from "../../hooks/FacilityHook/useGetAllFacility";
import axios from "axios";

const Facilities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading: addFacilityLoading, error, addFacility } = useAddFacility();
  const { facility, loading, refetchFacilities } = useGetAllFacility();

  // Form submit handler
  const handleFormSubmit = async (values) => {
    const facilityName = values.facilityName; // Extract facility name from values
    await addFacility(facilityName); // Use the addFacility hook
    if (!error) {
      setIsModalOpen(false); // Close modal on success
      refetchFacilities(); // Refetch facilities to update the table
    }
  };

  // Delete facility handler
  const handleDeleteFacility = async (facilityId) => {
    try {
      await axios.delete(`http://localhost:3000/api/location/facility/${facilityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Facility deleted successfully");
      refetchFacilities();
    } catch (err) {
      message.error("Failed to delete facility");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      key: "facilityName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this facility?"
          onConfirm={() => handleDeleteFacility(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography.Title level={4}>ADD FACILITY</Typography.Title>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          type="primary"
          style={{
            backgroundColor: "#0A5E4F",
            color: "#fff",
            margin: "0 20px",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <AddCircleOutlineOutlinedIcon />
          <span>NEW FACILITY</span>
        </Button>
      </Box>

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
        <Table
          columns={columns}
          dataSource={facility}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
        />
      </Box>

      {/* Modal for Adding New Facility */}
      <Modal
        title="Add New Facility"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleFormSubmit} // Handle form submission
        >
          <Form.Item
            label="Facility Name"
            style={{ fontWeight: "bold" }}
            name="facilityName"
            rules={[{ required: true, message: "Please enter the facility name" }]}
            className="custom-input"
          >
            <Input className="ant-input" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addFacilityLoading} 
              style={{
                width: "100%",
                fontWeight: "bold",
                background: "#0A5E4F",
              }}
            >
              Add Facility
            </Button>
          </Form.Item>
        </Form>

        {/* Show error message if exists */}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Modal>
    </Box>
  );
};

export default Facilities;
