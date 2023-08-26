import config from "../config";
import jwt_decode from 'jwt-decode';
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
  
  const options = {
    method: 'POST', // Changed to POST since we're sending a body
    headers: {
      'Authorization': `Bearer ${token}`, // Added 'Bearer ' prefix
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id }) // Send user_id in the body
  };

  try {
    const res = await fetch('http://localhost:4000/api/user/get-user-by-object-id/', options);
    const data = await res.json();
    
    if (res.status === 200) {
      console.log('data: ', data);
      return data;
    } else {
      console.error('Failed to fetch user:', data.error);
      return null;
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
}

