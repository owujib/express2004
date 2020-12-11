const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

//register route
router.post('/register', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      status: 'success',
      message: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    //check if the user exist
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      return next(new Error('sorry there is no record for this user'));
    }
    //check for user password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      userExist.password
    );
    if (!comparePassword) {
      return next(new Error('password is incorrect'));
    }
    //login user in
    res.status(200).json({
      status: 'success',
      message: userExist,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
