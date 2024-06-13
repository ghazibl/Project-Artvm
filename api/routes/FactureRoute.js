import express from 'express';
import {
  createFacture, getAllFacture,getFactureById,getFactureByUser,updateFacture
  

} from '../controllers/FactureController.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/', createFacture); 
router.get('/', getAllFacture); 
router.get('/:id', getFactureById);
router.get('/user/:userId',verifyToken, getFactureByUser);
router.put('/:id', updateFacture);



export default router;
