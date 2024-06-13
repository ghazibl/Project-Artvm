
import mongoose from 'mongoose';


const CommandeSchema = new mongoose.Schema({
productCart : {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductCart'
},
client : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
devis :{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Devis'

},
QuentiteTotals : {
    type: Number,
    
},
prixTotale: {
    type: Number,
    default: 0,
   },

  livraison: {
    type: Boolean,
    required: false
  },
Date :{
    type: Date,
    default : Date.now,
    required: true
},
Status : {
    type: String,
    default: 'En attente',
    required: true,
    enum: [ 'confirmer', 'En attente', 'refuser']
  },
});


const Commande = mongoose.model('Commande', CommandeSchema);

export default Commande;