const dotenv = require('dotenv');

dotenv.config();
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || ('localhost');
const SERVER_PORT = process.env.SERVER_PORT || (4000);
const MONGO_URL = 'mongodb+srv://quanbeater:quanbeater@shopping-list.rqg6g.mongodb.net/?retryWrites=true&w=majority';
const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

// //jwt
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'gofiberschedule';
// //SECRET_PASSWORD
// const SECRET_PASSWORD = process.env.SECRET_PASSWORD || '123456'


// //role
// const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin';
// const CUSTOMER_ROLE = process.env.CUSTOMER_ROLE || 'customer';

// const CRYPTO_KEY = process.env.CRYPTO_KEY || 'gofiberschedule';

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: SERVER,
  
//   auth: {
//     jwtSecretKey: JWT_SECRET_KEY,
//     secretPassword: SECRET_PASSWORD,  
//   },
//   role: {
//     customer: CUSTOMER_ROLE,
//     admin: ADMIN_ROLE,
//   },
//   crypto: {
//     cryptoKey: CRYPTO_KEY,
//   },
};

module.exports = config;