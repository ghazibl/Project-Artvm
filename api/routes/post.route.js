import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

// Route pour créer une nouvelle publication
router.post('/', createPost);

// Route pour obtenir toutes les publications
router.get('/',verifyToken, getAllPosts);

// Route pour obtenir une publication par son ID
router.get('/:postId', getPostById);

// Route pour mettre à jour une publication par son ID
router.put('/:postId', updatePostById);

// Route pour supprimer une publication par son ID
router.delete('/:postId', deletePostById);

export default router;
