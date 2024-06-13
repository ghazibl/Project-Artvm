import React, { useState, useEffect } from 'react';
import { IoIosAddCircle } from "react-icons/io";

const FactureAchat = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(6);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products/getAchat');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        setProducts(data.reverse());
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = products.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-4/5 mx-auto p-4 px-10 py-8 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-8 ml-10">
        <h2 className="text-2xl font-bold text-blue-700">Factures Achats</h2>
        <a href='/dashboard?tab=addProductAchat'><IoIosAddCircle className="text-blue-700 text-3xl mr-10" /> </a>
      </div>

      {errorMessage && <div className="bg-red-200 text-red-700 py-2 px-4 mb-4 rounded">{errorMessage}</div>}
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-center text-gray-700">
          <thead>
            <tr className=' bg-blue-100 border-b border-gray-200'>
              <th scope="col" className="px-6 py-3 text-gray-700 font-semibold">Fournisseur</th>
              <th scope="col" className="px-6 py-3  text-gray-700 font-semibold">Produits</th>
              <th scope="col" className="px-6 py-3  text-gray-700 font-semibold">Date</th>
              <th scope="col" className="px-6 py-3 text-gray-700 font-semibold">TVA</th>
              <th scope="col" className="px-6 py-3  text-gray-700 font-semibold">Prix Total</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map(invoice => (
              <tr className="bg-white border-b border-gray-200 hover:bg-gray-50" key={invoice._id}>
                <td className="px-6 py-4 font-medium text-green-600">{invoice.nomFournisseur}</td>
                <td className="px-6 py-4 text-left">
                  <ul>
                    {invoice.products && invoice.products.map((product, index) => (
                      <li key={index} className="px-4 py-2 text-blue-700">
                        {product.nom} : {product.epaisseur}mm - {product.quantite} - {product.prix} DT
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-black">{formatDate(invoice.createdAt)}</td>
                <td className="px-6 py-4 text-black">{invoice.tvaAchat}</td>
                <td className="px-6 py-4 text-black">{invoice.prixTotal} DT</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(products.length / invoicesPerPage) }, (_, i) => (
          <li key={i} className="mx-1">
            <button onClick={() => paginate(i + 1)} className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FactureAchat;
