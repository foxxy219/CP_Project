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
//const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js'); 
const Joi = require('joi');
const uuid4 =  require("uuid4");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// Validation schema using Joi
// const userValidationSchema = Joi.object({
//   username: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
//   full_name: Joi.string(),
//   date_of_birth: Joi.date(),
//   gender: Joi.string(),
//   profile_picture: Joi.string(),
//   location: Joi.string(),
//   contact_email: Joi.string().email(),
//   contact_phone: Joi.string(),
// });

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

class UserController {
  async login(req, res, next) {
    try {
      const schema = Joi.object({
        password: joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        email: joi.string().email().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.email': 'Email không đúng định dạng',
          'string.max': 'Email tối đa là 32 chữ',
        }),
      });
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const checkExist = await userModel
        .findOne({ email: req.body.email })
        .populate('role')
        .lean();
      if (!checkExist) {
        throw new Error('User does not exist');
      }
      const checkPassword = bcrypt.compareSync(req.body.password, checkExist.password);
      if (!checkPassword) {
        throw new Error('Sai mật khẩu');
      }
      const userAbility = [];
      const accessToken = jwt.sign(
        { id: checkExist._id ? checkExist._id : checkExist.id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );
      const refreshTokens = jwt.sign(
        { id: checkExist.id ? checkExist.id : checkExist._id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );
      const { password, ...returnUser } = checkExist;
   
      const response = {
        message: 'Đăng nhập thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: { ...returnUser, ability: userAbility },
        accessToken,
        refreshToken: refreshTokens,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req, res, next) {
    try {
      const schema = Joi.object({
        password: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        newPassword: Joi.string().required().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.min': 'Mật khẩu mới  phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu mới tối đa là 32 chữ',
        }),
      });
      const validate = schema.validate(req.body);
      const checkExist = await userModel
        .findById(req.user?._id)
        .populate('role')
        .lean();
      if (!checkExist) {
        throw new Error('User does not exist');
      }
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
      const checkPassword = bcrypt.compareSync(req.body.password, checkExist.password);
      const hash = hashSync(req.body.password, salt);
      await userModel.findByIdAndUpdate(req.user?._id, { password: hash });
      if (!checkPassword) {
        throw new Error('Sai mật khẩu');
      }
      const response = {
        message: 'Tạo tài khoản thành công',
        status: RESPONSE_STATUS.SUCCESS,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async signUp(req, res, next) {
    try {
      const schema = Joi.object({
        username: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Tên người dùng không được để trống',
          'string.min': 'Tên người dùng phải có tối thiểu 6 chữ',
          'string.max': 'Tên người dùng tối đa là 32 chữ',
        }),
        password: Joi.string().required().max(32).min(6).messages({
          'string.empty': 'Mật khẩu không được để trống',
          'string.min': 'Mật khẩu phải có tối thiểu 6 chữ',
          'string.max': 'Mật khẩu tối đa là 32 chữ',
        }),
        email: Joi.string().email().max(32).required().messages({
          'string.empty': 'Eamil không được để trống',
          'string.email': 'Email không đúng định dạng',
          'string.max': 'Email tối đa là 32 chữ',
        }),
      });
      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      const salt = genSaltSync(Number(process.env.SALT_ROUND || 10));
      const hash = hashSync(req.body.password, salt);
      const checkExistEmail = await userModel.find({
        email: req.body.email,
      });
      if (checkExistEmail.length > 0) {
        throw new Error('Email đã tồn tại');
      }
      const newUser = await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        provider: 'local',
      });
      const { password, ...returnUser } = newUser;
      const accessToken = jwt.sign(
        { id: newUser.id ? newUser.id : newUser._id },
        config.auth.jwtSecretKey,
        { expiresIn: '1d' }
      );
      const response = {
        message: 'Tạo tài khoản thành công',
        status: RESPONSE_STATUS.SUCCESS,
        user: { ...returnUser?._doc },
        accessToken,
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

