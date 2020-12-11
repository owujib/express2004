const multer = require('multer');
const User = require('../models/User');
const { fileUploadStream } = require('../utils/helpers');

exports.getProfile = () => {};

const upload = multer().single('profileImg');

exports.uploadProfileImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) next(err);

    const { file, body } = req;

    /**validate file */
    if (
      file.detectedFileExtension !== '.jpg' &&
      file.detectedFileExtension !== '.png'
    ) {
      return next(
        new Error('invalid file type only jpg and png file supported')
      );
    }
    const filename = `${Date.now()}-${file.originalName}`;

    const uploadFile = await fileUploadStream(file, `./uploads/${filename}`);
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { profileImg: filename },
      { new: true }
    );
    res.status(201).json({
      status: 'success',
      message: user,
    });
  });
};
