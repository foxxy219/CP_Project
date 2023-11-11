import React from 'react';

import { Box, Button, TextField, Select, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../components/Header';
import axios from 'axios';

const initialValues = {
  username: '',
  full_name: '',
  email: '',
  password: '',
  credential_id: '',
  role: '',
  profileImage: null,
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const handleImageUpload = async (files) => {
  if (files.length === 0) {
    return;
  }

  const formData = new FormData();
  formData.append('file', files[0]);

  try {
    // Make a POST request to your local API to upload the image
    const response = await axios.post('http://localhost:4000/api/admin/test-upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle the response, which may contain the Cloudinary image URL
    const imageUrl = response.data.url;
    console.log('Image uploaded to Cloudinary:', imageUrl);

    // You can save the imageUrl to your form data or state as needed
    // Example: setFieldValue('profileImage', imageUrl);
  } catch (error) {
    console.error('Image upload failed:', error);
    // Handle any errors here
  }
};

const userSchema = yup.object().shape({
  username: yup.string().required('required'),
  full_name: yup.string().required('required'),
  email: yup.string().email('Invalid email').required('required'),
  contact_phone: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  password: yup.string().required('required'),
  credential_id: yup.string().required('required'),
  role: yup.string().required('required'),
  gender: yup.string().required('required'),
  profileImage: yup.mixed().test('isImage', 'Please provide a valid image file', (value) => {
    return value === null || (value && value.type.startsWith('image/'));
  }),
});

const Form = () => {
  const isNonMobile = useMediaQuery('(min-width:600px');
  const [imageUrl, setImageUrl] = React.useState(null);
  const handleFormSubmit = (values) => {
    // eslint-disable-next-line
    console.log(values);
  };
  console.log('cascasc');
  return (
    <Box m='20px'>
      <Header title='CREATE USER' subtitle='Create a New User Profile' />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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
                name='Gender'
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: 'span 1' }}
              >
                <MenuItem value=''>Select Gender</MenuItem>
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
                {/* Add more role options as needed */}
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
                label='Role'
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
                    await handleImageUpload(e.target.files);
                    setImageUrl(URL.createObjectURL(e.target.files[0]));
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
                name="profileImage"
                onChange={(event) => setFieldValue("profileImage", event.currentTarget.files[0])}
              />
              {errors.profileImage && touched.profileImage && (
                <div>{errors.profileImage}</div>
              )} */}
            </Box>
            <Box display='flex' justifyContent='end' mt='20px'>
              <Button type='submit' color='secondary' variant='contained'>
                Crate new user
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;