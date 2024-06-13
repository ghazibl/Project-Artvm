import express from 'express';
import { createDevis, getAllDevis, getDevisById,GetDevisByUser,updateDevis,confirmDevis,updateDevisUser, deleteDevis} from '../controllers/DevisController.js';
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/create',verifyToken, createDevis);

router.get('/', getAllDevis);
router.get('/getDevisByUser', verifyToken,GetDevisByUser);
router.get('/devi/:id',getDevisById);
router.put('/devi/:devisId',updateDevis);
router.put('/confirm/:devisId', confirmDevis);
router.put('/:devisId', verifyToken, updateDevisUser);
router.delete('/:devisId', verifyToken, deleteDevis);


export default router;
