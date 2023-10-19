import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { API_ROUTES } from '../../public/constants/index';
import axios from 'axios';
import { getCurrentUserFromToken, fetchUserData } from '../../utils/index';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };



  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUserFromToken();
      if (user.userId) {
        fetchUserData(user.userId)
          .then(userData => {
            setReturnUser(userData);
          })
          .catch(error => {
            console.error('Failed to fetch user data:', error);
          });
      } else {
        navigate('/login');
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await axios.post(
        API_ROUTES.user.logout, JSON.stringify(
          { "userId": returnUser.objectId.user_id }),
        {
          headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
          }
        }
      );
      localStorage.removeItem('token');
      navigate('/login');
    }
    catch (error) {
      console.error(error);
    }
  };

  const [returnUser, setReturnUser] = useState(null);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        {/* Include your search bar content here */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleOpenDropdown}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseDropdown}>
        {/* <MenuItem onClick={handleCloseDropdown}>Your Profile</MenuItem>
        <MenuItem onClick={handleCloseDropdown}>Settings</MenuItem> */}
        <MenuItem onClick={() => {
          handleCloseDropdown();
          handleSignOut();
        }}>Sign out</MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;
