import mongoose from 'mongoose';

// Définir le schéma pour votre modèle de produit
const productSchema = new mongoose.Schema({
  
    nom: { 
        type: String, 
        required: true },
    description: { 
        type: String,
         required: true },
    prix: { 
        type: Number, 
        required: true },
    quantite: { 
        type: Number, 
        required: true },
    categorie: { 
        type: String, 
         },
    type: { 
        type: String },
    couleur: { 
        type: String },
    epaisseur: { 
        type: Number, 
         },
    image: { 
        type: String,
         required: true },
    status: {
        type: String,
        required: true,
        default: 'En stock',
        enum: ['En stock', 'Épuisé'] 
    },
  
});
const Product = mongoose.model('Product', productSchema);

export default Product;
