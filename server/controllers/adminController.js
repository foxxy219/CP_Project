const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const UserCredential = require('../models/HW_UserCredentialDataModel.js');
const Attendance = require('../models/AttendanceModel.js');
const Joi = require('joi');
const uuid4 = require("uuid4");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const otplib = require('otplib');
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadImage = async (req, res, userId) => {
    try {
        const currentUser = req.user;
        const file = req.files.profile_picture;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: userId + '_profile_picture',
        });

        console.log(uploadResponse);
        return uploadResponse;
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error' + error);
    }
};

const signupSchema = Joi.object({
    user_id: Joi.string(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    full_name: Joi.string().required(),
    date_of_birth: Joi.date(),
    credential_id: Joi.number().unsafe().required(),
    gender: Joi.string().required(),
    profile_picture: Joi.string(),
    location: Joi.string(),
    contact_email: Joi.string(),
    contact_phone: Joi.string(),
    role: Joi.string().required(),
    isActivated: Joi.boolean(),
}, { timestamps: true });

const signupSchemaForUpdate = Joi.object({
    user_id: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
    full_name: Joi.string().required(),
    date_of_birth: Joi.date(),
    credential_id: Joi.number().unsafe().required(),
    gender: Joi.string().required(),
    profile_picture: Joi.string(),
    location: Joi.string(),
    contact_email: Joi.string(),
    contact_phone: Joi.string(),
    role: Joi.string().required(),
    isActivated: Joi.boolean(),
    rfid_data: Joi.string(),
}, { timestamps: true });

const changeRoleSchema = Joi.object({
    user_id: Joi.string().required(),
    role: Joi.string().required(),
});


const deleteUserByUserId = async (req, res) => {
    try {
        // Check if the current user is an admin
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        const user_id = req.body.user_id;

        // Check if the user exists
        const userExists = await User.exists({ user_id });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete records from multiple collections concurrently
        await Promise.all([
            User.deleteOne({ user_id }),
            UserCredential.deleteOne({ user_id }),
            Attendance.deleteOne({ user_id }),
        ]);

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error' + error);
    }
};



const registerForNewUser = async (req, res) => {
    try {
        const currentUser = req.user;

        // Check if the current user is an admin
        // if (currentUser.role !== 'admin') {
        //     return res.status(403).send('You are not authorized to register a new user');
        // }
        const userId = uuid4();
        const imageUploadResponse = await uploadImage(req, res, userId);

        // Generate a secret key for TOTP
        const secretKey = otplib.authenticator.generateSecret();

        // Use TOTP to generate the initial PIN code
        const pinCode = otplib.authenticator.generate(secretKey);

        if (imageUploadResponse.url !== null) {
            // Handle the image upload error
            console.log(imageUploadResponse.url);
        }

        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }


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
            profile_picture: imageUploadResponse.url,
            location: value.location,
            contact_email: value.contact_email,
            contact_phone: value.contact_phone,
            role: value.role || 'user', // Assign 'user' role if not provided (optional)
            isActivated: value.is_activated || false,
        });

        //Create a new user credential object
        const newUserCredential = new UserCredential({
            user_id: userId,
            pin_code: pinCode,
            rfid_data: value.rfid_data,
            face_data: value.face_data,
            secret_key: secretKey,
        });

        // Create a new attendance object
        const newAttendance = new Attendance({
            user_id: userId,
            access: false,
            status: 'Absent',
        });

        // Save the new user to the database
        await newUser.save();
        // Save the new user credential to the database
        await newUserCredential.save();
        // Save the new attendance to the database
        await newAttendance.save();

        return res.status(201).json({
            message: 'User registered successfully',
            user_id: userId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error' + error);
    }
};

const changeUserRole = async (req, res) => {
    try {
        const currentUser = req.user;
        // Check if the current user is an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to change user role');
        }
        //Find all user
        const users = await User.find();
        //Get user_id and role from request body
        const { user_id, role } = req.body;
        //Check if user_id is existed
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        //Validate role
        const { error, value } = changeRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        //Update role
        user.role = role;
        await user.save();
        return res.status(200).json({ message: 'User role changed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');


    }
}

const DeactivateUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        //check for user exist or not
        const users = await User.find();
        const { user_id } = req.body;
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        //Deactive user
        user.isActivated = false;
        await user.save();

        return res.status(200).json({ message: 'User deactived successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const ActivateUser = async (req, res) => {
    try {
        // Check if the current user is an admin
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).send('You are not authorized to delete a user');
        }

        //check for user exist or not
        const users = await User.find();
        const { user_id } = req.body;
        const user = users.find(user => user.user_id === user_id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        //Deactive user
        user.isActivated = true;
        await user.save();

        return res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const getAllUsers = async (req, res) => {
    try {
        // Check if the current user is an admin
        const user_id = req.body.user_id;

        // Check if the user exists
        const userExists = await User.exists({ user_id });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Move this line after checking if the user exists
        const user = await User.findOne({ user_id });

        if (user.role !== 'admin') {
            return res.status(403).send('You are not authorized to get all user');
        }

        const users = await User.find().exec();
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

const updateUserInfo = async (req, res) => {
    try {
        // return res.status(200).json({ message: 'cac' }); // Use res.status(status).json(obj)
        const userId = req.body.user_id;
        const { error, value } = signupSchemaForUpdate.validate(req.body);
        console.log(value);
        if (error) {
            return res.status(400).json(error.details); // Use res.status(status).json(obj)
        }
        if (value.profile_picture === null) {
            value.profile_picture = "https://res.cloudinary.com/dz3vsv9pg/image/upload/v1620899669/Profile%20Pictures/default_profile_picture.png";
        }
        const imageUploadResponse = await uploadImage(req, res, userId);
        if (imageUploadResponse.url !== null) {
            // Handle the image upload error
            console.log(imageUploadResponse.url);
        }
        const userExists = await User.exists({ user_id: userId });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' }); // Use res.status(status).json(obj)
        }
        console.log("User exsit")
        // Hash the new password if provided
        let hashedPassword = value.password;
        if (value.password) {
            hashedPassword = await bcrypt.hash(value.password, 10);
        }

        console.log("updating")
        // Update information in the User collection
        await User.findOneAndUpdate({ user_id: userId }, {
            username: value.username,
            email: value.email,
            full_name: value.full_name,
            password: hashedPassword,
            date_of_birth: value.date_of_birth,
            credential_id: value.credential_id,
            gender: value.gender,
            profile_picture: value.profile_picture,
            location: value.location,
            profile_picture: imageUploadResponse.url,
            contact_email: value.contact_email,
            contact_phone: value.contact_phone,
            role: value.role,
            isActivated: value.isActivated,
        });
        console.log("finding user credential")
        // Update password in the UserCredential collection (assuming there is a password field)
        await UserCredential.findOneAndUpdate({ user_id: userId }, {
            rfid_data: value.rfid_data,
        });

        return res.status(200).json({ message: 'User information updated successfully', data: value }); // Use res.status(status).json(obj)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Internal Server Error'); // Use res.status(status).json(obj)
    }
}


// Update secret key for all user in UserCredential database
const updateSecretKey = async (req, res) => {
    try {
        const users = await User.find();
        // Parallelize the database update operations using Promise.all
        await Promise.all(users.map(async (user) => {
            const secretKey = otplib.authenticator.generateSecret();
            const userCredential = await UserCredential.findOne({ user_id: user.user_id });
            userCredential.secret_key = secretKey;
            await userCredential.save();
        }));
        return res.status(200).json({ message: 'Update secret key successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    registerForNewUser,
    DeactivateUser,
    ActivateUser,
    // checkUserInformation,
    changeUserRole,
    uploadImage,
    deleteUserByUserId,
    getAllUsers,
    updateUserInfo,
    updateSecretKey,
};