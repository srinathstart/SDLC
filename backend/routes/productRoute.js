import express from 'express';
import multer from 'multer';
import { ProductInfo } from '../models/productInfoModel.js';


const router = express.Router();

// Multer Storage (Memory Storage to handle images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Product Route
router.post('/upload', upload.single('previmage'), async (req, res) => {
  
  try {
    const newProduct = new ProductInfo({
      productName: req.body.productName,
      description: req.body.description,
      cost: req.body.cost,
      userid: req.body.userid,
      previmage: req.file.buffer,
      category:req.body.category,
    });

    const savedProduct = await newProduct.save();  // Save the image

    // Return the product ID to the frontend
    res.status(200).json({ message: 'Product uploaded successfully!', productid: savedProduct._id });
  } catch (err) {
    console.error('Error during product upload:', err);  // Detailed log of the error
    res.status(500).json({ message: 'Failed to upload image', error: err.stack });
  }
});


// Route to view product details
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductInfo.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const formattedProduct = {
      _id: product._id,
      productName: product.productName,
      contentType: product.contentType,
      base64Image: product.previmage.toString('base64'),
      description: product.description,
      cost:product.cost,
      userid:product.userid,
      category:product.category,
    };
    res.status(200).json(formattedProduct); 
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving image', error: err });
  }
});


// Route to Retrieve All Uploaded Products with Base64 encoding
router.get('/get/images', async (req, res) => {
  try {
    const products = await ProductInfo.find().sort({ createdAt: -1 });
    
    // Map the products to format them as needed
    const formattedProducts = products.map(product => ({
      id: product._id,
      productName: product.productName,
      contentType: product.contentType,
      previmage: product.previmage.toString('base64'),  // Assuming 'image' is a Buffer
      description: product.description,
      cost: product.cost,
      userid: product.userid,
      category: product.category,
    }));

    res.status(200).json(formattedProducts);  // Return the formatted products array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve Products', error: err });
  }
});


// Route to get all the images of a user
router.get('/uploads/:userid', async (req, res) => {
  try {
    const products = await ProductInfo.find({ userid: req.params.userid }).sort({ createdAt: -1 }); 
    
    if (products.length === 0) { // Check if no images are found
      return res.status(404).json({ message: 'No Products found for this user' });
    }

    const formattedProducts = products.map(product=>({
        id: product._id,
        productName: product.productName,
        contentType: product.contentType,
        previmage: product.previmage.toString('base64'),
        description: product.description,
        cost:product.cost,
        userid:product.userid,
        category:product.category,
      }));

    res.status(200).json(formattedProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to retrieve Products', error: err });
  }
});


router.delete('/delete/:id',async(req,res) =>{
  const id=req.params.id;
  
  try {
    const product = await ProductInfo.findByIdAndDelete(id); 
    
    if (product.length === 0) { // Check if no images are found
      return res.status(404).json({ message: 'No Products found for this user' });
    }

    res.status(200).json({ message: 'Deleted product'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to Delete Product', error: err });
  }
})





export default router;