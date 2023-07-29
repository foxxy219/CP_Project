const { NextFunction, Request, Response } = require('express');

const { verify: verifyToken } = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/UserModel');
const { compareSync } = require('bcryptjs');
const { verifyTokenCC } = require('../utils/Authen');

const authenticate = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: 'Invalid token format' });
  }

  verifyTokenCC(
    JSON.parse(token),
    config.auth.jwtSecretKey,
    null,
    async (error, decoded) => {
      if (error) {
        console.log(error)
        return res.status(401).send({ message: 'Invalid token' });
      }
      const user = await userModel.findById(decoded.id)
      req.user = user;

      next();
    }
  );
};

const errorHandler = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  const status = error.status || 400
  return response.status(status).send(error.message)
}

module.exports = { authenticate, errorHandler };