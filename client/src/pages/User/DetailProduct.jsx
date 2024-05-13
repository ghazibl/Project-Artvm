import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetailProduct ()  {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        setProduct(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedData = localStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        const userId = userData.user.currentUser._id;
console.log(userId);
      await axios.post(
        'http://localhost:3000/api/cart/',
        {
          user:userId,
            product: product,
          hauteur: height,
          largeur: width,
          quantite: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/cart');
    } catch (error) {
      if (error.response) {
        console.error('Error adding to cart:', error.response.data);
        alert(`Erreur lors de l'ajout au panier: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error adding to cart:', error.request);
        alert('Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer plus tard.');
      } else {
        console.error('Error adding to cart:', error.message);
        alert('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleSubmitComment = () => {
    console.log('Commentaire soumis :', comment);
    setComment('');
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé.</div>;
  }
 
  return (
    <div className="max-w-screen-lg mx-auto pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div  className="flex justify-center">
          <img
            src={product.image}
            alt={product.nom}
            className="w-full h-auto lg:w-120 rounded-2xl"
          />
        </div>
        <div className="p-4">
          <h2 className="text-2xl text-green-700 font-semibold mb-2">{product.nom}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className={`text-gray-600 mb-4 ${product.status === 'En stock' ? 'text-green-500' : 'text-red-500'}`}>{product.status}</p>

          <p className="text-lg font-bold mb-2">{product.prix} dt</p>
          <p className="mb-2">Quantité: {quantity}</p>
          <div className="flex items-center mb-4">
            <button
              onClick={decrementQuantity}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              +
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="block mb-1">Hauteur :</label>
            <input
              id="height"
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Entrez la hauteur des verres"
              onChange={handleHeightChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="width" className="block mb-1">Largeur :</label>
            <input
              id="width"
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Entrez la largeur des verres"
              onChange={handleWidthChange} 
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
      <div className="mt-8">
        <div className="mb-4">
          <label className="block mb-2">Commentaire:</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full border rounded-lg p-2"
            rows={4}
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleSubmitComment}
            className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"
          >
            Soumettre commentaire
          </button>
        </div>
      </div>
    </div>
  )
  
    };

