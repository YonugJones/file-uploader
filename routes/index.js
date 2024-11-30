const { Router } = require('express');
const folderController = require('../controllers/folderController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const singleUpload = require('../middlewares/upload');

const router = Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const folders = await folderController.displayFolders(req);
    res.render('index', { user: req.user, folders });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while loading folders.');
  }
});

router.post('/upload', singleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

module.exports = router;