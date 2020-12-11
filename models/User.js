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
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
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

/**encript users password before saving them */
userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    return this.password;
  } catch (error) {
    next(error);
  }
});

/**
 * @param {string} inputPassword the password from request body
 * @param {string} userPassword the existing user password from the database
 */
userSchema.methods.comparePassword = async function (
  inputPassword,
  userPassword
) {
  const compare = await bcrypt.compare(inputPassword, userPassword);
  return compare;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
