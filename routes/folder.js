const { Router } = require('express');
const folderController = require('../controllers/folderController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const router = Router();

router.post('/create', ensureAuthenticated, folderController.createFolder);
router.post('/delete', ensureAuthenticated, folderController.deleteFolder);

module.exports = router;