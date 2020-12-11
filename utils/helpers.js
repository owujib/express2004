const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

/**
 *
 * @param {object} file file object from request object
 * @param {string} dirPath path to store image /dirPath/filename
 */
exports.fileUploadStream = async (file, dirPath) => {
  // const filename = `${Date.now()}-${file.originalName}`;

  await pipeline(file.stream, fs.createWriteStream(dirPath));
  return {
    path: dirPath,
    message: 'usess',
  };
};

// `./public/uploads/${filename}`
