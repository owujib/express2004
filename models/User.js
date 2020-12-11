const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 20,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    console.log(this.password);
    return this.password;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  inputPassdword,
  userPassword
) {
  await bcrypt.compare(inputPassdword, userPassword);
  return;
};
module.exports = User;
