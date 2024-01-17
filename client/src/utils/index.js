import config from "../config";
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { API_ROUTES } from "../public/constants";

export const getCurrentUserFromToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null
    };
    // Decode the token to get the current user information
    const decodedToken = jwt_decode(token, config.auth.jwtSecretKey);
    // The payload will be available in the 'decodedToken' variable
    return decodedToken;
  }
  catch (err) {
    // Handle token verification error (e.g., token expired, invalid token)
    console.error('Error verifying token:', err);
    return null;
  }
};

export async function fetchUserData(_id) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  const body = {
    _id
  };

  try {
    const response = await axios.post(API_ROUTES.user.getUserByObjectId, body, config);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch user:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function fetchUserHardwareCredentail(user_id) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  const body = {
    user_id
  };

  try {
    const response = await axios.post(API_ROUTES.admin.getUserHardwareCredentialbyUserId, body, config);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch user:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}


export async function getAttendance(user_id) {
  const body = {
    user_id
  }
  try {
    const response = await axios.post(API_ROUTES.admin.getAttendance, body, config);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch attendance:', response.data.error);
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching attendance:', error);
    return null;
  }
}

export async function getAllUsers(user_id) {
  const token = localStorage.getItem('token');
  console.log(token);
  console.log('User ID:', user_id);
  const body = {
    user_id
  }
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
  try {
    const response = await axios.post(API_ROUTES.admin.getAllUsers, body, config);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch users:', response.data.error);
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

export async function getAllUserHardwareCredential(user_id) {
  const token = localStorage.getItem('token');
  console.log(token);
  console.log('User ID:', user_id);
  const body = {
    user_id
  }
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
  try {
    const response = await axios.post(API_ROUTES.admin.getAllRfidData, body, config);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch users:', response.data.error);
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

export async function deleteUserByUserId(user_id) {
  const token = localStorage.getItem('token');
  console.log(token);
  console.log('User ID:', user_id);
  const body = {
    user_id
  }
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
  try {
    const response = await axios.post(API_ROUTES.admin.deleteUserByUserId, body, config);
    if (response.status === 200) {
      return response.data;
    }
    else {
      console.error('Failed to delete users:', response.data.error);
      return null;
    }
  }
  catch (error) {
    console.error('Error deleting users:', error);
    return null;
  }
}

export async function updateUserInfo(user_id, data) {
  const token = localStorage.getItem('token');
  console.log(token);
  console.log('User ID:', user_id);
  console.log('Data:', data);

  const formData = new FormData();

  // Append each key-value pair to the FormData object
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  })
  console.log('FormData:', formData);
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }
  };
  try {
    const response = await axios.post(API_ROUTES.admin.updateUserInfo + user_id, formData, config);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch users:', response.data.error);
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}