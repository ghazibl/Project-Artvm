import express from 'express';
import {
  createCommande,
  getCommandeById,
  updateCommande,
  deleteCommande,
  getCommandesByUser,
  getAllCommands
} from '../controllers/CommandController.js'; 

const router = express.Router();


router.post('/create', createCommande);
//router.get('/:userId', getCommandesByUser);


router.get('/commandes/:id', getCommandeById);
router.get('/ss', getAllCommands);

// Route pour mettre à jour une commande
router.put('/commandes/:id', updateCommande);

// Route pour supprimer une commande
router.delete('/commandes/:id', deleteCommande);

export default router;
