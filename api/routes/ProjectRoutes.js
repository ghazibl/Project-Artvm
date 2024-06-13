import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    
    deleteProject
} from '../controllers/ProjectController.js';

const router = express.Router();

// Routes
router.post('/', createProject); // Create a new Project
router.get('/', getAllProjects); // Get all Projects
router.get('/:id', getProjectById); // Get single Project by ID

router.delete('/:id', deleteProject); // Delete Project by ID

export default router;