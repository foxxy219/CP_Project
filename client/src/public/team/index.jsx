import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { Typography, Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityIcon from '@mui/icons-material/SecurityOutlined';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import Header from '../components/Header';
import { getCurrentUserFromToken, fetchUserData, getAllUsers } from '../../utils/index'; // Import your utility functions

export const Team = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [ReturnUser, setReturnUser] = useState({}); 
    const [loading, setLoading] = useState(true);
    const columns = [
        { field: '_id', headerName: 'ID', hide: true }, // Hide the ID field
        { field: 'username', headerName: 'Username', flex: 0.5, cellClassName: 'name-column--cell' },
        { field: 'full_name', headerName: 'Full Name', flex: 0.5, cellClassName: 'name-column--cell' },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 0.5 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: ({ row: { role } }) => (
                <Box
                    width='60%'
                    m='0 auto'
                    p='5px'
                    display='flex'
                    justifyContent='center'
                    bgcolor={role === 'admin' ? colors.greenAccent[500] : role === 'manager' ? colors.greenAccent[700] : colors.greenAccent[800]}
                    borderRadius='4px'
                >
                    {role === 'admin' && <AdminPanelSettingsIcon />}
                    {role === 'manager' && <SecurityIcon />}
                    {role === 'user' && <LockOpenIcon />}
                    <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                        {role}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'isOnline',
            headerName: 'Online',
            flex: 1,
            renderCell: ({ row: { isOnline } }) => (
                <Box
                    width='60%'
                    m='0 auto'
                    p='5px'
                    display='flex'
                    justifyContent='center'
                    bgcolor={isOnline ? colors.greenAccent[500] : colors.redAccent[500]}
                    borderRadius='4px'
                >
                    <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
            )
        },
        // Add more fields as needed
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUserFromToken();
    
                if (!user.userId) {
                    navigate('/login');
                    return;
                }
    
                const userData = await fetchUserData(user.userId);
                console.log('User Data:', userData);
                if (!userData) {
                    // Handle the case where user data couldn't be fetched
                    console.error('Failed to fetch user data');
                    setLoading(false);
                    return;
                }
    
                const allUser = await getAllUsers(userData.objectId.user_id);
                console.log('All User:', allUser);
    
                const users = allUser.users;
    
                if (Array.isArray(users)) {
                    // Get all users from return json
                    const enrichedUserData = users.map((userRecord, index) => ({
                        ...userRecord,
                        id: `${userRecord["User ID"]}_${userRecord["Full Name"]}_${index}`, // Add an id field
                    }));
                    setReturnUser(enrichedUserData);
                } else {
                    console.error('Attendance data is not an array:', users);
                }
    
                setLoading(false);
            } catch (error) {
                // Handle token expiration or other errors
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    return (
        <Box m='20px'>
            <Header title='TEAM' subtitle='Managing the Team Members' />
            <Box
                m='40px 0 0 0'
                height='75vh'
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none'
                    },
                    '& .MuiDataGrid-root .MuiDataGrid-cell': {
                        borderBottom: 'none'
                    },
                    '& .name-column--cell': {
                        color: colors.greenAccent[300]
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400]
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: colors.blueAccent[700],
                        borderTop: 'none'
                    }
                }}
            >
                <DataGrid getRowId={(row) => row.id} rows={ReturnUser} columns={columns} />
            </Box>
        </Box>
    );
};

export default Team;