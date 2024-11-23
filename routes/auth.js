const { Router } = require('express');
const router = Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);

router.post('/signup',
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', { errors: errors.array() });
    }
    next();
  },
  authController.postSignup
);


router.get('/logout', authController.logout);

module.exports = router;