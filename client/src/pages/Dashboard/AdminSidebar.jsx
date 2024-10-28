import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import Logo from "../../assets/logo.jpg";

const Item = ({ title, to, icon, selected, setSelected }) => (
  <MenuItem
    active={selected === title}
    style={{
      transition: "color 0.2s ease-in-out",
      padding: "10px 20px",
    }}
    onClick={() => setSelected(title)}
  >
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        color: "inherit",
        width: "100%",
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          color: selected === title ? "#0a5e4f" : "#333", // Change icon color based on selection
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontFamily: "Montserrat",
          fontSize: "24px",
          fontWeight: "bold",
          cursor: "pointer",
          color: selected === title ? "#0a5e4f" : "#333", // Change title color based on selection
          "&:hover": {
            color: "#0a5e4f", // Change color on hover
          },
        }}
      >
        {title}
      </Typography>
    </Link>
  </MenuItem>
);

const AdminSidebar = () => {
  const { userData } = useAuth();
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      className="admin-sidebar"
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        fontFamily: "Montserrat",
        bgcolor: "#F0F0F0",
        boxShadow: 1,
        "& .pro-sidebar-inner": {
          background: "#FFF !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar breakPoint="md">
        <Menu iconShape="square">
          <Box mb="10px" paddingTop="30px" textAlign="center">
            <Avatar sx={{ width: 80, height: 80, mx: "auto" }} />
            <Typography
              variant="h6"
              color="textPrimary"
              fontWeight="bold"
              sx={{ mt: 1, fontFamily: "Montserrat" }}
            >
              {userData.lastName}, {userData.firstName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontFamily: "Montserrat",
                color: "#E24036",
                fontWeight: "bold",
              }}
            >
              {userData.role}
            </Typography>
          </Box>

          <Divider />

          <Box paddingLeft={"1%"}>
            <Item
              title="Dashboard"
              to="/admin-dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="User"
              to="/user"
              icon={<PersonAddAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Facilities"
              to="/facilities"
              icon={<DomainAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pending Schedule"
              to="pending-schedule"
              icon={<DateRangeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Approved Schedule"
              to="/approved-schedule"
              icon={<EventAvailableIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Disapproved Schedule"
              to="disapproved-schedule"
              icon={<EventBusyIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Box textAlign="center" mt={6} paddingBottom={2}>
              <img
                alt="Logo"
                width="120px"
                height="120px"
                src={Logo}
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  margin: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
