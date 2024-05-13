

import Cart from '../models/CartModel.js';
import ProductCart from '../models/ProduitCart.js';

// Contrôleur pour ajouter un produit au panier
export const addToCart = async (req, res) => {
  try {
    const { productId, hauteur, largeur, quantite } = req.body;
    const { userId } = req.params;

    // Créer un nouveau produit de panier
    const productCart = new ProductCart({
      product: productId,
      hauteur,
      largeur,
      quantite,
    });
    await productCart.save();

    // Trouver ou créer un panier pour l'utilisateur
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        productCart: [],
      });
    }

    // Ajouter le nouveau produit au panier
    cart.productCart.push(productCart);
    await cart.save();

    res.status(201).json({ message: 'Produit ajouté au panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit au panier :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'ajout du produit au panier' });
  }
};


