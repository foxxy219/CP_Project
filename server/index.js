const express = require('express');
const mongoose = require('mongoose');
const { updatePinCode } = require("./utils/updatePinCode.js");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/index.js');
const http = require('http');
const userRoutes = require('./routes/userRoute');
const app = express();
const db = mongoose.connection;
const adminRoutes = require('./routes/adminRoute');

const corsOption = {
    credentials: true,
    origin: '*',
    allowedHeaders: [
        'Origin',
        'Content-Type',
        'Accept',
        'x-access-token',
        'authorization',
        'x-signature',
    ],
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `public`)));

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('connected database');
    })
    .catch((err) => console.log(err));

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
var server = http.createServer(app)


//Function called when the server is started
updatePinCode();

server.listen(config.server.port, () => {
    console.log(
        `Server is running on ${config.server.hostname}:${config.server.port}`
    );
});