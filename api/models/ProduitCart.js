import mongoose from "mongoose";

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  hauteur: {
    type: Number,
    
  },
  largeur: {
    type: Number,
   
  },
  quantite: {
    type: Number,
    required: true,
  },
  prixCart:{
    type: Number,
   
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
export default ProductCart;