
import mongoose from 'mongoose';

const CommandeSchema = new mongoose.Schema({
cart : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
},
client : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
QuentiteTotals : {
    type: Number,
    required: true
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