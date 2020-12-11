const express = require('express');
const {
  register,
  login,
  isAuthenticated,
} = require('../controller/auth.controller');
const User = require('../models/User');

const router = express.Router();

//register route
router.post('/register', register);

router.post('/login', login);

router.use(isAuthenticated);

router.get('/profile', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: req.user,
  });
});

module.exports = router;
