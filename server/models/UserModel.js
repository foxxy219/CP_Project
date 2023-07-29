const { number, string } = require('joi');
const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   full_name: { type: String },
//   date_of_birth: { type: Date },
//   gender: { type: String }, 
//   profile_picture: { type: String }, 
//   location: { type: String }, 
//   contact_email: { type: String }, 
//   contact_phone: { type: String }, 
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, require: true },
    password: { type: String, required: true, default: '' },
    online: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
      require: false,
    },
    cmnd: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      deafault: '',
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: Date,
      defautlt: new Date(),
    },
    socketId: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
    },
    date_of_birth: {
      type: Date,
      default: Date.now,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: string,
      default: '',
      generate: 'uuid',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
