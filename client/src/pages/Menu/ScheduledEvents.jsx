import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Typography, Card } from "antd";
import { Box } from "@mui/material";
import moment from "moment";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFetchSchedulingRequest from "../../hooks/SchedulingRequestHook/useFetchSchedulingRequest";
import backgroundImage from "../../assets/background.webp";
import { motion } from "framer-motion"; // Import motion from framer-motion

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

  const iconStyle = { marginRight: "8px", color: "#555" };

  // Animation settings
  const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // Start slightly below and hidden
    visible: { opacity: 1, y: 0 }, // End in the original position
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
        <Typography.Title
          level={3}
          style={{ color: "#ffffff", textAlign: "center" }}
        >
          SCHEDULED EVENTS
        </Typography.Title>
        <Box sx={containerStyles}>
          {approvedRequests.map((event) => {
            const isExpanded = expandedDescriptions[event._id];
            return (
              <motion.div
                key={event._id}
                initial="hidden" // Initial state of the card
                whileInView="visible" // Trigger animation when in view
                variants={cardVariants} // Use the animation settings
                transition={{ duration: 0.5 }} // Animation duration
              >
                <Card style={cardStyles(isExpanded)}>
                  <Typography.Title
                    level={5}
                    style={{
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      color: "green",
                    }}
                  >
                    {event.eventTitle}
                  </Typography.Title>

                  <Typography.Paragraph>
                    <strong>Description:</strong>{" "}
                    {isExpanded
                      ? event.eventDescription || "No description available."
                      : `${(
                          event.eventDescription || "No description available."
                        ).substring(0, 100)}...`}{" "}
                    <span
                      onClick={() => toggleDescription(event._id)}
                      style={{ color: "blue", cursor: "pointer" }}
                    >
                      {isExpanded ? " Read Less" : " Read More"}
                    </span>
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <CalendarOutlined style={{ ...iconStyle, color: "#F2BD32" }} />
                    <strong>Date:</strong>{" "}
                    {moment(event.startDate).format("MMMM D, YYYY")} -{" "}
                    {moment(event.endDate).format("MMMM D, YYYY")}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <ClockCircleOutlined style={{ ...iconStyle, color: "#15B392" }} />
                    <strong>Time:</strong> {moment(`${event.startDate} ${event.startTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")}{" "}
                    - {moment(`${event.endDate} ${event.endTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <UserOutlined style={{ ...iconStyle, color: "#FF4818" }} />
                    <strong>Participants:</strong> {event.participant}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <TeamOutlined style={{ ...iconStyle, color: "#1A8AF6" }} />
                    <strong>No. of Participants:</strong>{" "}
                    {event.numberOfParticipant}
                  </Typography.Paragraph>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default ScheduledEvents;
