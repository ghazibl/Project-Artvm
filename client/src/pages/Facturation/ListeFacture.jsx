import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';
import PrintableInvoice from './ImprimerFact';
import { FaEye } from "react-icons/fa";
import { FcPaid } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";
import InvoiceDetailsModal from './DetailFacture';
const ListeFacture = () => {
  const [factures, setFactures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [facturesPerPage] = useState(4);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [montantPaye, setMontantPaye] = useState('');
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [factureDetail, setFactureDetail] = useState(null);
  const componentRef = useRef();
  const [selectedFactureToPrint, setSelectedFactureToPrint] = useState(null);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/factures/');
        setFactures(response.data);
      } catch (error) {
        console.error('Une erreur s\'est produite lors du chargement des factures : ', error);
      }
    };

    fetchFactures();
  }, []);

  const indexOfLastFacture = currentPage * facturesPerPage;
  const indexOfFirstFacture = indexOfLastFacture - facturesPerPage;
  const currentFactures = factures.slice(indexOfFirstFacture, indexOfLastFacture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (facture) => {
    setSelectedFacture(facture);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const handleUpdateFacture = async () => {
    if (!selectedFacture) return;

    const prixRestant = selectedFacture.commande.prixTotale - montantPaye;
console.log("id:",selectedFacture._id);
console.log(prixRestant);
    try {
      const response = await axios.put(`http://localhost:3000/api/factures/${selectedFacture._id}`, {
        prixRestant,
      });
      if (response.status === 200) {
        const updatedFactures = factures.map(facture =>
          facture._id === selectedFacture._id ? { ...facture, prixRestant } : facture
        );
        setFactures(updatedFactures);
        
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error);
    }
    
    closeModal();
  };
  const handleViewFactureClick = (facture) => {
    setFactureDetail(facture);
  };
  return (
    <div className="w-full relative overflow-x-auto px-8 py-10">
      <div className='flex items-center justify-between mb-8'>
        <h2 className="text-2xl font-bold text-blue-700">Liste de Factures</h2>
        <Link to='/dashboard?tab=addfacture'><IoIosAddCircle className="text-blue-700 text-3xl" /></Link>
      </div>
      <div className="table-container">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className='text-xs text-black uppercase bg-gray-100 dark:bg-gray-700 dark:text-white'>
            <tr>
              <th scope="col" className="px-3 py-3">N°</th>
              <th scope="col" className="px-3 py-3">Client</th>
              <th scope="col" className="px-3 py-3">Produit</th>
              
              <th scope="col" className="px-3 py-3">Prix Total</th>
              <th scope="col" className="px-3 py-3">Livraison</th>
              <th scope="col" className="px-3 py-3">Date</th>
              <th scope="col" className="px-3 py-3">Montant Restant</th>
              <th scope="col" className="px-3 py-3 ">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 ">
            {currentFactures.map((facture) => (
              <React.Fragment key={facture._id}>
                {facture.commande.productCart.map((productItem, index) => (
                  <tr key={`${facture._id}-${index}`} className="text-black border dark:border-gray-700 dark:text-white">
                    {index === 0 && (
                      <>
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          {facture.numero}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          {facture.commande.client.username}
                        </td>
                      </>
                    )}
                    <td className="px-3 py-4 whitespace-nowrap">
                      {productItem.product.type === "product" ? (
                        <>
                          {productItem.product.nom} - Epaisseur {productItem.product.epaisseur}mm - {productItem.hauteur}m x {productItem.largeur}m - Quantité: {productItem.quantite} - Prix: {productItem.prixCart} DT
                        </>
                      ) : (
                        <>
                          {productItem.product.nom} - Quantité: {productItem.quantite} - Prix: {productItem.prixCart} DT
                        </>
                      )}
                    </td>
                    {index === 0 && (
                      <>
                      
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          {facture.commande.prixTotale} DT
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          {facture.livraison ? 'Oui' : 'Non'}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          {new Date(facture.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-red-500 font-bold" rowSpan={facture.commande.productCart.length}>
                        {facture.prixRestant ? `${facture.prixRestant} DT` : `${facture.commande.prixTotale} DT`}
                      </td>
                        <td className="px-3 py-4 whitespace-nowrap" rowSpan={facture.commande.productCart.length}>
                          <div className="flex">
                          <button 
                          className="text-black bg-white border hover:bg-blue-600 hover:text-white border-gray-300  font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2"
                          onClick={() => handleViewFactureClick(facture)}>
                          <FaEye />
                        </button>
                        <ReactToPrint
                        trigger={() => (
                          <button className="border hover:bg-blue-600 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2">
                            <FcPrint className='text-xl' />
                          </button>
                        )}
                        content={() => componentRef.current}
                        documentTitle={`Facture_${selectedFactureToPrint ? selectedFactureToPrint.numero : 'Unknown'}`}
                        onBeforeGetContent={() => setSelectedFactureToPrint(facture)}
                      />
                        <button 
                              className=" border hover:bg-green-400 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2"
                              onClick={() => openModal(facture)}
                            >
                             <FcPaid className='text-xl'/>
                            </button>
                           
                        
                       
                           
                          </div>
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
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(factures.length / facturesPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={`px-3 py-1 mx-1 rounded-lg text-sm ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {index + 1}
          </button>
        ))}
      </div>
      <div style={{ display: 'none' }}>
        <PrintableInvoice ref={componentRef} facture={selectedFactureToPrint} />
      </div>
      
      <div className={`modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 ${modalIsOpen ? 'block' : 'hidden'}`}>
        <div className="modal-container bg-white  p-6 rounded-lg shadow-lg">
         
            <h3 className="text-xl font-semibold mb-4 ">Ajouter Montant payé :</h3>
          
         
          <input
            type="number"
            value={montantPaye}
            onChange={(e) => setMontantPaye(e.target.value)}
            placeholder="Montant en DT"
            className="border p-2 rounded w-ful mb-4"
          /><br/>
 <div className='flex justify-between'>
        <button
          className="text-white bg-green-700 border py-2 hover:bg-green-800 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2"
          onClick={handleUpdateFacture}
        >
          Enregistrer
        </button>
        <button
          className="text-white bg-red-700 border py-2 hover:bg-red-800 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2"
          onClick={closeModal}
        >
          Annuler
        </button>
        </div>
        </div>
        </div>
        <InvoiceDetailsModal
        isOpen={factureDetail !== null}
        onClose={() => setFactureDetail(null)}
        facture={factureDetail}
      />
    </div>
  );
};

export default ListeFacture;
