import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { getCurrentUserFromToken, fetchUserData, getAllUserHardwareCredential, getAllUsers, updateUserInfo } from '../../utils/index';
import * as yup from 'yup';
import Header from '../components/Header';
import useMediaQuery from '@mui/material/useMediaQuery';

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
    user_id: yup.string().required('Required'),
    username: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string(),
    full_name: yup.string().required('Required'),
    date_of_birth: yup.date(),
    credential_id: yup.number().required('Required'),
    gender: yup.string().required('Required'),
    profile_picture: yup.string(),
    location: yup.string(),
    contact_email: yup.string(),
    contact_phone: yup.string(),
    role: yup.string().required('Required'),
    isActivated: yup.boolean(),
    rfid_data: yup.string(),
}, { timestamps: true });


const UpdateUserInfo = () => {
    const isNonMobile = useMediaQuery('(min-width:600px');
    const { userIdFromParams } = useParams();
    console.log('User ID from params:', userIdFromParams);
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [status, setStatus] = useState({ success: null, message: '' });
    const [loading, setLoading] = useState(true);
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
                const hardwareCredentialResponse = await getAllUserHardwareCredential(userData.objectId.user_id);
                const hardwareCredentials = hardwareCredentialResponse.userHardwareCredential;
                // filter the hardware credentials to only include the user's credential
                const userHardwareCredential = hardwareCredentials.filter(credential => credential.user_id === userIdFromParams);
                console.log('User Hardware Credential:', userHardwareCredential);

                const allUsersResponse = await getAllUsers(userData.objectId.user_id);
                const allUsers = allUsersResponse.users;
                // filter the users to only include the user
                const userInfoFromParam = allUsers.filter(user => user.user_id === userIdFromParams);
                // Set the initial values for the form
                setInitialValues({
                    ...userInfoFromParam[0],
                    rfid_data: userHardwareCredential[0].rfid_data,
                    // exclude password from the form
                    password: '',
                });
                console.log('All Users:', userInfoFromParam);

                setLoading(false);
            } catch (error) {
                // Handle token expiration or other errors
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [userIdFromParams, navigate]);

    const handleFormSubmit = async (values) => {
        try {
            // Filter out non-required and empty fields
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([key, value]) => {
                    return (
                        userSchema.fields[key] &&
                        (!userSchema.fields[key].isRequired || (value !== '' && value !== null))
                    );
                })
            );

            // Remove specific fields that you don't want to include in the request
            delete filteredValues.isActivated;
            if (filteredValues.password === ''){
            delete filteredValues.password;
            }
            console.log('Filtered Values:', filteredValues);
            const response = await updateUserInfo(userIdFromParams, filteredValues);
            if (response) {
                // Handle success, e.g., show a success message or redirect to another page
                navigate('/home/all-users-info'); // Redirect to the user list page after a successful update
            } else {
                // Handle failure
                console.error('Failed to update user:', response);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error, e.g., show an error message
        }
    };

    console.log('Initial Values:', initialValues);
    if (!initialValues) {
        return <CircularProgress />;
    }
    const Header = ({ title, subtitle, userId }) => {
        return (
            <div>
                <h1>{`${title} - User ID: ${userId}`}</h1>
                <h2>{subtitle}</h2>
                {/* Other header content */}
            </div>
        );
    };
    return (
        <Box m='20px'>
            <Header title='UPDATE INFO FOR USER' subtitle='Update info for User Profile' userId={userIdFromParams} />
            <Formik
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={handleFormSubmit}
            >
                {({ values, errors, touched, handleBlur, handleChange, setFieldValue }) => (
                    <Form>
                        <Box
                            display='grid'
                            gap='30px'
                            gridTemplateColumns='repeat(r, min-max(0, 1fr))'
                            sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span' } }}
                        >
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='User Name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name='username'
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='Full Name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.full_name}
                                name='full_name'
                                error={!!touched.full_name && !!errors.full_name}
                                helperText={touched.full_name && errors.full_name}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='Phone Number'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contact_phone}
                                name='contact_phone'
                                error={!!touched.contact_phone && !!errors.contact_phone}
                                helperText={touched.contact_phone && errors.contact_phone}
                                sx={{ gridColumn: 'span 1' }}
                            />

                            <Select
                                Choose Gender
                                fullWidth
                                variant='filled'
                                label='Gender'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.gender}
                                name='gender'
                                error={!!touched.gender && !!errors.gender}
                                helperText={touched.gender && errors.gender}
                                sx={{ gridColumn: 'span 1' }}
                            >
                                <MenuItem value=''>Select Gender</MenuItem>
                                <MenuItem value='Male'>Male</MenuItem>
                                <MenuItem value='Female'>Female</MenuItem>
                            </Select>
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name='email'
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: 'span 1' }}
                            />
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='RDIF Data'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.rfid_data}
                                name='rfid_data'
                                error={!!touched.rfid_data && !!errors.rfid_data}
                                helperText={touched.rfid_data && errors.rfid_data}
                                sx={{ gridColumn: 'span 1' }}
                            />
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='Password'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name='password'
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant='filled'
                                type='text'
                                label='Credential ID'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.credential_id}
                                name='credential_id'
                                error={!!touched.credential_id && !!errors.credential_id}
                                helperText={touched.credential_id && errors.credential_id}
                                sx={{ gridColumn: 'span 4' }}
                            />

                            <Select
                                fullWidth
                                variant='filled'
                                label='role'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.role}
                                name='role'
                                error={!!touched.role && !!errors.role}
                                helperText={touched.role && errors.role}
                                sx={{ gridColumn: 'span 1' }}
                            >
                                <MenuItem value=''>Select Role</MenuItem>
                                <MenuItem value='Manager'>Manager</MenuItem>
                                <MenuItem value='User'>User</MenuItem>
                            </Select>

                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Profile Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={async (e) => {
                                        // Upload the image and set the image URL in state
                                        // await handleImageUpload(e.target.files);
                                        setImageUrl(URL.createObjectURL(e.target.files[0]));
                                        setFieldValue("profile_picture", e.target.files[0])
                                    }}
                                />
                            </Button>
                            {/* Display the uploaded image */}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Uploaded Profile Image"
                                    style={{ maxWidth: '100%', maxHeight: '100px' }}
                                />
                            )}
                            {/* <input
                    type="file"
                    name="profile_picture"
                    onChange={(event) => setFieldValue("profile_picture", event.currentTarget.files[0])}
                  />
                  {errors.profile_picture && touched.profile_picture && (
                    <div>{errors.profile_picture}</div>
                  )} */}
                        </Box>
                        <Box display='flex' justifyContent='end' mt='20px'>
                            <Button type='submit' color='secondary' variant='contained' >
                                Update for selected user
                            </Button>
                        </Box>
                        {/* Display status message */}
                        {status.message && (
                            <Box mt={2} color={status.success ? 'green' : 'red'}>
                                {status.message}
                            </Box>
                        )}
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default UpdateUserInfo;
