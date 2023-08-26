
//jwt
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'cpproject';
//SECRET_PASSWORD
const SECRET_PASSWORD = process.env.SECRET_PASSWORD || '19119'




// //role
// const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin';
// const CUSTOMER_ROLE = process.env.CUSTOMER_ROLE || 'customer';

// const CRYPTO_KEY = process.env.CRYPTO_KEY || 'gofiberschedule';

const config = {
  auth: {
    jwtSecretKey: JWT_SECRET_KEY,
    secretPassword: SECRET_PASSWORD,  
  },
};

module.exports = config;