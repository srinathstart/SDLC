import express from 'express';
import multer from 'multer';
import { Image } from '../models/imageModel.js';

const router = express.Router();

// Multer Storage (Memory Storage to handle images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Route to upload images
router.post('/upload', upload.array('images', 4), async (req, res) => {
  try {
    // Map through each image file in `req.files` and create a new image document for each one
    const images = req.files.map((file) => ({
      image: file.buffer,
      productid: req.body.productid
    }));

    // Insert all images into the database at once
    const savedImages = await Image.insertMany(images);

    // Return the IDs of uploaded images to the frontend
    res.status(200).json({
      message: 'Images uploaded successfully!',
      imageIds: savedImages.map((image) => image._id)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to upload images', error: err });
  }
});


// Route to get all the images of a user
router.get('/:productid', async (req, res) => {
  try {
    const images = await Image.find({ productid: req.params.productid });

    if (images.length === 0) { // Check if no images are found
      return res.status(404).json({ message: 'No images found for this user' });
    }

    const formattedimages = images.map(image => ({
      _id: image._id,
      contentType: image.contentType,
      base64Image: image.image.toString('base64'),
      productid: image.productid
    }));

    res.status(200).json(formattedimages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve images', error: err });
  }
});

router.delete('/delete/:productid', async (req, res) => {
  try {
    const images = await Image.find({ productid: req.params.productid });

    // Check if images exist, and delete them
    if (images.length > 0) {
      await Image.deleteMany({ productid: req.params.productid });
    }

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to Delete images', error: err });
  }
});


export default router;