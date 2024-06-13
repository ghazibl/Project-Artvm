import mongoose from 'mongoose';


const ProductAchatSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    quantite: { type: Number, required: true },
    categorie: { type: String, required: true },
    epaisseur: { type: Number, required: true }
  });
  
  const FactureAchatSchema = new mongoose.Schema({
    nomFournisseur: { type: String, required: true },
    dateAchat: { type: Date, required: true },
    tvaAchat: { type: Number, required: true },
    products: [ProductAchatSchema],
    prixTotal : { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  });
const FactureAchat= mongoose.model('FactureAchat', FactureAchatSchema);

export default FactureAchat;
