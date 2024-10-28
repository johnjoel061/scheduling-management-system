import React from "react";
import { Card, Typography } from "antd";
import { Box } from "@mui/material";
import {
  UserOutlined,
  ShopOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons"; // Import icons

import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import useFetchUsers from "../../hooks/UserHook/useFetchUsers";
import useGetAllFacility from "../../hooks/FacilityHook/useGetAllFacility";

const DashboardAdmin = () => {
  const { schedulingRequests } = useFetchSchedulingRequest();
  const { users } = useFetchUsers();
  const { facility } = useGetAllFacility();

  const pendingRequests = schedulingRequests.filter(
    (request) => request.status === "pending"
  );
  const approvedRequests = schedulingRequests.filter(
    (request) => request.status === "approved"
  );
  const disapprovedRequests = schedulingRequests.filter(
    (request) => request.status === "disapproved"
  );
  const totalRequests = schedulingRequests.length; // Total requests

  // Card data
  const cardData = [
    { title: "Total Admin Users", count: users.length, icon: <UserOutlined style={{ color: "#D6159B" }}/> },
    {
      title: "Total Facilities",
      count: facility.length,
      icon: <ShopOutlined style={{ color: "#B44EF2" }}/>,
    },
    {
      title: "Total Requests",
      count: totalRequests,
      icon: <DashboardOutlined style={{ color: "#1A8AF6" }}/>,
    }, // Total Requests
    {
      title: "Total Pending Requests",
      count: pendingRequests.length,
      icon: <ScheduleOutlined style={{ color: "#F2BD32" }}/>,
    },
    {
      title: "Total Approved Requests",
      count: approvedRequests.length,
      icon: <CheckCircleOutlined style={{ color: "#15B392" }}/>,
    },
    {
      title: "Total Disapproved Requests",
      count: disapprovedRequests.length,
      icon: <CloseCircleOutlined style={{ color: "#FF4818" }}/>,
    },
  ];

  return (
    <Box m="20px">
      <Typography.Title level={4}>Admin Dashboard</Typography.Title>
      <Box
        m="30px 0 0 0"
        width="72vw"
        sx={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
          gap: "20px", // Space between cards
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            style={{
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", 
              borderRadius: "8px", 
            }}
          >
            <Typography.Title level={5}>
              {card.icon} {card.title}
            </Typography.Title>
            <Typography.Text style={{ fontSize: "24px", fontWeight: "bold" }}>
              {card.count}
            </Typography.Text>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardAdmin;
