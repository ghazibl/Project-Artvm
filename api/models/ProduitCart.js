import mongoose from 'mongoose';

const ProductCartSchema = new mongoose.Schema({
    
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
const ProductCart = mongoose.model('ProductCart', ProductCartSchema);
export default ProductCart;