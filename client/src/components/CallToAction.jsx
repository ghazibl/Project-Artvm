import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function CallToAction() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Nombre de produits par page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
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

  // Index du dernier produit sur la page actuelle
  const indexOfLastProduct = currentPage * productsPerPage;
  // Index du premier produit sur la page actuelle
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // Chunk des produits à afficher sur la page actuelle
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction pour la page suivante
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fonction pour la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h3 className='mb-4 text-xl font-bold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-4xl dark:text-white py-8 text-center'>Du verre sur-mesure pour toutes vos envies</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentProducts.map((product) => (
          <div key={product._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
            </Link>
            <div className="p-5">
              <Link to={`/product/${product._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{product.nom}</Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
              <Button href="#" gradientDuoTone='blueToBlue' className='bg-black' rounded outline={true}>Lire la suite</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={prevPage} className="mx-1 bg-gray-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Précédent</button>
        {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
          <button key={number} onClick={() => paginate(number + 1)} className="mx-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {number + 1}
          </button>
        ))}
        <button onClick={nextPage} className="mx-1 bg-gray-700 hover:bg-black-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Suivant</button>
      </div>
    </div>
  );
}
