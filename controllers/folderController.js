const prisma = require('../db/prisma');

const createFolder = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Folder name required' });
  }

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        authorId: req.user.id,
      },
    });
    res.status(201).json({ message: 'Folder successfully created', folder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the folder' });
  }
};

const displayFolders = async (req) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { authorId: req.user.id },
    });
    return folders;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to fetch folders');
  }
};

module.exports = {
  createFolder,
  displayFolders,
};
