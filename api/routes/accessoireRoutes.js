import express from 'express';
import {
    createAccessoire,
    getAllAccessoires,
    getAccessoireById,
    updateAccessoire,
    deleteAccessoire
} from '../controllers/AccessoireController.js';

const router = express.Router();

// Routes
router.post('/', createAccessoire); // Create a new Accessoire
router.get('/', getAllAccessoires); // Get all Accessoires
router.get('/:id', getAccessoireById); // Get single Accessoire by ID
router.put('/:id', updateAccessoire); // Update Accessoire by ID
router.delete('/:id', deleteAccessoire); // Delete Accessoire by ID

export default router;