import React, { useEffect, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { DataGrid, GridColumns, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserFromToken, fetchUserData } from '../../utils/index';
import { tokens } from '../../theme';
import { mockDataContacts } from '../ClockInfo/MockData.ts';
import Header from '../components/Header';

const ClockInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ReturnUser, setReturnUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'registrarId', headerName: 'RegistrarId' },
    { field: 'name', headerName: 'Name', flex: 1, cellClassName: 'name-column--cell' },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      headerAlign: 'left',
      align: 'left'
    },
    { field: 'phone', headerName: 'Phone Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'zipCode', headerName: 'ZipCode', flex: 1 }
  ];
  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUserFromToken();
      console.log("done");
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
  // const userId = ReturnUser.objectId.user_id;
  console.log(ReturnUser);

  // useEffect(() => {
  //   const fetchCSVData = async () => {
  //     // Replace 'userID' with the actual user ID you want to search for
  //     const userID = ReturnUser.objectId.user_id; 

  //     // Fetch and parse the CSV data
  //     try {
  //       const response = await fetch(`C:\Users\quanb\OneDrive\Desktop\CP_Project\server\attendance_f1166b2c-a802-4697-892d-adaefe2065ac_1970_01.csv`);
  //       const csv = await response.text();

  //       Papa.parse(csv, {
  //         header: true,
  //         dynamicTyping: true,
  //         complete: (result) => {
  //           setUserData(result.data);
  //           setLoading(false);
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error loading CSV:', error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchCSVData();
  // }, []);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
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
        <DataGrid rows={mockDataContacts} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default ClockInfo;
