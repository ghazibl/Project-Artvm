import Commande from '../models/CommandeModel.js'; // Assurez-vous de pointer vers le bon chemin pour votre modèle Commande
import User from '../models/user.model.js';
import Cart from '../models/CartModel.js';

const createCommande = async (req, res) => {
  const { cart, client, QuentiteTotals, status } = req.body;

  try {
    const newCommande = new Commande({
      cart,
      client,
      QuentiteTotals,
      status
    });

    const savedCommande = await newCommande.save();

    res.status(201).json(savedCommande); // Répondre avec les données de la commande créée
  } catch (error) {
    res.status(400).json({ message: error.message }); // En cas d'erreur, répondre avec un message d'erreur
  }
};
export const getCommandesByUser = async (userId) => {
    try {
      const commandes = await Commande.find({ client: userId })
        .populate('client', 'username email ') // Add other fields as needed
        .populate('cart', 'product hauteur largeur quantite'); // Add other fields as needed
  
      return commandes;
    } catch (error) {
      throw new Error('Error fetching commandes');
    }
  };

const getAllCommands = async (req, res) => {
  try {
    const commandes = await Commande.find().populate({ 
        path: 'cart', 
        populate: { path: 'product' } 
      }).populate("client");
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommandeById = async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findById(id).populate({ 
        path: 'cart', 
        populate: { path: 'product' } 
      }).populate("client");
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCommande = async (req, res) => {
  const { id } = req.params;
  const { cart, client, quantiteTotale, status } = req.body;

  try {
    const updatedCommande = await Commande.findByIdAndUpdate(id, { cart, client, quantiteTotale, status }, { new: true });
    if (!updatedCommande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json(updatedCommande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour supprimer une commande
const deleteCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCommande = await Commande.findByIdAndRemove(id);
    if (!deletedCommande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createCommande,getAllCommands, getCommandeById, updateCommande, deleteCommande };
