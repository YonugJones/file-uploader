const passport = require('passport');

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
});

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res) => {
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

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/auth/login');
}