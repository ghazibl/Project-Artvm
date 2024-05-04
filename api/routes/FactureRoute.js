import express from 'express';
import {
  createFacture,
  deleteFacture ,
  updateFacture ,
  getFactures,
  

} from '../controllers/FactureController.js';

const router = express.Router();

router.post('/create',  createFacture);
router.get('/', getFactures);

router.put('/:factureId',  updateFacture);
router.delete('/:factureId', deleteFacture);


export default router;
