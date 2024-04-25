import Facture from '../models/FactureModel.js';

export const createFacture = async (req, res, next) => {
  try {
    const { client, products, total, date, livraison } = req.body;
    const numero = await Facture.getNextNumero();
    const newFacture = new Facture({
      numero, 
      client,
      products,
      total,
      date,
      livraison
    });
    const savedFacture = await newFacture.save();
    res.status(201).json(savedFacture);
  } catch (error) {

    next(error);
  }
};

export const getFactures = async (req, res, next) => {
  try {
    const factures = await Facture.find().populate('products');
    res.status(200).json(factures);
  } catch (error) {
    next(error);
  }
};


export const getFactureProductDetail = async (factureId) => {
  try {
    const facture = await Facture.findById(factureId);
    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    const productsWithDetails = [];
    for (const product of facture.products) {
      const productDetails = {
        name: product.name,
        hauteur: product.hauteur,
        largeur: product.largeur,
        quantite: product.quantite
      };
      productsWithDetails.push(productDetails);
    }
    return productsWithDetails;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des détails de la facture : ', error);
    return null;
  }
};

export const deleteFacture = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Facture.findByIdAndDelete(id);
    res.status(200).json({ message: 'Facture supprimée avec succès.' });
  } catch (error) {
    next(error);
  }
};

// Fonction pour modifier une facture
export const editFacture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { numero, client, produits, total, status } = req.body;
    const updatedFacture = await Facture.findByIdAndUpdate(
      id,
      { numero, client, produits, total, status },
      { new: true }
    );
    res.status(200).json(updatedFacture);
  } catch (error) {
    next(error);
  }
};
