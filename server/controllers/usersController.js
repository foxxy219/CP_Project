// //@ts-ignore
// import { NextFunction, Request, Response } from 'express';
// //@ts-ignore
// const joi = require('joi');
// import userModel from '../models/user.js';
// import { RESPONSE_STATUS } from '../utils';
// import jwt from 'jsonwebtoken';
// import config from '../config/config';
// import { compareSync } from 'bcrypt';
// import path from 'path';
// import { AuthRequest } from '../interfaces';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js'); 
const Joi = require('joi');
const uuid4 =  require("uuid4");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret_key = require('../config/index.js').auth.jwtSecretKey;

const saltRounds = 10; // For bcrypt

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Please provide Email',
    'string.email': 'Please input correct format of Email',}),
  password: Joi.string().required().messages({
    'string.empty': 'Please input right password',})
});

// Validation schema for change password
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});

// Login function
  // async function login(req, res) {
  //   try {
  //     // Validate the request body
  //     const { error, value } = loginSchema.validate(req.body);
  //     if (error) {
  //       return res.status(400).json({ error: error.details[0].message });
  //     }
  
  //     const { email, password } = value;
  
  //     // Find the user by email in the database
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }
  
  //     // Check if the password matches
  //     const passwordMatch = await bcrypt.compare(password, user.password);
  //     if (!passwordMatch) {
  //       return res.status(401).json({ error: 'Invalid password' });
  //     }
  
  //     // Generate a JWT token for authentication
  //     const token = jwt.sign({ userId: user._id }, secret_key); // Replace 'your_secret_key' with your actual secret key
  
  //     // Send the token in the response
  //     res.json({ token });
  //   } catch (err) {
  //     console.error('Error in login:', err);
  //     res.status(500).json(err);
  //   }
  // }

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
      return res.status(404).json({ error: 'User not found' } + err);
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, secret_key); // Replace 'your_secret_key' with your actual secret key

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error('Error in login:', err);
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




module.exports = {
  login,
  changePassword,
};

// // Create a new user
// const createUser = async (req, res) => {
  
//   try {
//     const { error } = userValidationSchema.validate(req.body);
//     const user_id = new mongoose.Types.ObjectId();
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }
//     const newUser = await User.create({ user_id, ...req.body });
//     //const newUser = await User.create(req.body);
//     return res.status(201).json(newUser);
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };

// class UserController {
//   async login(req, res, next) {
//     try {
//       const schema = Joi.object({
//         password: joi.string().required().max(32).min(6).messages({
//           'string.empty': 'Mật khẩu không được để trống',
//           'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
//           'string.max': 'Mật khẩu tối đa là 32 chữ',
//         }),
//         email: joi.string().email().max(32).required().messages({
//           'string.empty': 'Eamil không được để trống',
//           'string.email': 'Email không đúng định dạng',
//           'string.max': 'Email tối đa là 32 chữ',
//         }),
//       });
//       const validate = schema.validate(req.body);
//       if (validate.error) {
//         throw new Error(validate.error.message);
//       }
//       const checkExist = await userModel
//         .findOne({ email: req.body.email })
//         .populate('role')
//         .lean();
//       if (!checkExist) {
//         throw new Error('User does not exist');
//       }
//       const checkPassword = bcrypt.compareSync(req.body.password, checkExist.password);
//       if (!checkPassword) {
//         throw new Error('Sai mật khẩu');
//       }
//       const userAbility = [];
//       const accessToken = jwt.sign(
//         { id: checkExist._id ? checkExist._id : checkExist.id },
//         config.auth.jwtSecretKey,
//         { expiresIn: '1d' }
//       );
//       const refreshTokens = jwt.sign(
//         { id: checkExist.id ? checkExist.id : checkExist._id },
//         config.auth.jwtSecretKey,
//         { expiresIn: '1d' }
//       );
//       const { password, ...returnUser } = checkExist;
   
//       const response = {
//         message: 'Đăng nhập thành công',
//         status: RESPONSE_STATUS.SUCCESS,
//         user: { ...returnUser, ability: userAbility },
//         accessToken,
//         refreshToken: refreshTokens,
//       };
//       return res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }
//   async changePassword(req, res, next) {
//     try {
//       const schema = Joi.object({
//         password: Joi.string().required().max(32).min(6).messages({
//           'string.empty': 'Mật khẩu không được để trống',
//           'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
//           'string.max': 'Mật khẩu tối đa là 32 chữ',
//         }),
//         newPassword: Joi.string().required().max(32).required().messages({
//           'string.empty': 'Eamil không được để trống',
//           'string.min': 'Mật khẩu mới  phải có tối thiểu 6 chữ',
//           'string.max': 'Mật khẩu mới tối đa là 32 chữ',
//         }),
//       });
//       const validate = schema.validate(req.body);
//       const checkExist = await userModel
//         .findById(req.user?._id)
//         .populate('role')
//         .lean();
//       if (!checkExist) {
//         throw new Error('User does not exist');
//       }
//       if (validate.error) {
//         throw new Error(validate.error.message);
//       }
//       const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
//       const checkPassword = bcrypt.compareSync(req.body.password, checkExist.password);
//       const hash = bcrypt.hashSync(req.body.password, salt);
//       await userModel.findByIdAndUpdate(req.user?._id, { password: hash });
//       if (!checkPassword) {
//         throw new Error('Sai mật khẩu');
//       }
//       const response = {
//         message: 'Tạo tài khoản thành công',
//         status: RESPONSE_STATUS.SUCCESS,
//       };
//       return res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }
//   async signUp(req, res, next) {
//     try {
//       const schema = Joi.object({
//         username: Joi.string().required().max(32).min(6).messages({
//           'string.empty': 'Tên người dùng không được để trống',
//           'string.min': 'Tên người dùng phải có tối thiểu 6 chữ',
//           'string.max': 'Tên người dùng tối đa là 32 chữ',
//         }),
//         password: Joi.string().required().max(32).min(6).messages({
//           'string.empty': 'Mật khẩu không được để trống',
//           'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
//           'string.max': 'Mật khẩu tối đa là 32 chữ',
//         }),
//         email: Joi.string().email().max(32).required().messages({
//           'string.empty': 'Email không được để trống',
//           'string.email': 'Email không đúng định dạng',
//           'string.max': 'Email tối đa là 32 chữ',
//         }),
//         userId: Joi.string().required().max(6).min(3).messages({
//           'string.empty': 'UserId không được để trống',
//           'string.min': 'UserId phải có tối thiểu 3 chữ',
//           'string.max': 'UserId phải có tối thiểu 6 chữ',
//         }),
//       });
//       const validate = schema.validate(req.body);
//       if (validate.error) {
//         throw new Error(validate.error.message);
//       }
//       const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
//       const hash = hashSync(req.body.password, salt);
//       const checkExistEmail = await userModel.find({
//         email: req.body.email,
//       });
//       if (checkExistEmail.length > 0) {
//         throw new Error('Email đã tồn tại');
//       }
//       const newUser = await userModel.create({
//         username: req.body.username,
//         email: req.body.email,
//         password: hash,
//         provider: 'local',
//       });
//       const { password, ...returnUser } = newUser;
//       const accessToken = jwt.sign(
//         { id: newUser.id ? newUser.id : newUser._id },
//         config.auth.jwtSecretKey,
//         { expiresIn: '1d' }
//       );
//       const response = {
//         message: 'Tạo tài khoản thành công',
//         status: RESPONSE_STATUS.SUCCESS,
//         user: { ...returnUser?._doc },
//         accessToken,
//       };
//       return res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }
//   async loginWithGoogle(req, res, next) {
//     try {
//       const { tokenId } = req.body;
//       const verifyToken = await axios({
//         method: 'GET',
//         url: `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`,
//         withCredentials: true,
//       });
//       if (verifyToken.status === 200) {
//         const { email_verified, email, name, picture } = verifyToken.data;
//         const checkValidEmail = await userModel.findOne({ email: email });
//         const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
//         const hash = hashSync(config.auth.secretPassword, salt);
//         if (!checkValidEmail) {
//           const newUser = await userModel.create({
//             username: name,
//             email: email,
//             avatar: picture,
//             password: hash,
//             provider: 'google',
//           });
//           const { password, ...returnUser } = newUser;

//           const accessToken = jwt.sign(
//             { id: newUser.id ? newUser.id : newUser._id },
//             config.auth.jwtSecretKey,
//             { expiresIn: '1d' }
//           );

//           const response = {
//             message: 'Tạo tài khoản thành công',
//             status: RESPONSE_STATUS.SUCCESS,
//             user: { ...returnUser?._doc },
//             accessToken,
//           };
//           return res.status(200).json(response);
//         } else {
//           const user = await userModel.findOne({ email: email });
//           const { password, ...returnUser } = user;
//           const accessToken = jwt.sign(
//             { id: user.id ? user.id : user._id },
//             config.auth.jwtSecretKey,
//             { expiresIn: '1d' }
//           );
//           const response = {
//             message: 'Đăng nhập thành công',
//             status: RESPONSE_STATUS.SUCCESS,
//             user: { ...returnUser?._doc },
//             accessToken,
//           };
//           return res.status(200).json(response);
//         }
//       } else {
//         const response = {
//           message: 'Token không lệ ',
//           status: RESPONSE_STATUS.FAILED,
//           user: null,
//         };
//         return res.status(200).json(response);
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
//   async updateProfile(req, res, next) {
//     try {
//       const schema = Joi.object({
//         username: Joi.string()
//           .required()
//           .max(32)
//           .min(6)
//           .messages({
//             'string.empty': 'Tên người dùng không được để trống',
//             'string.min': 'Tên người dùng phải có tối thiểu 6 chữ',
//             'string.max': 'Tên người dùng tối đa là 32 chữ',
//           }),
//         email: Joi.string()
//           .email()
//           .max(32)
//           .required()
//           .messages({
//             'string.empty': 'Eamil không được để trống',
//             'string.email': 'Email không đúng định dạng',
//             'string.max': 'Email tối đa là 32 chữ',
//           }),
//         cmnd: Joi.string().required().max(12).min(9).messages({
//           'string.empty': 'CMND không được để trống',
//           'string.min': 'CMND phải có tối thiểu 9 chữ',
//           'string.max': 'CMND tối đa là 12 chữ',
//         }),
//         phone: Joi.string().required().max(12).min(9).messages({
//           'string.empty': 'Số điện thoại không được để trống',
//           'string.min': 'Số điện thoại phải có tối thiểu 9 chữ',
//           'string.max': 'Số điện thoại tối đa là 12 chữ',
//         }),
//       }).unknown(true);

//       const validate = schema.validate(req.body);
//       if (validate.error) {
//         throw new Error(validate.error.message);
//       }
//       const finalBody = { ...req.body, isActivated: true };
//       const findUser = userModel.findById(req.user?._id);
//       if (!findUser) {
//         throw new Error('Không tìm thấy người dùng');
//       }
//       const genId = uuidv4();
//       if (req.files?.avatar) {
//         const avatar = req.files?.avatar;
//         avatar.mv(`./public/images/${genId}`, function (err) {
//           if (err) {
//             throw new Error('Lỗi tải ảnh');
//           }
//         });
//         req.body.avatar = genId;
//       }
//       const updateUser = await userModel.findByIdAndUpdate(
//         req.user?._id,
//         finalBody
//       );
//       const response = {
//         message: 'Cập nhật thành công',
//         status: RESPONSE_STATUS.SUCCESS,
//         user: { ...updateUser?._doc },
//       };
//       return res.status(200).json(response);
//     } catch (err) {
//       next(err);
//     }
//   }
// }

// module.exports = { login, changePassword };

