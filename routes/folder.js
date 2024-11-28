const { Router } = require('express');
const prisma = require('../db/prisma');
const router = Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Folder name required' });
  }

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        authorId: req.user.id
      },
    });

    res.status(201).json({ message: 'Folder created successfully', folder })
  } catch (err) {
    console.error('Error creating folder', err);
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;