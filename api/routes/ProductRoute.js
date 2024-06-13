import express from 'express';
import { createProduct,getProductById, getProduct, findProductByName,updateProduct,
    getQuantiteProduitParCategoties,createProductAchat,getProductAchat 
    ,getAccessories,getByProduct,getAccessById} from '../controllers/ProductController.js';

const router = express.Router();


router.post('/',  createProduct);
router.get("/", getProduct);
router.get("/prod", getByProduct);
router.get("/acces", getAccessories);
router.get("/getAchat", getProductAchat);
router.get("/:productId", getProductById);
router.get("/:accessId", getAccessById);
router.get('/product', findProductByName);
router.put('/product/:productId', updateProduct);
router.get('/categories/quantities', getQuantiteProduitParCategoties);
router.post('/addProduct', createProductAchat);
getAccessories

export default router;