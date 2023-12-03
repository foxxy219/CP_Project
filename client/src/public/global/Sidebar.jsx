import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-pro-sidebar/dist/css/styles.css';
import { getCurrentUserFromToken, fetchUserData } from '../../utils/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LockClockIcon from '@mui/icons-material/LockClock';
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarLeft = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const [returnUser, setReturnUser] = useState({}); // Provide a default value

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        console.log('Fetching user from token...');
        const user = await getCurrentUserFromToken();
        // Check if the token is expired (based on exp claim)
        const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
        if (user.exp && user.exp < currentTimestamp) {
          // Token is expired, redirect to login
          console.log('Token is expired, redirecting to login...');
          toast.error('Your session has expired. Please log in again.');
          alert('Token is expired, please log in again.');
          navigate('/login');
          return;
        }
        const userData = await fetchUserData(user.userId);

        if (!userData) {
          // Handle the case where user data couldn't be fetched
          console.error('Failed to fetch user data');
          return;
        }
        setReturnUser(userData);
      } catch (error) {
        // Handle token expiration or other errors
        console.error('Failed to authenticate:', error);
        toast.error('An error occurred. Please log in again.');
        navigate('/login');
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const isAdmin = returnUser.objectId?.role === 'admin';
  const isManager = returnUser.objectId?.role === 'manager';
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`, // Set your dark background color
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && returnUser && ( // Check if returnUser exists
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={returnUser.objectId?.profile_picture ? returnUser.objectId?.profile_picture : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png'}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {returnUser.objectId?.full_name ? returnUser.objectId?.full_name : 'Loading...'}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {returnUser.objectId?.role === 'admin' ? 'Administrator' : returnUser.objectId?.role === 'user' ? 'User' : 'Manager'}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/home"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            {isAdmin && (
              <>
                <Item
                  title="Manage Users"
                  to="/home/team"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="All User Info"
                  to="/home/all-users-info"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            <Item
              title="Clock Infomation"
              to="/home/clock-info"
              icon={<LockClockIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {isAdmin && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Pages
                </Typography>
                <Item
                  title="Create New User"
                  to="/home/form"
                  icon={<PersonAddAltIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}


            {/* <Item
              title="Calendar"
              to="/calendar"
              icon={<PersonAddAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
      {returnUser && (
        <ToastContainer />
      )}
    </Box>
  );
};

export default SidebarLeft;
