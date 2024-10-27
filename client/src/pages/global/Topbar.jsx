import { Box, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link } from "react-router-dom";
// For Log Out
import { useAuth } from "../../contexts/AuthContext";

const Topbar = () => {
  // For Log out
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" backgroundColor={"#fff"} borderRadius="3px"/>
    
    
      <Box display="flex" justifyContent="flex-end" alignItems="center" mr={3}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon />}
            sx={{
              padding: "8px 20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              textTransform: "uppercase",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Log Out
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Topbar;
