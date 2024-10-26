import React from "react";
import { Alert, Button, Card, Form, Input, Spin, Typography } from "antd";

const ScheduledEvents = () => {
  const wrapperStyles = {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "50px",
    background: "#0A5E4F",
  };

  const titleStyles = {
    textAlign: "center",
  };

  return (
    <div style={wrapperStyles}>
      <Typography.Title level={3} strong style={titleStyles}>
        SCHEDULED EVENTS
      </Typography.Title>
    </div>
  );
};

export default ScheduledEvents;
