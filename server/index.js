const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config.js');
const http = require('http');
const userRoutes = require('./routes/userRoute');
const app = express();
const db = mongoose.connection;

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
app.use('/api', userRoutes);
var server = http.createServer(app)

server.listen(config.server.port, () => {
    console.log(
        `Server is running on ${config.server.hostname}:${config.server.port}`
    );
});