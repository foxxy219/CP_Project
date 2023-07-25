const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String },
  date_of_birth: { type: Date },
  gender: { type: String }, 
  profile_picture: { type: String }, 
  location: { type: String }, 
  contact_email: { type: String }, 
  contact_phone: { type: String }, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});



const User = mongoose.model('User', userSchema);

module.exports = User;
