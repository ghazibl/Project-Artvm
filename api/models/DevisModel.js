import mongoose from "mongoose";

const DevisSchema = new mongoose.Schema({

    Commande : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commande'
    },
    cart : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
   message:{
    type:String,

   },
    PrixTotals : {
        type: Number,
        required: true
    },
    Remise : {
        type: Number,
        
    },

    PrixApresRemise : {
        type: Number,
        required: true
    },
    DateLivraison :{
        type: Date,
       
        required: true
    },
    Status : {
        type: String,
        default: 'En attente',
        required: true,
        enum: [ 'confirmer', 'En attente', 'refuser']
      },
    });
    
    
    const Devis = mongoose.model('Devis', DevisSchema);
    
    export default Devis;