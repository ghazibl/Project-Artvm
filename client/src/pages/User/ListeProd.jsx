import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react'; // Adjust import according to your project structure
import { IoMdSearch } from "react-icons/io";

const ListeProd = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/prod');
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    (product.nom && product.nom.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (stockFilter === 'all' || (product.epaisseur && product.epaisseur.toString() === stockFilter)) &&
    (categoryFilter === 'all' || (product.categorie && product.categorie.toLowerCase() === categoryFilter.toLowerCase()))
  );

  if (!filteredProducts.length) {
    return <div className="px-4 md:px-20">Aucun produit trouvé</div>;
  }

  return (
    <div className="relative px-4 bg-blue-100 dark:bg-gray-900 md:px-20">
      <div className="flex flex-col items-center py-8">
        <h3 className="mb-4 text-gray-700 font-bold leading-none tracking-tight text-center md:text-3xl lg:text-2xl dark:text-white">
          Liste de Produits :
        </h3>
        <div className="search-container mb-4 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative mb-4 md:mb-0">
            <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Rechercher produit..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:flex-row items-center">
              <label className="mb-2 md:mb-0 md:mr-2 dark:text-white">Catégorie</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                <option value="all">Tous</option>
                <option value="lisse">Lisse</option>
                <option value="miroir">Miroir</option>
                <option value="chagrin">Chagrin</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <label className="mb-2 md:mb-0 md:mr-2 dark:text-white">Épaisseur</label>
              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                <option value="all">Tous</option>
                <option value="2">2mm</option>
                <option value="4">4mm</option>
                <option value="6">6mm</option>
                <option value="8">8mm</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filteredProducts.map(product => (
          <div key={product._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img src={product.image} alt={product.nom} className="rounded-t-lg w-full h-45 object-cover bg-gray-500" />
            <div className="p-5 flex flex-col">
              <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {product.nom}
              </div>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {product.description}
              </p>
              <div className="flex justify-between mb-3">
                <p className="font-bold text-gray-700 dark:text-gray-400">
                  {product.prix} DT
                </p>
                <p className={`text-xl font-bold ${product.status === 'En stock' ? 'text-green-500' : 'text-red-500'} dark:text-white`}>
                  {product.status}
                </p>
              </div>
              <Link to={`/product/${product._id}`}>
                <Button gradientDuoTone='blueToBlue' className='bg-blue-600 text-white w-full' rounded outline>
                  Acheter
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeProd;
