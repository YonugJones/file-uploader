const { Router } = require('express');
const folderController = require('../controllers/folderController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const router = Router();

router.post('/create', ensureAuthenticated, folderController.createFolder)

module.exports = router;