import Devis from '../models/DevisModel.js';
import Commande from '../models/CommandeModel.js';
import ProductCart from '../models/ProduitCart.js';
export const createDevis = async (req, res) => {
  const { ProductInCart, DateCreation, PrixTotal,QuantiteTotals } = req.body;
  const user = req.user;

  try {
    if (!ProductInCart) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newDevis = new Devis({
      productCart: ProductInCart,
      client: user.userId,
      QuantiteTotals,
      DateCreation,
      PrixTotal,
      
    });

    const savedDevis = await newDevis.save();
    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      notificationService.emit('DevisCreated', {DevisId:savedDevis._id,username: user.username, profilePicture:user.profilePicture
        ,   target: 'admin', 
        type: 'devis'
      } );
    } else {
      console.error("NotificationService not found");
    }
    res.status(201).json(savedDevis);
  } catch (error) {
    console.error("Error creating devis:", error);
    res.status(400).json({ message: "Failed to create devis", error: error.message });
  }
};
export const confirmDevis = async (req, res) => {
  const { devisId } = req.params;

  try {
    // Find the devis by ID
    const devis = await Devis.findById(devisId).populate('productCart');

    if (!devis) {
      return res.status(404).json({ message: 'Devis not found' });
    }
    const newCommande = new Commande({
      productCart: devis.productCart,
      client: devis.client,
      devis: devis._id,
      QuentiteTotals: devis.productCart.length, // Assuming each productCart item counts as 1 quantity
      prixTotale: devis.PrixApresRemise || devis.PrixTotals,
      address: '', 
      phoneNumber: '', 
      livraison: false, 
      Date: new Date(),
      Status: 'En attente',
    });
    await newCommande.save();
    devis.status = 'confirmer';
    await devis.save();

    res.status(200).json({ message: 'Devis confirmed and commande created', commande: newCommande });
  } catch (error) {
    console.error('Error confirming devis:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateDevis = async (req, res) => {
  const { devisId } = req.params;
  const user = req.user;
  const { Remise, PrixApresRemise, DateLivraison,messageAdmin } = req.body;
  console.log('ID du devis:', devisId);
  console.log('Corps de la requête:', { Remise, PrixApresRemise, DateLivraison, messageAdmin });
  try {
    const updatedDevis = await Devis.findByIdAndUpdate(
      devisId,
      {
        $set: {
          Remise,
          PrixApresRemise,
          DateLivraison,
          messageAdmin,
          status: "confirmer",
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedDevis) {
      return res.status(404).json({ message: "Devis not found" });
    }
    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      notificationService.emit('DevisUpdated',updatedDevis  );
    } else {
      console.error("NotificationService not found");
    }
    res.status(200).json(updatedDevis);
  } catch (error) {
    console.error("Error updating devis:", error);
    res.status(400).json({ message: "Failed to update devis", error: error.message });
  }
};
export const GetDevisByUser = async (req, res) => {
  const user = req.user; // Extract user details from request
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const limit = parseInt(req.query.limit) || 100;
  try {
    // Compter tous les devis pour l'utilisateur
    const totalDevis = await Devis.countDocuments({ client: user.userId });

    // Récupérer uniquement les devis avec le statut "En attente" pour l'utilisateur
    const devisList = await Devis.find({ client: user.userId })
      .populate({
        path: "productCart",
        populate: {
          path: "product",
        },
      }).limit(limit);

    res.status(200).json({
      totalDevis,
      devisList
    });
  } catch (error) {
    console.error('Error fetching devis:', error);
    res.status(500).json({ message: 'Failed to fetch devis', error: error.message });
  }
};
export const updateDevisUser = async (req, res) => {
  const { devisId } = req.params;
  const { productCart } = req.body;

  try {
    
    for (const item of productCart) {
      const { _id, hauteur, largeur, quantite } = item;
      
      await ProductCart.findByIdAndUpdate(
        _id,
        { hauteur, largeur, quantite },
        { new: true }
      );
    }

    // Find and return the updated Devis
    const updatedDevis = await Devis.findById(devisId).populate('productCart');

    if (!updatedDevis) {
      return res.status(404).json({ message: 'Devis not found' });
    }

    res.status(200).json(updatedDevis);
  } catch (error) {
    console.error('Error updating devis:', error);
    res.status(500).json({ message: 'Failed to update devis', error: error.message });
  }
};

export const deleteDevis = async (req, res) => {
  const { devisId } = req.params;
  const user = req.user;

  try {
    // Vérifiez si le devis existe
    const existingDevis = await Devis.findById(devisId);
    if (!existingDevis) {
      return res.status(404).json({ message: "Devis not found" });
    }

    // Vérifiez si le devis appartient à l'utilisateur
    if (existingDevis.client.toString() !== user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Supprimer le devis
    await Devis.findByIdAndDelete(devisId);

    res.status(200).json({ message: "Devis deleted successfully" });
  } catch (error) {
    console.error("Error deleting devis:", error);
    res.status(400).json({ message: "Failed to delete devis", error: error.message });
  }
};
export const getAllDevis = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    // Retrieve devis with status 'En attente' with sorting and pagination
    const devis = await Devis.find() // Ensure status is lowercased
      .sort({ DateCreation: sortDirection }) // Ensure the field is 'DateCreation'
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'productCart',
        populate: {
          path: 'product',
        },
      })
      .populate('client');

    const totalDevis = await Devis.countDocuments();

    const now = new Date();
  
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Count the devis documents created within the last month with status 'En attente'
    const lastMonthDevis = await Devis.countDocuments({
      DateCreation: { $gte: oneMonthAgo },
      
    });

    res.status(200).json({
      devis,
      totalDevis,
      lastMonthDevis,
    });
  } catch (error) {
    next(error);
  }
};

export const getDevisById = async (req, res) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findById(id)
    .populate({
      path: "productCart",
      populate: {
        path: "product",
      },
    })
    .populate('client');
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



 
