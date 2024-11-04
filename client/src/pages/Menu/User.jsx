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
import useSignup from "../../hooks/AuthHook/useSignup";
import useFetchUsers from "../../hooks/UserHook/useFetchUsers";
import axios from "axios";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading: registerLoading, error, registerUser } = useSignup();
  const { users, loading, refetchUsers } = useFetchUsers();

  // Form submit handler
  const handleFormSubmit = async (values) => {
    const response = await registerUser(values);
    if (!error) {
      setIsModalOpen(false);
      refetchUsers();
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://debesmscat-scheduling-and-reservation.onrender.com/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("User deleted successfully");
      refetchUsers();
    } catch (err) {
      message.error("Failed to delete user");
    }
  };

  // Table columns
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      key: "middleName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
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
      <Typography.Title level={4}>ADD ADMINISTRATOR</Typography.Title>
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
          <span>NEW ADMIN</span>
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
          dataSource={users}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
        />
      </Box>

      {/* Modal for Adding New Admin */}
      <Modal
        title="Add New Administrator"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ role: "ADMIN" }}
        >
          <Form.Item
            label="First Name"
            style={{ fontWeight: "bold" }}
            name="firstName"
            rules={[{ required: true, message: "Please enter the first name" }]}
            className="custom-input"
          >
            <Input className="ant-input" />
          </Form.Item>

          <Form.Item
            label="Middle Name"
            style={{ fontWeight: "bold" }}
            name="middleName"
            rules={[
              { required: true, message: "Please enter the middle name" },
            ]}
            className="custom-input"
          >
            <Input className="ant-input" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            style={{ fontWeight: "bold" }}
            name="lastName"
            rules={[{ required: true, message: "Please enter the last name" }]}
            className="custom-input"
          >
            <Input className="ant-input" />
          </Form.Item>

          <Form.Item
            label="Email"
            style={{ fontWeight: "bold" }}
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter a valid email",
                type: "email",
              },
            ]}
            className="custom-input"
          >
            <Input className="ant-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            style={{ fontWeight: "bold" }}
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
            className="custom-input"
          >
            <Input.Password className="ant-input" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            style={{ fontWeight: "bold" }}
            name="passwordConfirm"
            rules={[{ required: true, message: "Please confirm the password" }]}
            className="custom-input"
          >
            <Input.Password className="ant-input" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerLoading}
              style={{
                width: "100%",
                fontWeight: "bold",
                background: "#0A5E4F",
              }}
            >
              Register Admin
            </Button>
          </Form.Item>
        </Form>

        {/* Show error message */}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Modal>
    </Box>
  );
};

export default User;
