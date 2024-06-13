import Facture from '../models/FactureModel.js';
import mongoose from 'mongoose';
import Commande from '../models/CommandeModel.js';
import Product from '../models/ProductModel.js';

export const createFacture = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  
  try {
    const { commande, TVA, montantHT, montantTTC, remise, fraisLivraison } = req.body;

    const fetchedCommande = await Commande.findById(commande).populate('productCart').exec();
    if (!fetchedCommande) {
      throw new Error('Commande not found');
    }
    const modifiedQuantities = [];
    const productUpdates = fetchedCommande.productCart.map(async (item) => {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }
      let quantityToReduce = item.quantite;
      if (product.type === 'product') {
        quantityToReduce = item.hauteur * item.largeur * item.quantite;
      }
      if (product.quantite < quantityToReduce) {
        throw new Error(`Not enough stock for product ${product.nom}`);
      }
      product.quantite -= quantityToReduce;
      modifiedQuantities.push({ productName: product.nom, quantityReduced: quantityToReduce });
      await product.save({ session });
    });

    await Promise.all(productUpdates);

    const nextNumero = await Facture.getNextNumero();
    const newFacture = new Facture({
      commande,
      numero: nextNumero,
      TVA,
      montantHT,
      montantTTC,
      remise,
      fraisLivraison,
    });

    const savedFacture = await newFacture.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      notificationService.emit('FactureCreated', savedFacture  );
    } else {
      console.error("NotificationService not found");
    }

    res.status(201).json({ savedFacture, modifiedQuantities });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const getAllFacture = async (req, res) => {
  try {
    const factures = await Facture.find().populate({
      path: 'commande',
      populate: [
        { path: 'productCart', populate: { path: 'product' } },
        { path: 'client' }
      ]
    });
    res.status(200).json(factures);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFactureById = async (req, res) => {
  const { id } = req.params;
  try {
    const facture = await Facture.findById(id).populate('commande'); // Assuming 'commande' is a reference
    if (!facture) {
      return res.status(404).json({ message: 'Facture not found' });
    }
    res.status(200).json(facture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getFactureByUser = async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  try {
    console.log('Received userId:', userId);
    const factures = await Facture.find().populate({
      path: 'commande',
      populate: [
        {
          path: 'client',
          model: 'User'
        },
        {
          path: 'productCart',
          populate: {
            path: 'product',
            model: 'Product'
          }
        }
      ]
    }).limit(limit);

    // Filter out factures where commande.client didn't match
    const filteredFactures = factures.filter(facture => facture.commande && facture.commande.client && facture.commande.client._id.toString() === userId);

    console.log('Filtered factures:', filteredFactures);
    const facturesCount = filteredFactures.length;

    if (!facturesCount) {
      return res.status(404).json({ message: 'No factures found for this user' });
    }

    res.status(200).json({ factures: filteredFactures, facturesCount });
  } catch (error) {
    console.error('Error fetching factures:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateFacture = async (req, res) => {
  const factureId = req.params.id;
  const { prixRestant } = req.body;

  try {
    const updatedFacture = await Facture.findByIdAndUpdate(
      factureId,
      { prixRestant },
      { new: true, runValidators: true }
    );

    if (!updatedFacture) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.status(200).json(updatedFacture);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};