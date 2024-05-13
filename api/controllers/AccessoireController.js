import Accessoire from '../models/Accessoire.js'; 


const createAccessoire = async (req, res) => {
    try {
        const { nom, description, prix, type, image,quantite, status } = req.body;
      
        const newAccessoire = new Accessoire({
            nom,
            description,
            prix,
            quantite,
            type,
            image,
            status 
        });
      
        const savedAccessoire = await newAccessoire.save();
        console.log(savedAccessoire); // Log the saved Accessoire object
        res.status(201).json({ success: true, data: savedAccessoire });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


// Get all Accessoires
const getAllAccessoires = async (req, res) => {
    try {
        const accessoires = await Accessoire.find();
        res.status(200).json({ success: true, data: accessoires });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get single Accessoire by ID
const getAccessoireById = async (req, res) => {
    try {
        const accessoire = await Accessoire.findById(req.params.id);
        if (!accessoire) {
            return res.status(404).json({ success: false, error: 'Accessoire not found' });
        }
        res.status(200).json({ success: true, data: accessoire });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update Accessoire by ID
const updateAccessoire = async (req, res) => {
    try {
        const accessoire = await Accessoire.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!accessoire) {
            return res.status(404).json({ success: false, error: 'Accessoire not found' });
        }
        res.status(200).json({ success: true, data: accessoire });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete Accessoire by ID
const deleteAccessoire = async (req, res) => {
    try {
        const accessoire = await Accessoire.findByIdAndDelete(req.params.id);
        if (!accessoire) {
            return res.status(404).json({ success: false, error: 'Accessoire not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export { createAccessoire, getAllAccessoires, getAccessoireById, updateAccessoire, deleteAccessoire };
