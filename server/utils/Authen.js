const jwt = require('jsonwebtoken');

const verifyTokenCC = (token, secretKey, options, callback) => {
  jwt.verify(token, secretKey, options, callback);
};

module.exports = verifyTokenCC;
