import express from 'express';
import { google, signin, signup,verifyUser } from '../controllers/auth.controller.js';


const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)
router.post('/confirm/:activationcode', verifyUser);
export default router;