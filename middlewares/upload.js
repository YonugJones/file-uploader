const multer = require('multer');
const path = require('node:path');

const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
});

module.exports = {
  singleUpload: upload.single('file'),
  multiUpload: upload.array('files', 12),
  fieldsUpload: upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 }
  ]),
};