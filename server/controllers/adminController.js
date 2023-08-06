const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const Joi = require('joi');
const uuid4 = require("uuid4");
const jwt = require('jsonwebtoken');
const secret_key = require('../config/index.js').auth.jwtSecretKey;
const { verify } = require("jsonwebtoken");
const express = require('express');


const signupSchema = Joi.object({
    user_id: Joi.string(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    full_name: Joi.string(),
    date_of_birth: Joi.date(),
    credential_id: Joi.number().required(),
    gender: Joi.string(),
    profile_picture: Joi.string().required(),
    location: Joi.string(),
    contact_email: Joi.string(),
    contact_phone: Joi.string(),
    role: Joi.string(),
    credential_id: Joi.number().required(),
    isActivated: Joi.boolean(),
}, { timestamps: true });

const changeRoleSchema = Joi.object({
    user_id: Joi.string().required(),
    role: Joi.string().required(),
});


const registerForNewUser = async (req, res) => {
    try {
        const currentUser = req.user;
        // Check if the current user is an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to register a new user');
        }

        // Validate the request body against the signupSchema
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Generate a unique user_id using uuid4
        const userId = uuid4();

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(value.password, 10);
        // Create a new user object with the hashed password and other details
        const newUser = new User({
            user_id: userId,
            username: value.username,
            email: value.email,
            password: hashedPassword,
            full_name: value.full_name,
            date_of_birth: value.date_of_birth,
            credential_id: value.credential_id,
            gender: value.gender,
            profile_picture: value.profile_picture,
            location: value.location,
            contact_email: value.contact_email,
            contact_phone: value.contact_phone,
            role: value.role || 'user', // Assign 'user' role if not provided (optional)
            credential_id: value.credential_id,
            isActivated: value || false,
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const changeUserRole = async (req, res) => {
    try {
        const currentUser = req.user;
        // Check if the current user is an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to change user role');
        }
        //Find all user
        const users = await User.find();
        //Get user_id and role from request body
        const { user_id, role } = req.body;
        //Check if user_id is existed
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        //Validate role
        const { error, value } = changeRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        //Update role
        user.role = role;
        await user.save();
        return res.status(200).json({ message: 'User role changed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');

            
        }
    }

const DeactivateUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        //check for user exist or not
        const users = await User.find();
        const { user_id } = req.body;
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        //Deactive user
        user.isActivated = false;
        await user.save();

        return res.status(200).json({ message: 'User deactived successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const ActivateUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        //check for user exist or not
        const users = await User.find();
        const { user_id } = req.body;
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        //Deactive user
        user.isActivated = true;
        await user.save();

        return res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

// const checkUserInformation = async (req, res) => { 
//     try {
//         const role = req.user.role;
//         if (role !== 'admin') {
//             return res.status(403).send('You are not authorized to check user information');
//         }

//         const { user_id, username, credential_id } = req.body;
//         await User.findOne({ user_id, username, credential_id }, (err, user) => {
//             if (err) {
//                 return res.status(500).send(err);
//             }

//             if (!user) {
//                 return res.status(404).send('User not found');
//             }
//             if (!user.isActivated) {
//                 return res.status(401).send(err + 'User is not activated');
//             }

//         });
//     }
//      catch (error) {
//         return res.status(500).send(error);
//     }
// }



module.exports = {
    registerForNewUser,
    DeactivateUser,
    ActivateUser,
    // checkUserInformation,
    changeUserRole,
};