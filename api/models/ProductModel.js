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
        required: true },
    type: { 
        type: String },
    couleur: { 
        type: String },
    epaisseur: { 
        type: Number, 
        required: true },
    image: { 
        type: String,
         required: false },
    status: {
        type: String,
        required: false,
        enum: ['En stock', 'Épuisé'] // Supprimez l'espace supplémentaire ici
    }
});
const Product = mongoose.model('Product', productSchema);

export default Product;
