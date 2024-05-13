import express from 'express';
import {
  createCommande,
  getCommandeById,
  updateCommande,
  deleteCommande,
  updateCommandStatus,
  setStatusRefuser,
  setStatusConfirme,
  getAllCommands
} from '../controllers/CommandController.js'; 

const router = express.Router();


router.post('/create', createCommande);
//router.get('/:userId', getCommandesByUser);


router.get('/commandes/:id', getCommandeById);
router.get('/getAll', getAllCommands);

// Route pour mettre à jour une commande
router.put('/commandes/:id', updateCommande);
router.put('/commandes/:id', updateCommandStatus);
router.put('/confirm/:id', setStatusConfirme);

// Route for setting command status to "refusé"
router.put('/refuse/:id', setStatusRefuser);
// Route pour supprimer une commande
router.delete('/commandes/:id', deleteCommande);

export default router;
