import mongoose from 'mongoose';



const FactureSchema = new mongoose.Schema(
  {
    commande : {
  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commande',
    },

    numero: {
      type: Number,
      required: true,
      unique: true,
    },
   
    total: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    livraison: {
      type: Boolean,
      required: false
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
