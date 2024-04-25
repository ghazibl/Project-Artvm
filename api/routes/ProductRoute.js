import express from 'express';
import { createProduct, getProduct, findProductByName,updateProduct } from '../controllers/ProductController.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();


router.post('/',  createProduct);
router.get("/", getProduct);
router.get('/product', findProductByName);
router.post('/product/:productId', updateProduct);

export default router;