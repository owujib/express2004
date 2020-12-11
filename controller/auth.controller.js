const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();
const User = require('../models/User');

/**
 * @param {objectId} _id   the objectId of a user
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

/**
 * @param {object} ObjectId mongoose user object
 * @param {number} statusCode http status code usuall 200 or 201
 * @param {object} response server response object
 */
const createResponseToken = (user, statusCode, response) => {
  const token = signToken(user._id);

  response.status(statusCode).json({
    status: 'success',
    token,
    message: user,
  });
};

exports.register = async (req, res, next) => {
  try {
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({
      status: 'success',
      message: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    //check if the user exist
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      return next(new Error('sorry there is no record for this user'));
    }
    //check for user password
    const comparePassword = userExist.comparePassword(
      req.body.password,
      userExist.password
    );
    if (!comparePassword) {
      return next(new Error('password is incorrect'));
    }
    //login user in
    createResponseToken(userExist, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.Authorization = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    next(new Error('You are not logged in please login to get access'));
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById({ _id: decoded.id });
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
