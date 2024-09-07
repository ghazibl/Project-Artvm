import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react'; // Adapter l'importation selon la structure de votre projet
import { IoMdSearch } from "react-icons/io";

const ListeAcces = () => {
  const [accessoires, setAccessoires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAccessoires = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/acces');
        const data = await res.json();
        if (res.ok) {
          setAccessoires(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des accessoires:', error);
      }
    };
    fetchAccessoires();
  }, []);

  const filteredAccessoires = accessoires.filter(accessoire =>
    accessoire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredAccessoires.length) {
    return <div className="px-4 md:px-20">Aucun accessoire trouvé</div>;
  }

  return (
    <div className="relative bg-blue-100 px-4 md:px-20">
      <div className="flex flex-col items-center py-8">
        <h3 className="mb-4 text-gray-700 font-bold leading-none tracking-tight text-center md:text-3xl lg:text-2xl dark:text-white">
          Liste de Accessoires :
        </h3>
        <div className="relative mb-4 w-full max-w-md">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Rechercher produit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAccessoires.map(accessoire => (
          <div key={accessoire._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
            <Link to={`/accessoire/${accessoire._id}`} className="flex-1">
              <img src={accessoire.image} alt={accessoire.nom} className="rounded-t-lg w-full h-60 object-cover bg-gray-500" />
            </Link>
            <div className="p-5 flex flex-col flex-1">
              <Link to={`/accessoire/${accessoire._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {accessoire.nom}
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {accessoire.description}
              </p>
              <div className="flex justify-between mt-auto">
                <div className="flex flex-col">
                  <p className="mb-3 font-bold text-gray-700 dark:text-gray-400">
                    {accessoire.prix} DT
                  </p>
                  <p className={`mb-2 text-xl font-bold ${accessoire.status === 'En stock' ? 'text-green-500' : 'text-red-500'} dark:text-white`}>
                    {accessoire.status}
                  </p>
                </div>
                <Link to={`/product/${accessoire._id}`}>
                  <Button gradientDuoTone="blueToBlue" className="bg-blue-600 text-white w-full" rounded outline>
                    Acheter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeAcces;
