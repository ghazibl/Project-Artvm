import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    
  ProductCart  : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ProductCart'
    },
 
   
      user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
});
const Cart = mongoose.model('Cart', CartSchema);
export default Cart;