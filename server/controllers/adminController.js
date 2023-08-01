const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const Joi = require('joi');
const uuid4 = require("uuid4");
const jwt = require('jsonwebtoken');
const secret_key = require('../config/index.js').auth.jwtSecretKey;
const { verify } = require("jsonwebtoken");
const e = require('express');

const signupSchema = Joi.object({
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
}, { timestamps: true });

const isAuth = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = verify(token, process.env.SECRET);
        req.user = verified;
        console.log('Am I admin?', req.user.isAdmin);
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};

const isAdmin = async (req, res, next) => {
    // The isAdmin property is already available from isAuth middleware
    // We don't need to verify the token again or query the database for this
    if (!req.user.isAdmin) {
        return res.status(401).send({ msg: "Not an admin, sorry" });
    }

    next();
};

const registerForNewUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const role = req.user.role;
        if (role !== 'admin') {
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
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};


const deleteUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const role = req.user.role;
        if (role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        // Get the user_id from the request body
        const { user_id } = req.body;

        // Delete the user from the database
        await User.deleteOne({ user_id });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const checkUserInformation = async (req, res) => { 
    try {
        const role = req.user.role;
        if (role !== 'admin') {
            return res.status(403).send('You are not authorized to check user information');
        }

        const { user_id, username, credential_id } = req.body;
        await User.findOne({ user_id, username, credential_id }, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!user) {
                return res.status(404).send('User not found');
            }
            if (!user.isActivated) {
                return res.status(401).send(err + 'User is not activated');
            }

        });
    }
     catch (error) {
        return res.status(500).send(error);
    }
}



module.exports = {
    registerForNewUser,
    deleteUser,
    checkUserInformation,
};