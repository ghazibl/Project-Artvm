import mongoose from 'mongoose';



const FactureSchema = new mongoose.Schema(
  {
    commande : {
  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commande',
    },

    numero: {
      type: Number,
     
      unique: true,
    },
   
   

   TVA: {
    type: Number,
    required: true,
  },
   date: {
        type: Date,
        default : Date.now,
        required: true

    },
    montantHT: {
      type: Number,
      required: true,
    },
    montantTTC: {
      type: Number,
      required: true,
    },
    remise: {
      type: Number,
      default: 0,
    },
    fraisLivraison: {
      type: Number,
      default: 0,
    },
    prixRestant :{
      type: Number,
    }
  },

 
);
FactureSchema.statics.getNextNumero = async function () {
    const lastFacture = await this.findOne().sort({ numero: -1 });
    if (lastFacture) {
      return lastFacture.numero + 1;
    } else {
      return 1; 
    }
  };
const Facture = mongoose.model('Facture', FactureSchema);

export default Facture;
