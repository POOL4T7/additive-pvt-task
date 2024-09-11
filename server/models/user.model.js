const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String },
    mobile: { type: String },
    email: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'] },
    password: { type: String, required: true },
    profile: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
