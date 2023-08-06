const { NextFunction, Request, Response } = require('express');

const { verify: verifyToken } = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/UserModel');
const { compareSync } = require('bcryptjs');
const { verifyTokenCC } = require('../utils/Authen');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: 'Invalid token format' });
  }

  verifyTokenCC(token, config.auth.jwtSecretKey, null, async (error, decoded) => {
    if (error) {
      console.log(error);
      return res.status(401).send({ message: 'Invalid token' });
    }
    const userInDB = await User.findOne({ _id: decoded.userId });
    req.user = userInDB;

    next();
  });
};

// Function to decode the JWT token and retrieve user information
function getCurrentUserFromToken(token) {
  try {
    const decodedToken = jwt.verify(token, config.auth.jwtSecretKey);
    // The payload will be available in the 'decodedToken' variable
    return decodedToken;
  } catch (err) {
    // Handle token verification error (e.g., token expired, invalid token)
    console.error('Error verifying token:', err);
    return null;
  }
}

const errorHandler = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  const status = error.status || 400
  return response.status(status).send(error.message)
}

module.exports = { authenticate, errorHandler, getCurrentUserFromToken };