import express from 'express';
import { getAllContacts, createContact,deleteContact } from '../controllers/ContactController.js';

const router = express.Router();

// GET all contacts
router.get('/contacts', getAllContacts);

// POST new contact
router.post('/contacts', createContact);
router.delete('/contacts/:id', deleteContact);

export default router;
