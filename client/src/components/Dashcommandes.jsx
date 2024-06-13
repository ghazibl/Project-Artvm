import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Pagination, Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { IoMdSearch } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { FaEye } from "react-icons/fa";

export default function Dashcommandes() {
  const [commandes, setCommandes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Items per page
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/commande/getAll');
        const data = await res.json();
        if (res.ok) {
          const reversedData = data.reverse();
          // Filter commandes based on status
          const filteredCommandes = reversedData.filter(commande => statusFilter === 'all' || commande.Status === statusFilter);
          setCommandes(filteredCommandes);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    if (currentUser.isAdmin) {
      fetchCommande();
    }
  }, [currentUser, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'text-yellow-400';
      case 'confirmé':
        return 'text-green-700';
      case 'refusé':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const filterCommandes = (status, searchTerm) => {
    return commandes.filter((commande) => {
      const matchesStatus = status === 'all' || commande.Status === status;
      const matchesSearch = searchTerm === '' || commande.client.username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterCommandes(statusFilter, searchTerm).slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = (commande) => {
    setSelectedCommande(commande);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCommande(null);
    setShowModal(false);
  };

  const handleConfirmCommande = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/commande/updateStatus/${selectedCommande._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmer' }),
      });

      if (res.ok) {
        setCommandes((prevCommandes) =>
          prevCommandes.map((commande) =>
            commande._id === selectedCommande._id ? { ...commande, Status: 'confirmer' } : commande
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
const handleRefuseCommande = async () => {
 
  try {
    const res = await fetch(`http://localhost:3000/api/commande/updateStatus/${selectedCommande._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'confirmer' }),
    });

    if (res.ok) {
      setCommandes((prevCommandes) =>
        prevCommandes.map((commande) =>
          commande._id === selectedCommande._id ? { ...commande, Status: 'confirmer' } : commande
        )
      );
      handleCloseModal();
    }
  } catch (error) {
    console.log(error.message);
  }
};
  return (
    <div className='table-auto overflow-x-auto md:mx-auto pt-10 p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between pb-5'>
        <h2 className="text-2xl font-bold">Liste de Commandes</h2>
        <div className="flex items-center ">

        <div className="relative mr-20 mb-4 md:mb-0">
  <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
  <input
    type="text"
    placeholder="Rechercher par client..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="pl-10  py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  />
</div>
          <label htmlFor="statusFilter" className="mr-2">Status:</label>
          <select
            id="statusFilter"
            className="px-2 py-2 mr-20 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Confirmer">Confirmer</option>
            <option value="Refuser">Refuser</option>
          </select>
      
        </div>
      </div>
      {commandes.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 shadow-md">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantite Totale</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Totals</th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
  {currentItems.map((commande) => (
    <React.Fragment key={commande._id}>
      {commande.productCart.map((productItem, index) => (
        <tr key={`${commande._id}-${index}`} className="text-black border dark:border-gray-700">
          {index === 0 && (
            <>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                {commande.client.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {productItem.product.type === "product" ? (
                  <>
                    {productItem.product.nom} - {productItem.product.epaisseur}mm - {productItem.hauteur}m x {productItem.largeur}m - Qté: {productItem.quantite} - {productItem.prixCart} DT
                  </>
                ) : (
                  <>
                    {productItem.product.nom} - Qté: {productItem.quantite} - {productItem.prixCart} DT
                  </>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                {commande.QuentiteTotals}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                {commande.prixTotale} DT
              </td>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                {new Date(commande.Date).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                <span className={getStatusColor(commande.Status)}>
                  {commande.Status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap" rowSpan={commande.productCart.length}>
                <div className="flex items-center justify-center">
                  <button
                    className="text-blue-600 text-xl hover:text-blue-800"
                    onClick={() => handleOpenModal(commande)}
                  >
                    <FaEye />
                  </button>
                  {commande.Status === 'En attente' && (
                    <div className="flex ml-2">
                      <button
                        className="text-green-600 text-xl ml-2 hover:text-green-800"
                        onClick={handleConfirmCommande}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="text-red-600 text-xl ml-2 hover:text-red-800"
                        onClick={handleRefuseCommande}
                      >
                        <ImCancelCircle />
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </>
          )}
          {index !== 0 && (
            <td className="px-6 py-4 whitespace-nowrap">
              {productItem.product.type === "product" ? (
                <>
                  {productItem.product.nom} - Ep: {productItem.product.epaisseur} - {productItem.hauteur}m - {productItem.largeur}m - Qté: {productItem.quantite} - {productItem.prixCart} DT
                </>
              ) : (
                <>
                  {productItem.product.nom} - Qté: {productItem.quantite} - {productItem.prixCart} DT
                </>
              )}
            </td>
          )}
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>
        </table>
      ) : (
        <p className="text-center">Aucune commande disponible.</p>
      )}

      <div className="flex justify-center mt-5">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filterCommandes(statusFilter, searchTerm).length / itemsPerPage)}
          onPageChange={paginate}
        />
      </div>

      {selectedCommande && (
  <Modal show={showModal} onClose={handleCloseModal}>
    <Modal.Header>
      <h2>Détails de la commande</h2>
    </Modal.Header>
    <Modal.Body>
      <div style={{ marginBottom: '1em' }}>
        <p><strong>Client:</strong> {selectedCommande.client.username}</p>
        <p><strong>Adresse:</strong> {selectedCommande.client.address}</p>
        <p><strong>Numéro de téléphone:</strong> {selectedCommande.client.phoneNumber}</p>
        <p><strong>Date:</strong> {new Date(selectedCommande.Date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Quantité Totale:</strong> {selectedCommande.QuentiteTotals}</p>
        <p><strong>Prix Totale:</strong> {selectedCommande.prixTotale} DT</p>
      </div>
      <div style={{ marginBottom: '1em' }}>
        <strong>Produits:</strong>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {selectedCommande.productCart.map((productItem, index) => (
            <li key={index} style={{ marginBottom: '0.5em' }}>
              {productItem.product.type === "product" ? (
                <>
                  {productItem.product.nom} - {productItem.product.epaisseur}mm - {productItem.hauteur}m x {productItem.largeur}m - Qté: {productItem.quantite} - {productItem.prixCart} DT
                </>
              ) : (
                <>
                  {productItem.product.nom} - Qté: {productItem.quantite} - {productItem.prixCart} DT
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
     
    </Modal.Body>
    <Modal.Footer>
      <Button color="gray" onClick={handleCloseModal}>
        Fermer
      </Button>
    </Modal.Footer>
  </Modal>
)}
    </div>
  );
}
