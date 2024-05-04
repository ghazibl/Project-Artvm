import express from 'express';
import { createCartItem,getCartItems } from '../controllers/CartController.js';

const router = express.Router();

router.post('/', createCartItem);
router.get('/', getCartItems);

export default router;
