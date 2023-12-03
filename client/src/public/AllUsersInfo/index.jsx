import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserFromToken, fetchUserData, getAllUserHardwareCredential, getAllUsers } from '../../utils/index';
import { tokens } from '../../theme';
import Header from '../components/Header';



const AllUserInfo = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ReturnUser, setReturnUser] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const columns = [
        { field: 'user_id', headerName: 'User ID', flex: 1.5 },
        { field: 'full_name', headerName: 'Full Name', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 0.5 },
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'rfid_data', headerName: 'RFID Data', flex: 1 },
        { field: 'contact_phone', headerName: 'Phone Number', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => handleUpdate(params.row)}>
                    Update
                </button>
            ),
        },
        // Add more fields as needed
    ];
    const handleUpdate = (user) => {
        // Implement your logic to handle the update, e.g., open a modal or navigate to an update page
        console.log('Updating user:', user);
        // Example: Navigate to the update page with the user ID
        navigate(`../home/update-user/${user.user_id}`);
    };

    // Declare mergedData in the component's scope
    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUserFromToken();

                if (!user.userId) {
                    // Redirect to login if no user ID is found
                    navigate('/login');
                    return;
                }

                const userData = await fetchUserData(user.userId);

                if (!userData) {
                    // Handle the case where user data couldn't be fetched
                    console.error('Failed to fetch user data');
                    setLoading(false);
                    return;
                }
                console.log('User Data:', userData);
                const hardwareCredentialResponse = await getAllUserHardwareCredential(userData.objectId.user_id);
                const hardwareCredentials = hardwareCredentialResponse.userHardwareCredential;
                console.log('Hardware Credentials:', hardwareCredentials);

                const allUsersResponse = await getAllUsers(userData.objectId.user_id);
                const allUsers = allUsersResponse.users;
                console.log('All Users:', allUsers);

                // Merge the data based on user_id
                const mergedData = allUsers.map(user => {
                    const hardwareCredential = hardwareCredentials.find(credential => credential.user_id === user.user_id);
                    return {
                        ...user,
                        rfid_data: hardwareCredential ? hardwareCredential.rfid_data : null,
                        id: `${user.user_id}_${user.username}`, // Add an id field
                    };
                });
                console.log('Merged Data:', mergedData);
                if (Array.isArray(mergedData)) {
                    // Set the state with the merged data
                    setMergedData(mergedData);
                } else {
                    console.error('Merged data is not an array:', mergedData);
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
            <Header title='Clock Information' subtitle='List of clock in/clock out information' />
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
                    },
                    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                        color: `${colors.grey[100]} !important`
                    }
                }}
            >
                <DataGrid getRowId={(row) => row.id} rows={mergedData} columns={columns} components={{ Toolbar: GridToolbar }} />
            </Box>
        </Box>
    );
};

export default AllUserInfo;
