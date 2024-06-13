import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DetailProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [height, setHeight] = useState('1');
  const [width, setWidth] = useState('1');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState(null);
  const [prixCart, setPrixCart] = useState('');
  const { accessId } = useParams();
 
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

    const fetchAccessoires = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accessoires/${accessId}`);
        setAccess(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
    fetchAccessoires();
  }, [productId, accessId]);

  const handleAddToCart = async (event) => {
    event.preventDefault();
    if (product.status === 'Épuisé') {
      toast.error("Vous ne pouvez pas ajouter ce produit pour l'instant");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/productCard/create',
        {
          productId,
          hauteur: height,
          largeur: width,
          quantite: quantity,
          prixCart,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Produit ajouté au panier avec succès");
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
  const updatePrixCart = () => {
    if (!product) return;
    
    let h = 1; // Default height for accessories
    let w = 1; // Default width for accessories
    
    if (product.type === 'product') {
      h = parseFloat(height || 0);
      w = parseFloat(width || 0);
    }
  
    const prix = parseFloat(product.prix);
    const q = parseFloat(quantity);
    const calculatedPrixCart = prix * h * w * q;
    setPrixCart(calculatedPrixCart);
  };

  useEffect(() => {
    updatePrixCart(); 
  }, [height, width, quantity]);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = () => {
    console.log('Commentaire soumis :', comment);
    setComment('');
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé.</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 ">
  <Toaster />

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="flex justify-center">
      <img
        src={product.image}
        alt={product.nom}
        className="w-full h-auto lg:max-w-lg"
      />
    </div>
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2">{product.nom}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className={`text-gray-600 mb-4 ${product.status === 'En stock' ? 'text-green-500' : 'text-red-500'}`}>{product.status}</p>
      <p className="text-lg font-bold mb-2">{product.prix} dt</p>
      <p className="mb-2">Quantité: {quantity}</p>
      <div className="flex items-center mb-4">
        <button
          onClick={decrementQuantity}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          -
        </button>
        <span className="mx-2">{quantity}</span>
        <button
          onClick={incrementQuantity}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          +
        </button>
        
      </div>

      {product.type === 'product' && (
  <form onSubmit={handleAddToCart}>
    <div className="mb-4">
      <label htmlFor="height" className="block mb-1">Hauteur des verres:</label>
      <input
        id="height"
        type="text"
        className="border rounded-lg p-2 w-full"
        placeholder="Entrez la hauteur des verres"
        onChange={handleHeightChange}
        value={height}
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="width" className="block mb-1">Largeur des verres:</label>
      <input
        id="width"
        type="text"
        className="border rounded-lg p-2 w-full"
        placeholder="Entrez la largeur des verres"
        onChange={handleWidthChange}
        value={width}
        required
      />
    </div>
    
  </form>
)}
<p className="mb-2">Prix Total : {prixCart} DT</p>
<div className="flex justify-between">
<button
  onClick={handleAddToCart}
  className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"
>
  Ajouter au panier
</button>
<Link to="/listProd" className="px-4 py-2 bg-red-600 rounded-lg text-white">Retour</Link>

</div>
    </div>
  </div>
 
      
   
 
</div>

  );
};

export default DetailProduct;
