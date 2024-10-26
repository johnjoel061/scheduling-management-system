import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

// For Log Out
import { useAuth } from "../../contexts/AuthContext";

const Topbar = () => {
  
  // For Log out
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const topbarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={"#fff"} borderRadius="3px">
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        <Link to="/login" style={{marginLeft: "20px"}}>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            LOG OUT
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Topbar;
