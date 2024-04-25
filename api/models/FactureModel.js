import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    hauteur: {
        type: Number,
        required: true
      },
      largeur: {
        type: Number,
        required: true
      },
      quantite: {
        type: Number,
        required: true
      },
});

const FactureSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: true,
      unique: true,
    },
    client: {
      type: String,
      required: true
    },
    products: [ProductSchema], 
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
  { timestamps: true }
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
