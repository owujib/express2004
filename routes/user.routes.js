const express = require('express');
const multer = require('multer');
const {
  register,
  login,
  isAuthenticated,
} = require('../controller/auth.controller');
const User = require('../models/User');
const { fileUploadStream } = require('../utils/helpers');

const router = express.Router();

//register route
router.post('/register', register);

router.post('/login', login);

// router.use(isAuthenticated);

router.get('/profile', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: req.user,
  });
});

const upload = multer();

router.post('/upload', upload.single('file'), async function (req, res, next) {
  try {
    const { file } = req;
    if (file.detectedFileExtension != '.jpg')
      next(new Error('invalid file type'));

    const filename = `${Date.now()}-${file.originalName}`;

    const uploadedFile = await fileUploadStream(file, `./uploads/${filename}`);
    if (!uploadedFile) {
      console.log('err');
    }
    // res.send('file uploaded');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
