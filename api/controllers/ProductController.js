import Product from '../models/ProductModel.js';
import mongoose from 'mongoose';
import FactureAchat from '../models/ProduitAchatModel.js';


export const createProductAchat = async (req, res) => {
  try {
    const { nomFournisseur, dateAchat, tvaAchat, products, prixTotal } = req.body;

    const productsNotFound = [];

    const newFactureAchat = new FactureAchat({
      nomFournisseur,
      dateAchat,
      tvaAchat,
      products,
      prixTotal
    });

    await newFactureAchat.save();

    // Update the quantity of each product in the inventory
    for (const product of products) {
      let existingProduct;

      if (product.categorie === 'accessoire') {
        existingProduct = await Product.findOne({ nom: product.nom });
      } else {
        existingProduct = await Product.findOne({ nom: product.nom, epaisseur: product.epaisseur });
      }

      if (existingProduct) {
        existingProduct.quantite += Number(product.quantite); // Ensure quantite is a number
        await existingProduct.save();
      } else {
        productsNotFound.push(product.nom);
      }
    }

    res.status(201).json({ factureAchat: newFactureAchat, productsNotFound });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getProductAchat = async (req, res) => {
  try {
    const productsAchat = await FactureAchat.find();
    res.status(200).json(productsAchat);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const createProduct = async (req, res) => {
    try {
      const {
        nom,
        description,
        prix,
        quantite,
        categorie,
        type,
        couleur,
        epaisseur,
        image,
        status // Include the status field from req.body
      } = req.body;
  
      // Create a new product instance
      const newProduct = new Product({
        nom,
        description,
        prix,
        quantite,
        categorie,
        type,
        couleur,
        epaisseur,
        image,
        status // Add the status field
      });
  
      // Save the product to the database
      const savedProduct = await newProduct.save();
  
      // Send the saved product in the response
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAccessories = async (req, res) => {
  try {
    const accessories = await Product.find({ type: 'accessoire' });
    res.status(200).json(accessories);
  } catch (error) {
    console.error('Erreur lors de la récupération des accessoires :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des accessoires' });
  }
};
export const getAccessById = async (req, res) => {
  try {
      const { acessId } = req.params; // ID du produit à récupérer

      if (!mongoose.Types.ObjectId.isValid(acessId)) {
          return res.status(404).json({ message: "ID du produit invalide." });
      }

      const acess = await Product.find({ type: 'accessoire' });

      if (!acess) {
          return res.status(404).json({ message: "Produit non trouvé." });
      }

      res.status(200).json(acess);
  } catch (error) {
      console.error("Erreur lors de la récupération du produit par ID :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
export const getByProduct = async (req, res) => {
  try {
    const products = await Product.find({  type: 'product' });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des products :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des products' });
  }
};
  
  export const getProduct = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  export const findProductByName = async (req, res) => {
      try {
          const  productName  = req.query.nom;
          console.log(productName);
          const product = await Product.findOne({ nom: productName });
          if (!product) {
              return res.status(404).json({ error: 'Product not found' });
              
          }
          res.status(200).json(product);
      } catch (error) {
          console.error('Error finding product by name:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
     
  };

  export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params; // ID du produit à mettre à jour
        const { prix, quantite, status } = req.body; // Nouvelles valeurs de prix, quantite et status

        // Vérifier si l'ID du produit est fourni
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({ message: "ID du produit invalide." });
        }

        // Vérifier si le produit existe dans la base de données
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        // Mettre à jour les champs du produit avec les nouvelles valeurs
        existingProduct.prix = prix;
        existingProduct.quantite = quantite;
        existingProduct.status = status;

        // Sauvegarder les modifications dans la base de données
        const updatedProduct = await existingProduct.save();

        // Renvoyer le produit mis à jour dans la réponse
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
export const getProductById = async (req, res) => {
  try {
      const { productId } = req.params; // ID du produit à récupérer

      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(404).json({ message: "ID du produit invalide." });
      }

      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: "Produit non trouvé." });
      }

      res.status(200).json(product);
  } catch (error) {
      console.error("Erreur lors de la récupération du produit par ID :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const getQuantiteProduitParCategoties = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: { categorie: { $ne: '' } } // Exclude empty categories
      },
      {
        $group: {
          _id: "$categorie",
          totalQuantite: { $sum: "$quantite" }
        }
      }
    ]);

      res.status(200).json(categories);
  } catch (error) {
      console.error('Erreur lors de la récupération de la quantité de produit par catégorie :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
