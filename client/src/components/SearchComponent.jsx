import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TextInput } from 'flowbite-react'; // Assurez-vous d'importer votre composant TextInput correctement depuis flowbite-react
import axios from 'axios';
import { Link } from 'react-router-dom'; 
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false); // État pour contrôler l'affichage des résultats

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/');
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredResults = products.filter(product =>
      product.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filteredResults);
    setShowResults(searchTerm !== ''); // Afficher les résultats lorsque le terme de recherche n'est pas vide
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Afficher les résultats lorsque l'utilisateur commence à taper
    setShowResults(e.target.value !== '');
  };

  return (
    <div className="relative">
      <TextInput
        type="text"
        placeholder="Chercher produits..."
        rightIcon={AiOutlineSearch}
        className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500  "
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {showResults && (
        <div className="absolute top-full left-0 w-full bg-white rounded-md shadow-md overflow-y-auto max-h-64 z-10">
          {filteredProducts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product.id} className="flex items-center p-3 hover:bg-gray-100" onClick={() => setSearchTerm('')} >
                  <img
                    src={product.image}
                    alt={product.nom}
                    className="w-12 h-12 mr-4 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-base font-medium">{product.nom}</p>
                    <p className="text-sm text-gray-500">{product.prix}Dt</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center p-3 text-gray-500">Aucun résultat trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
