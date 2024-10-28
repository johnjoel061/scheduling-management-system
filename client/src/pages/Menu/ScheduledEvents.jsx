import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Card } from "antd";
import { Box } from "@mui/material";
import moment from "moment";
import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import backgroundImage from "../../assets/background.webp";

const ScheduledEvents = () => {
  const [buttonHover, setButtonHover] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { schedulingRequests } = useFetchSchedulingRequest();

  // Filter approved requests only
  const approvedRequests = schedulingRequests.filter(
    (request) => request.status === "approved"
  );

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const wrapperStyles = {
    position: "relative",
    minHeight: "100vh",
    padding: "50px",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
  };

  const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  };

  const contentStyles = {
    position: "relative",
    zIndex: 2,
    color: "#ffffff",
    fontSize: "2rem",
    letterSpacing: "0.5px",
    lineHeight: "1.2",
    marginTop: "50px",
  };

  const containerStyles = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  const cardStyles = (isExpanded) => ({
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    transition: "max-height 0.3s ease",
    maxHeight: isExpanded ? "800px" : "300px", // Expanded and collapsed heights
    marginBottom: "20px",

  });

  const homeButton = {
    backgroundColor: buttonHover ? "#e0a800" : "#ffc107",
    color: "#1d1b1b",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block",
    marginTop: "20px",
    zIndex: 3,
    position: "relative",
  };

  return (
    <div style={wrapperStyles}>
      <div className="header" style={{ zIndex: 2 }}>
        <Link
          to="/home-page"
          style={homeButton}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Go to Homepage
        </Link>
      </div>
      <div style={overlayStyles}></div>
      <div style={contentStyles}>
        <Typography.Title level={3} style={{ color: "#ffffff", textAlign: "center" }}>
          SCHEDULED EVENTS
        </Typography.Title>
        <Box sx={containerStyles}>
          {approvedRequests.map((event) => {
            const isExpanded = expandedDescriptions[event._id];
            return (
              <Card key={event._id} style={cardStyles(isExpanded)}>
                <Typography.Title level={5}>{event.eventTitle}</Typography.Title>
                <Typography.Paragraph>
                  <strong>Description:</strong>{" "}
                  {isExpanded
                    ? event.eventDescription || "No description available."
                    : `${(event.eventDescription || "No description available.").substring(0, 100)}...`}{" "}
                  <span
                    onClick={() => toggleDescription(event._id)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    {isExpanded ? " Read Less" : " Read More"}
                  </span>
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <strong>Date:</strong>{" "}
                  {moment(event.start).format("MMMM D, YYYY")} -{" "}
                  {moment(event.end).format("MMMM D, YYYY")}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <strong>Time:</strong>{" "}
                  {moment(event.start).format("h:mm A")} -{" "}
                  {moment(event.end).format("h:mm A")}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <strong>Participants:</strong> {event.participant}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <strong>No. of Participants:</strong>{" "}
                  {event.numberOfParticipant}
                </Typography.Paragraph>
              </Card>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default ScheduledEvents;
