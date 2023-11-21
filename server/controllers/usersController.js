const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const UserCredential = require('../models/HW_UserCredentialDataModel.js');
const Joi = require('joi');
const uuid4 = require("uuid4");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/index.js');
const { expirationTimestamp } = require('../utils/ExpiredTime.js');
const { getCurrentUserFromToken } = require('../middleware/index.js');
const saltRounds = 10; // For bcrypt
const ObjectId = require('mongoose').Types.ObjectId;

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Please provide Email',
    'string.email': 'Please input correct format of Email',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Please input right password',
  })
});

// Validation schema for change password
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});

// Validation schema for signup
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  full_name: Joi.string(),
  date_of_birth: Joi.date(),
  credential_id: Joi.number().required(),
}, { timestamps: true });

// Login function
async function login(req, res) {
  try {
    // Validate the request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, config.auth.jwtSecretKey, { expiresIn: '1d' });


    // Send the token in the response
    const response = {
      message: 'Login Success',
      status: true,
      token,
    };
    user.isOnline = true;
    await user.save();
    console.log(response)
    return res.status(200).json(response);
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//Logout function
async function logout(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    else {
      user.isOnline = false;
      await user.save();
      return res.status(200).json({ message: 'Logout Success, online status is false' });
    }
  } catch (err) {
    console.error('Error in logout:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Logout function (optional, as it's usually handled on the client-side with tokens)
// For completeness, you can simply invalidate the token on the client-side.

// Change Password function
async function changePassword(req, res) {
  try {
    // Validate the request body
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { currentPassword, newPassword } = value;
    const userId = req.user.user_id; // Assuming you have the authenticated user's ID in the request object

    // Find the user by ID in the database
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password matches
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    // Send a success response
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error in changePassword:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const Test_signup = async (req, res) => {
  try {
    const validate = signupSchema.validate(req.body);
    if (validate.error) {
      return res.status(400).json({ error: validate.error.details[0].message });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user_id = uuid4();
    const pinCode = Math.floor(100000 + Math.random() * 900000);
    //Check for existed email and username
    const checkExistEmail = await User.find({ email: req.body.email });
    if (checkExistEmail.length > 0) {
      console.log("Email existed");
      return res.status(400).json({ error: 'Email existed' });
    }
    const checkExistUsername = await User.find({ username: req.body.username });
    if (checkExistUsername.length > 0) {
      console.log("Username existed");
      return res.status(400).json({ error: 'Username existed' });
    }

    // Create a new user
    const newUser = await User.create({ user_id, ...req.body, password: hash });
    const newUserCredential = await UserCredential.create({ user_id: newUser.user_id, pin_code: pinCode });
    const { password, ...returnUser } = newUser;
    // Generate a JWT token for authentication
    const accessToken = jwt.sign(
      { id: newUser.id ? newUser.id : newUser._id },
      config.auth.jwtSecretKey,
      { expiresIn: '1d' }
    );

    // Send the token in the response
    const response = {
      message: 'Signup Success',
      status: true,
      user: { ...returnUser?._doc },
      accessToken: accessToken,
    };
    return res.status(200).json(response + "Success");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  };
};



async function getCurrentUser(req, res) {
  try {

    // Decode the token to get the current user information
    // const token = req.headers.authorization.split(' ')[1];
    // const currentUser = getCurrentUserFromToken(token);
    const currentUser = req.user;
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      } else {  
        console.log("Current user ID:", currentUser.user_id);
        console.log("Current user email:", currentUser.email);
        console.log("Current user:", currentUser);
        // Access other user information as needed

        // Return the user object in the response if needed
        return res.status(200).json({ user: currentUser });
      }
    

  } catch (err) {
    console.error("Error in getCurrentUser:", User);
    console.error("Error in getCurrentUser:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserByObjectId(req, res) {
  try {
    const currentUser = req.user;
    const userIdFromRequest = new ObjectId(req.body._id);
    const objectId = await User.findOne({ _id: currentUser._id }); 
    // console.log("objectId:", objectId);
    // console.log("userIdFromRequest:", userIdFromRequest);
    if (!objectId || !userIdFromRequest){
      return res.status(404).json({ error: "User not found, please provide both object id and token" });
    }
    else if (userIdFromRequest.toString() !== objectId._id.toString()){
      return res.status(404).json({ error: "object id different from object id in token" });
    }
    else if (userIdFromRequest.toString() === objectId._id.toString()){
      return res.status(200).json({ objectId });
    }
  } catch (err) {
    console.error("Error in getUserById:", err);
    return res.status(500).json("Internal Server Error"+ err );
  }
}




module.exports = {
  login,
  logout,
  changePassword,
  Test_signup,
  getCurrentUser,
  getUserByObjectId,
};


