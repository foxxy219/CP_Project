const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const uploadImage = async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'ml_default',
        });
        console.log(uploadResponse);
        uploadResponse.secure_url = uploadResponse.secure_url.replace('upload/', 'upload/w_200,h_200,c_crop,g_face,r_max/w_200/');
        return res.status(200).send(uploadResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};
module.exports = { uploadImage };