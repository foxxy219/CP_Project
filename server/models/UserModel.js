const { number, string } = require("joi");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

// const UserSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true },
//     email: { type: String, require: true },
//     password: { type: String, required: true, default: "" },
//     online: { type: Boolean, default: false },
//     avatar: { type: String, default: "", require: false },
//     credentialid: { type: number, default: "" },
//     address: { type: String, default: "" },
//     phoneNumber: { type: number, deafault: "" },
//     isActivated: { type: Boolean, default: false },
//     startTime: { type: Date, defautlt: new Date() },
//     isDeleted: { type: Boolean, default: false },
//     role: { type: String, default: "user" },
//     date_of_birth: { type: Date, default: Date.now },
//     userId: { type: string, default: "", generate: "uuid" },
//   },
//   {
//     timestamps: true,
//   }
// );

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
