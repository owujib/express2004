const express = require('express');

const router = express.Router();

//register route
router.post('/register', (req, res, next) => {
  res.json({
    status: 'success',
    message: req.body,
  });
});

module.exports = router;
