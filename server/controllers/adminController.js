const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js'); 
const Joi = require('joi');
const uuid4 =  require("uuid4");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret_key = require('../config/index.js').auth.jwtSecretKey;
const { verify } = require("jsonwebtoken");

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
}, {timestamps: true});

const isAuth = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = verify(token, process.env.SECRET);
        req.user = verified;
        console.log('Am i admin?', req.user.isAdmin);
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};

const isAdmin = async (req, res, next) => {

    // no need to verify token again
    // the `req.user.isAdmin` is already available from isAuth
    // also no need to query a database, we have all the info we need from the token
    if (!req.user.isAdmin)
        return res.status(401).send({ msg: "Not an admin, sorry" });

    next();
};
    

const registerForNewUser = async (req, res) => {
    try {

    const token = jwt.sign({ userId: user._id }, secret_key); 
    //check if user is admin
    const role = req.user.role;
    if (role != 'admin'){
        return res.status(400).send('You are not admin');
    }
    

    
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.message);
        }
    
    if(role != 'admin'){
        return res.status(400).send('You are not admin');
    }


    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};