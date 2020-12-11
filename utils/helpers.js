const fs = require('fs');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

/**
 * @param {string} stream stream from file
 * @param {string} dirPath this is a path in your root dir ./dirPath/filename
 */
exports.fileUploadStream = async (file, dirPath) => {
  await pipeline(file.stream, fs.createWriteStream(dirPath));
  return {
    path: dirPath,
    message: true,
  };
};
