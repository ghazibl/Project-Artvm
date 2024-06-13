import Project from '../models/ProjectModel.js'; 

const createProject = async (req, res) => {
    try {
        const { nom, description, image } = req.body;
      
        const newProject = new Project({
            nom,
            description,
            image,
        });
      
        const savedProject = await newProject.save();
        console.log(savedProject); // Log the saved Project object
        res.status(201).json({ success: true, data: savedProject });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get all Projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get single Project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete Project by ID
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export { createProject, getAllProjects, getProjectById, deleteProject };
