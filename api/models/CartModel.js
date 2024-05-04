import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    
    product  : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
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
const Cart = mongoose.model('Cart', CartSchema);
export default Cart;