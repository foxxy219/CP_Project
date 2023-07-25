// const hashSync = require('bcryptjs').hashSync;
// const genSaltSync = require('bcryptjs').genSaltSync;
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

const User = require('../models/User.js'); 
const Joi = require('joi');

// Validation schema using Joi
const userValidationSchema = Joi.object({
  user_id: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string(),
  date_of_birth: Joi.date(),
  gender: Joi.string(),
  profile_picture: Joi.string(),
  location: Joi.string(),
  contact_email: Joi.string().email(),
  contact_phone: Joi.string(),
});

// Create a new user
const createUser = async (req, res) => {
  
  try {
    const { error } = userValidationSchema.validate(req.body);
    const user_id = new Types.ObjectId();
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newUser = await User.create({ user_id, ...req.body });
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { createUser };


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

//       const checkPassword = compareSync(req.body.password, checkExist.password);

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

//       const checkPassword = compareSync(req.body.password, checkExist.password);
//       const hash = hashSync(req.body.password, salt);
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
//           'string.empty': 'Eamil không được để trống',
//           'string.email': 'Email không đúng định dạng',
//           'string.max': 'Email tối đa là 32 chữ',
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
//       const finalBody = { ...req.body , isActivated: true};
//       const findUser = userModel.findById(req.user?._id);
//       if (!findUser) {
//         throw new Error('Không tìm thấy người dùng');
//       }
//       const genId = uuidv4();
//     //   if (req.files?.avatar) {
//     //     const avatar = req.files?.avatar;
//     //     avatar.mv(`./public/images/${genId}`, function (err) {
//     //       if (err) {
//     //         throw new Error('Lỗi tải ảnh');
//     //       }
//     //     });
//     //     req.body.avatar = genId;
//     //   }
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

// export default new UserController();
