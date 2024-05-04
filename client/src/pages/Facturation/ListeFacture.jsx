import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { ImPrinter } from "react-icons/im";
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom

const ListeFacture = () => {
  const [factures, setFactures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [facturesPerPage] = useState(5);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/facture/getFactures');
        setFactures(response.data);
      } catch (error) {
        console.error('Une erreur s\'est produite lors du chargement des factures : ', error);
      }
    };

    fetchFactures();
  }, []);

  const deleteFacture = async (factureId) => {
    try {
      await axios.delete(`http://localhost:3000/api/facture/${factureId}`);
      // Mise à jour de l'état des factures après suppression
      setFactures(factures.filter(facture => facture._id !== factureId));
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la suppression de la facture : ', error);
    }
  };


  const indexOfLastFacture = currentPage * facturesPerPage;
  const indexOfFirstFacture = indexOfLastFacture - facturesPerPage;
  const currentFactures = factures.slice(indexOfFirstFacture, indexOfLastFacture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="w-3/4 relative overflow-x-auto px-10 py-10">
      <div className='flex items-center justify-between mb-8'>
        <h2 className="text-2xl font-bold text-blue-700">Liste de Factures</h2>
        <a href='/dashboard?tab=addfacture'><IoIosAddCircle className="text-blue-700 text-3xl" /> </a>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  ">
        <thead className='text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr >
            <th scope="col" className="px-6 py-3">Numéro</th>
            <th scope="col" className="px-6 py-3">Client</th>
            <th scope="col" className="px-6 py-3">Produits</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Livraison</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentFactures.map((facture) => (
            <tr key={facture._id} className="bg-white text-black border-b dark:bg-gray-800 dark:border-gray-700">
              <td scope="row" className="px-6 py-4">{facture.numero}</td>
              <td scope="row" className="px-6 py-4">{facture.client}</td>
              <td className="px-6 py-4 ">
                <ul className='' >
                  {facture.products.map((product, index) => (
                    <li key={index} className='flex justify-between'>
                      {product.name}
                      <button onClick={() => getDetailProductFacture(product._id)}
                        className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
                        <FaEye />
                      </button>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-4">{facture.total} DT</td>
              <td className="px-6 py-4">{facture.date}</td>
              <td className="px-6 py-4">
                {facture.livraison ? 'Oui' : 'Non'}
              </td>
              <td>
                <div className="flex">
                  <Link to={`/updateFacture/${facture._id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >
                    <FaRegEdit />
                  </Link>
                  <button onClick={() => deleteFacture(facture._id)} className="text-white bg-red-700 border hover:bg-red-800 border-gray-300 focus:outline-none focus:ring-red-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2  dark:text-white  ">
                    <MdDeleteForever />
                  </button>
                  <button className="text-white bg-green-700 border  hover:bg-green-800 border-gray-300 focus:outline-none  focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2  dark:text-white  ">
                    <ImPrinter />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(factures.length / facturesPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={`px-3 py-1 mx-1 rounded-lg text-sm ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListeFacture;
