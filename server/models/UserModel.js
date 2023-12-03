const { number, string } = require("joi");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String },
  date_of_birth: { type: Date },
  gender: { type: String },
  profile_picture: { type: String },
  location: { type: String },
  gender: { type: String, default: "Male" },
  contact_email: { type: String },
  contact_phone: { type: String },
  role: { type: String, default: "user" },
  isOnline: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  credential_id: { type: Number, default: "" },
},
{
  timestamps: true,
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
