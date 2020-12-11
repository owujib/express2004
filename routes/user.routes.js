const express = require('express');
const bcrypt = require('bcryptjs');
const {
  register,
  login,
  Authorization,
} = require('../controller/auth.controller');
const { uploadProfileImage } = require('../controller/user.controller');
const router = express.Router();

//register route
router.post('/register', register);

router.post('/login', login);

router.use(Authorization);

router.patch('/upload/profile', uploadProfileImage);

router.get('/profile', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: req.user,
  });
});

module.exports = router;
