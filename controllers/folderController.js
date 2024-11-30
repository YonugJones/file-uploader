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

const getFolderFiles = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(folderId) },
      include: { files: true },
    });

    if (!folder || folder.authorId !== req.user.id) {
      return res.status(404).send('Folder not found or not accessible.');
    }

    res.render('folder', { folder, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching folder files.');
  }
};

const uploadFile = async (req, res) => {
  const { folderId } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  if (!folderId) {
    return res.status(400).send('Folder ID is required.');
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(folderId) },
    });

    if (!folder || folder.authorId !== req.user.id) {
      return res.status(404).send('Folder not found or not accessible.');
    }

    const file = await prisma.file.create({
      data: {
        name: req.file.filename,
        folderId: parseInt(folderId),
        authorId: req.user.id,
      },
    });

    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while uploading the file.');
  }
};

module.exports = {
  createFolder,
  displayFolders,
  deleteFolder,
  getFolderFiles,
  uploadFile
};
