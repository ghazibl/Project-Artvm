import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    
  productCart  : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ProductCart'
    },
 
   prixTotale: {
    type: Number,
    default: 0,
   },
      user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;