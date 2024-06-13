import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ImprimerDevis from './ImprimerDevis';
import { FcPrint } from "react-icons/fc";
import { MdDelete } from "react-icons/md";

const ListeDevis = () => {
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [devisPerPage] = useState(6);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/devis/');
        if (res.status === 200) {
          setDevis(res.data.devis);
        } else {
          throw new Error(res.data.message || 'Failed to fetch devis');
        }
      } catch (error) {
        console.error('Error fetching devis:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevis();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (devis.length === 0) {
    return <div>No quotations available</div>;
  }

  const indexOfLastDevi = currentPage * devisPerPage;
  const indexOfFirstDevi = indexOfLastDevi - devisPerPage;
  const currentDevis = devis.slice(indexOfFirstDevi, indexOfLastDevi);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full relative overflow-x-auto px-10 py-10">
    <h1 className="text-2xl font-bold text-blue-700 mb-8">Liste des Devis</h1>
    <div className="table-container">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Nom de Client</th>
            <th scope="col" className="px-6 py-3">Date de Création</th>
            <th scope="col" className="px-6 py-3">Produit</th>
            <th scope="col" className="px-6 py-3">Prix Total</th>
            <th scope="col" className="px-6 py-3">Remise</th>
            <th scope="col" className="px-6 py-3">Prix Après Remise</th>
            <th scope="col" className="px-6 py-3">Date de Livraison</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
          {currentDevis.map((devi) => (
            <React.Fragment key={devi._id}>
              {devi.productCart.map((productItem, index) => (
                <tr key={`${devi._id}-${index}`} className="text-black border dark:border-gray-700">
                  {index === 0 && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {devi.client?.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {new Date(devi.DateCreation).toLocaleDateString()}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {productItem.product.type === "product" ? (
                      <>
                        {productItem.product.nom} - {productItem.product.epaisseur}mm - {productItem.hauteur}m - {productItem.largeur}m - Quantité: {productItem.quantite} - Prix: {productItem.prixCart} DT
                      </>
                    ) : (
                      <>
                        {productItem.product.nom} - Quantité: {productItem.quantite} - Prix: {productItem.prixCart} DT
                      </>
                    )}
                  </td>
                  {index === 0 && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {devi.PrixTotal} DT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {devi.Remise} DT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {devi.PrixApresRemise} DT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan={devi.productCart.length}>
                        {new Date(devi.DateLivraison).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex" rowSpan={devi.productCart.length}>
                        <PDFDownloadLink document={<ImprimerDevis devis={devi} />} fileName={`devis_${devi._id}.pdf`}>
                          {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : <FcPrint className="text-3xl ml-3" />
                          }
                        </PDFDownloadLink>
                        <button><MdDelete  className="text-3xl text-red-600 ml-3"/></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-center mt-4">
      {Array.from({ length: Math.ceil(devis.length / devisPerPage) }, (_, i) => (
        <button
          key={i}
          className={`bg-blue-500 text-white rounded px-3 py-1 mx-1 hover:bg-blue-600 focus:outline-none ${
            currentPage === i + 1 ? 'bg-blue-600' : ''
          }`}
          onClick={() => paginate(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
  );
};

export default ListeDevis;
