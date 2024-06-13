import mongoose from 'mongoose';

const ProductUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['uncategorized', 'miroir', 'lisse', 'chagrin'],
      default: 'uncategorized',
    },
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'En attente',
      enum: ['En attente', 'confirmé', 'refusé'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const ProductUser = mongoose.model('ProductUser', ProductUserSchema);

export default ProductUser;
