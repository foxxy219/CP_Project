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
    const response = await axios.post(API_ROUTES.user.getUserByObjectId , body, config);

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

export async function fetchUserHardwareCredentail(user_id){
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
    const response = await axios.post(API_ROUTES.admin.getUserHardwareCredentialbyUserId , body, config);

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

