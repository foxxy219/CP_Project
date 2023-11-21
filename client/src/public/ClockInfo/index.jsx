import React, { useEffect, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { DataGrid, GridColumns, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserFromToken, fetchUserData, getAttendance } from '../../utils/index';
import { tokens } from '../../theme';

// import { mockDataContacts } from '../ClockInfo/MockData.ts';
import Header from '../components/Header';

const ClockInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ReturnUser, setReturnUser] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { field: 'Full Name', headerName: 'Full Name', flex: 1 },
    { field: 'Clock In Time', headerName: 'Clock In Time', flex: 1 },
    { field: 'Clock Out Time', headerName: 'Clock Out Time', flex: 1 },
    { field: 'Clock In Date', headerName: 'Clock In Date', flex: 1 },
    { field: 'Clock Out Date', headerName: 'Clock Out Date', flex: 1 },
    { field: 'Working Hours', headerName: 'Working Hours', flex: 0.5 },
    { field: 'Status', headerName: 'Status', flex: 0.5 },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUserFromToken();
        if (user.userId) {
          fetchUserData(user.userId)
            .then(async (userData) => {
              const attendanceDataResponse = await getAttendance(userData.objectId.user_id);
              const attendance = attendanceDataResponse.attendanceData;
              console.log(attendance);
              setReturnUser(userData);
              if (Array.isArray(attendance)) {
                // Accumulate attendance records in an array
                const enrichedAttendanceData = attendance.map((attendanceRecord, index) => ({
                  ...attendanceRecord,
                  id: `${attendanceRecord["User ID"]}_${attendanceRecord["Clock In Time"]}_${attendanceRecord["Clock In Date"]}_${index}`, // Add an id field
                  'Full Name': userData.objectId.full_name,
                }));
                console.log(enrichedAttendanceData);
                setAttendanceData(enrichedAttendanceData || []); // Set the state with the merged data
              } else {
                console.error('Attendance data is not an array:', attendance);
              }
    
              setLoading(false);
            })
            .catch((error) => {
              console.error('Failed to fetch user data:', error);
              setLoading(false);
            });
        } else {
          // Handle the case where user.userId is not available
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m='20px'>
      <Header title='CONTACTS' subtitle='List of COntact fo future refrences' />
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
        <DataGrid getRowId={(row) => row.id} rows={attendanceData} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default ClockInfo;
