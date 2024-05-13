import express from 'express';
import { createDevis, getAllDevis, getDevisById } from '../controllers/DevisController.js';

const router = express.Router();

router.post('/create', createDevis);

router.get('/', getAllDevis);

router.get('/:id', getDevisById);




export default router;
