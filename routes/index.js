const { Router } = require('express');
const { singleUpload, multiUpload, fieldsUpload } = require('../middlewares/upload');

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

router.post('/uploads', multiUpload, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.')
  }
  res.send(`Files uploaded successfully: ${req.files.map(file => file.filename).join(', ')}`);
});

router.post('/profile', fieldsUpload, (req, res) => {
  const avatar = req.files.avatar ? req.files.avatar[0].filename : null;  
  const gallery = req.files.gallery ? req.files.gallery.map(file => file.filename) : [];
  res.send(`Uploaded avatar: ${avatar}, gallery: ${gallery.join(', ')}`); 
})

module.exports = router;