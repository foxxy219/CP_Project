const jwt = require('jsonwebtoken');

const verifyToken = (token, secretKey, options, callback) => {
  jwt.verify(token, secretKey, options, callback);
};

module.exports = verifyToken;
