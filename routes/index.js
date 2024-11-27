const { Router } = require('express');
const singleUpload = require('../middlewares/upload');

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.post('/upload', singleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

module.exports = router;