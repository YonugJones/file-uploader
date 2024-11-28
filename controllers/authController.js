const passport = require('passport');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');

const getLogin = (req, res) => {
  res.render('login');
};

const postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
});

const getSignup = (req, res) => {
  res.render('signup');
};

const postSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/signup');
  }
};

const logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
      })
    })
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout
}