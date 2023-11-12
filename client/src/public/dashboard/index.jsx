import { React, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { getCurrentUserFromToken, fetchUserData, fetchUserHardwareCredentail } from '../../utils/index';
import Header from '../components/Header';
import StatBox from '../components/StatBox';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';


const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [ReturnUserHardwareCredential, setReturnUserHardwareCredential] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUserFromToken();
            if (user.userId) {
                fetchUserData(user.userId)
                    .then(userData => {
                        fetchUserHardwareCredentail(userData.objectId.user_id).then((data) => {
                            setReturnUserHardwareCredential(data);
                        })
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
    const onDownloadClickHandler = () => {
        // eslint-disable-next-line
        alert('Feature in progress! Hold on...');
    };

    return (
        <Box m='20px'>
            {/* HEADER */}
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Header title='DASHBOARD' subtitle='Welcome to your dashboard' />
            </Box>

            {/* GRID & CHARTS */}
            <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' gridAutoRows='140px' gap='20px'>
                {/* ROW 1 */}
                <Box
                    gridColumn='span 8'
                    gridRow='span 1'
                    bgcolor={colors.primary[400]}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'

                >
                    <StatBox
                        subtitle={"Your code will be reset in 60 seconds, refresh to get a new code if the current one expires."}
                        title={
                            <Typography variant="h4">
                                Your current access 6-digits code is:
                                <span style={{ color: colors.greenAccent[400] }}>
                                    {" " + ReturnUserHardwareCredential.pin_code}
                                </span>
                            </Typography>
                        }
                        icon={<FiberPinIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />

                </Box>
                {/* <Box
                    gridColumn='span 3'
                    bgcolor={colors.primary[400]}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                >
                    <StatBox
                        title='431,225'
                        subtitle='Sales Obtained'
                        progress={0.5}
                        increase='+21%'
                        icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />
                </Box> */}
            </Box>
        </Box>
    );
};

export default Dashboard;