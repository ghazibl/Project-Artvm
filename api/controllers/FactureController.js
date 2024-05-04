import Facture from '../models/FactureModel.js';



export const createFacture = async (req, res) => {
  const { commande, total, date, livraison } = req.body;

  try {
    const nextNumero = await Facture.getNextNumero(); // Obtenez le prochain numéro de facture
    const newFacture = new Facture({
      commande,
      numero: nextNumero,
      total,
      date,
      livraison
    });
    const savedFacture = await newFacture.save();
    res.status(201).json(savedFacture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFactures = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (facture) {
      res.status(200).json(facture);
    } else {
      res.status(404).json({ message: "Facture not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFacture = async (req, res) => {
  const { commande, total, date, livraison } = req.body;

  try {
    const facture = await Facture.findById(req.params.id);
    if (facture) {
      facture.commande = commande;
      facture.total = total;
      facture.date = date;
      facture.livraison = livraison;
      
      const updatedFacture = await facture.save();
      res.status(200).json(updatedFacture);
    } else {
      res.status(404).json({ message: "Facture not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteFacture = async (req, res, next) => {
  const { factureId } = req.params; // Supposons que l'ID de la facture soit passé en tant que paramètre d'URL
  try {
    const facture = await Facture.findByIdAndDelete(factureId);
    if (!facture) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }
    res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la suppression de la facture : ', error);
    next(error);
  }
};




