import Devis from '../models/DevisModel.js';

export const createDevis = async (req, res) => {
    const { Commande,  PrixTotals, Remise, PrixApresRemise, DateLivraison, Status } = req.body;
  
    try {
      if (!Commande ||  !PrixTotals || !PrixApresRemise || !DateLivraison ) {
        return res.status(400).json({ message: 'Toutes les données requises doivent être fournies' });
      }
  
      const devis = await Devis.create({
        Commande,
        PrixTotals,
        Remise,
        PrixApresRemise,
        DateLivraison,
        Status
      });
        res.status(201).json(devis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Get all Devis
export const getAllDevis = async (req, res) => {
  try {
    const devis = await Devis.find().populate("Commande");

    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Devis by ID
export const getDevisById = async (req, res) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findById(id);
    if (!devis) {
      return res.status(404).json({ message: 'Devis not found' });
    }
    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Devis by ID
export const updateDevisById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDevis = await Devis.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDevis) {
      return res.status(404).json({ message: 'Devis not found' });
    }
    res.status(200).json(updatedDevis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



 
