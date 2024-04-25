import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createFacture,
  deleteFacture ,
  editFacture ,
  getFactures,
  getFactureProductDetail,
} from '../controllers/FactureController.js';

const router = express.Router();

router.post('/create',  createFacture);
router.get('/getFactures', getFactures);
router.get('/getDetail/:factureId', async (req, res) => {
  const { factureId } = req.params;
  const productsDetail = await getFactureProductDetail(factureId); // Appel de la fonction pour obtenir les détails des produits de la facture
  res.json(productsDetail);
});
router.put('/editFacture/:factureId',  editFacture);
router.delete('/deleteFacture/:factureId',  deleteFacture);


export default router;
