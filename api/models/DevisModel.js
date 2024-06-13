import mongoose from "mongoose";


const DevisSchema = new mongoose.Schema({

    client : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productCart : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ProductCart'
    },
    
    messageAdmin:{
        type : String,
    },

    DateCreation:{
        type: Date,
        default: Date.now,
        required: true,
    },
    PrixTotal : {
        type: Number,
        
    },
    Remise : {
        type: Number,
        
    },

    PrixApresRemise : {
        type: Number,
       
    },
    DateLivraison :{
        type: Date,

    },
    QuantiteTotals : {
        type: Number,
        default: 0,
    },
    status : {
        type: String,
        default: 'En attente',
        required: true,
        enum: [ 'confirmer', 'En attente']
      },
    
    });
    const Devis = mongoose.model('Devis', DevisSchema);
    
    export default Devis;