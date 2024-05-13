import express from 'express';
import { addToCart} from '../controllers/CartController.js';

const router = express.Router();

router.post('/:userId/add', addToCart);

export default router;
