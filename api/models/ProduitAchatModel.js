import mongoose from 'mongoose';

// Définir le schéma pour votre modèle de produit
const productAchatSchema = new mongoose.Schema({
  
    nom: { 
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

    epaisseur: { 
        type: Number, 
        required: true },
    nomFrournisseur: { 
        type: String, 
        required: true
    },
    dateAchat:{
        type: Date,
        required: true
    },
    Tva_Achat: {
        type: Number,
        required: false,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
});
const productAchat = mongoose.model('ProductAchat', productAchatSchema);

export default productAchat;
