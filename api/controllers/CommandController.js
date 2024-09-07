import Commande from "../models/CommandeModel.js";
import ProductCart from "../models/ProduitCart.js";
import User from "../models/user.model.js";
const updateCommande = async (req, res) => {
  const { id } = req.params;
  const { productCart, client, devis, QuentiteTotals, prixTotale, address, phoneNumber, livraison, Status } = req.body;

  try {
    // Mettre à jour les éléments du panier de produits
    for (const productCartItem of productCart) {
      if (productCartItem._id) {
        // Mettre à jour les éléments existants
        await ProductCart.findByIdAndUpdate(productCartItem._id, productCartItem);
      } else {
        // Ajouter de nouveaux éléments au panier de produits
        const newProductCartItem = new ProductCart(productCartItem);
        await newProductCartItem.save();
        // Ajouter l'ID du nouvel élément au tableau productCart de la commande
        productCartItem._id = newProductCartItem._id;
      }
    }

    // Mettre à jour la commande
    const updatedCommande = await Commande.findByIdAndUpdate(
      id,
      {
        productCart: productCart.map(item => item._id),
        client,
        devis,
        QuentiteTotals,
        prixTotale,
        address,
        phoneNumber,
        livraison,
        Status
      },
      { new: true }
    ).populate('productCart').populate('client').populate('devis');

    if (!updatedCommande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(updatedCommande);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error });
  }
};

const createCommande = async (req, res) => {
  const { ProductInCart, QuentiteTotals, prixTotale, livraison, status } = req.body;
  const user = req.user;

  try {
    if (!ProductInCart || !QuentiteTotals || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCommande = new Commande({
      productCart: ProductInCart,
      client: user.userId,
      QuentiteTotals,
      prixTotale,
      livraison,
      status,
    });

    const savedCommande = await newCommande.save();

    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      notificationService.emit('commandeCreated', {
        commandeId: savedCommande._id,
        UserId: user.userId,
        username: user.username,
        profilePicture: user.profilePicture,
        target: 'admin', // Notification pour les administrateurs
        type: 'commande'
      });
    } else {
      console.error("NotificationService not found");
    }

    res.status(201).json(savedCommande);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Failed to create order", error: error.message });
  }
};

export const getCommandesByUser = async (req, res) => {
  try {
    const user = req.user;
    const limit = parseInt(req.query.limit) || 100; // Parse limit from query parameters, default to 100 if not provided
    console.log("user", user);

    const totalCommandes = await Commande.countDocuments({ client: user.userId });

    const commandes = await Commande.find({ client: user.userId })
      .populate({
        path: "productCart",
        populate: {
          path: "client",
        },
        populate: {
          path: "product",
        },
      })
      .limit(limit); 

    res.status(200).json({
      totalCommandes,
      commandes
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCommands = async (req, res) => {
  try {
    const commandes = await Commande.find()
    .populate({
      path: "productCart",
     
      populate: {
        path: "product",
      },
    })
    .populate({ path: "client"});
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 

const getCommandes = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const commandes = await Commande.find()
      .sort({ Date: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'productCart',
        populate: {
          path: 'product',
          
        },
        
      })
      .populate('client');

    const totalCommandes = await Commande.countDocuments();

    const now = new Date();


    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthCommandes = await Commande.countDocuments({
      Date: { $gte: oneMonthAgo },
      
    });

    res.status(200).json({
      commandes,
      totalCommandes,
      lastMonthCommandes,
    });
  } catch (error) {
    next(error);
  }
};

const getCommndeEnAttente = async (req, res) => {
  try {
    const commandes = await Commande.find({ Status: "En attente" })
      .populate({
        path: "productCart",
        populate: {
          path: "product",
        },
      })
      .populate({ path: "client" });
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCommandById = async (req, res) => {
  const { id } = req.params;

  try {
    const commande = await Commande.findById(id)
      .populate({
        path: 'productCart',
        populate: {
          path: 'product',
        },
      })
      .populate({ path: 'client' });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCommande = await Commande.findByIdAndDelete(id);
    if (!deletedCommande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCommandStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  console.log(id);
  console.log(newStatus);
  try {
    // Update the command status
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: newStatus },
      { new: true }
    ).lean();

    if (!updatedCommand) {
      return res
        .status(404)
        .json({ success: false, message: "Command not found" });
    }

    res.status(200).json({
      success: true,
      message: "Command status updated successfully",
      command: updatedCommand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update command status",
      error: error.message,
    });
  }
};
const setStatusConfirme = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Mettre à jour le statut de la commande en "confirmé"
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: "confirmé" },
      { new: true }
    ).populate('client').lean();

    if (!updatedCommand) {
      return res.status(404).json({ success: false, message: "Command not found" });
    }

    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      // Envoyer la notification
      notificationService.emit('commandeConfirmée', {
        commandeId: updatedCommand._id,
        UserId: updatedCommand.client._id,  // Assurez-vous que client._id est l'ID de l'utilisateur
        target: 'user', // Notification pour l'utilisateur
        type: 'commande'
      });
    } else {
      console.error("NotificationService not found");
    }

    // Répondre avec succès
    res.status(200).json({
      success: true,
      message: 'Command status updated to "confirmé"',
      command: updatedCommand,
    });
  } catch (error) {
    // Gérer les erreurs
    console.error('Failed to update command status to "confirmé":', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update command status to "confirmé"',
      error: error.message,
    });
  }
};

const setStatusRefuser = async (req, res) => {
  const { id } = req.params;
  try {
    // Update command status to "refusé"
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: "refusé" },
      { new: true }
    ).lean();
    if (!updatedCommand) {
      return res
        .status(404)
        .json({ success: false, message: "Command not found" });
    }
    res.status(200).json({
      success: true,
      message: 'Command status updated to "refusé"',
      command: updatedCommand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update command status to "refusé"',
      error: error.message,
    });
  }
};
export {
  createCommande,
  getAllCommands,
  updateCommandStatus,
  setStatusRefuser,
  setStatusConfirme,
  getCommndeEnAttente,
  getCommandById,
  deleteCommande,
  getCommandes,
  updateCommande,
};