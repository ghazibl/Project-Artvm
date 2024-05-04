import Cart from '../models/CartModel.js'; // Assurez-vous de pointer vers le bon chemin pour votre modèle Cart

// Contrôleur pour créer un nouvel article dans le panier
export const createCartItem = async (req, res) => {
  const { product, hauteur, largeur, quantite } = req.body;

  try {
    // Créer une nouvelle instance de Cart avec les données fournies
    const newItem = new Cart({
      product,
      hauteur,
      largeur,
      quantite
    });
        console.log(product);
    // Enregistrer l'article dans la base de données
    const savedItem = await newItem.save();

    res.status(201).json(savedItem); // Répondre avec les données de l'article créé
  } catch (error) {
    res.status(400).json({ message: error.message }); // En cas d'erreur, répondre avec un message d'erreur
  }
};

export const getCartItems = async (req, res) => {
    try {
      const cartItems = await Cart.find();
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Contrôleur pour supprimer un article du panier
 export const deleteCartItem = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItem = await Cart.findByIdAndRemove(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Article non trouvé dans le panier' });
      }
      res.status(200).json({ message: 'Article supprimé du panier avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

