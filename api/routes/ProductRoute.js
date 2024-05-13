import express from 'express';
import { createProduct,getProductById, getProduct, findProductByName,updateProduct } from '../controllers/ProductController.js';

const router = express.Router();


router.post('/',  createProduct);
router.get("/", getProduct);
router.get("/:productId", getProductById);
router.get('/product', findProductByName);
router.put('/product/:productId', updateProduct);

export default router;