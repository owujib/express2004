const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

/**
 * @param {objectId} _id object id of a database user
 */
const signToken = (id) => {
  return jwt.sign({ id: id }, 'our-secret', {
    expiresIn: '2d',
  });
};

/**
 * createResponseToken create token and sends response
 * @param {object} user mongoose user object
 * @param {number} statusCode response status code usually 200 or 201
 * @param {object} response express response object
 */
const createReponseToken = (user, statusCode, response) => {
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
    const comparePassword = await userExist.comparePassword(
      req.body.password,
      userExist.password
    );
    console.log(comparePassword);
    if (!comparePassword) {
      return next(new Error('password is incorrect'));
    }

    createReponseToken(userExist, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new Error('You are not logged in please log in to get access')
      );
    }
    //2) verification token
    const decoded = await promisify(jwt.verify)(token, 'our-secret');

    //3) check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new Error('the user belonging to the token does no longer exist')
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
