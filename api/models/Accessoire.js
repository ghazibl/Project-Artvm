import mongoose, { Types } from 'mongoose'; 

const AccessoireSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true },
    description: { 
        type: String,
         required: true },
    prix: { 
        type: Number, 
         },
    quantite: { 
        type: Number, 
         },
    type: { 
        type: String, 
        required: true },
    image: { 
            type: String,
             required: true },
    Status:{
        type: String,
        default: 'En stock',
       
        enum: ['En stock', 'Épuisé'] 
      }
    
});

const Accessoire = mongoose.model('Accessoire', AccessoireSchema);

export default Accessoire;