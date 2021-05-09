const express = require('express');
const router = express.Router();

// include CLOUDINARY:
const uploader = require('../configs/cloudinary.config');

router.post('/upload', uploader.single('imageUrl'), async (req, res, next) => {
  console.log('Upload route called!');
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  await res.json({ secure_url: req.file.path });
});

module.exports = router;
