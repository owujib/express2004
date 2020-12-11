const fs = require('fs');

exports.fileUploadStream = async (file, dirPath) => {
  try {
    if (file.detectedFileExtension != '.jpg')
      next(new Error('invalid file type'));

    const filename = `${Date.now()}-${file.originalName}`;

    await pipeline(file.stream, fs.createWriteStream(dirPath));
    return {
      path: dirPath,
      filename,
    };
  } catch (error) {
    next(error);
  }
};

// `./public/uploads/${filename}`
