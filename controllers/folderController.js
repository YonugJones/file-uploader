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

const deleteFolder = async (req, res) => {
  const { folderId } = req.body; 

  if (!folderId) {
    return res.status(400).json({ error: 'Folder ID is required.' });
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(folderId) },
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.authorId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this folder.' });
    }

    await prisma.folder.delete({
      where: { id: parseInt(folderId) },
    });

    res.status(200).json({ message: 'Folder successfully deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the folder.' });
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
  deleteFolder
};
