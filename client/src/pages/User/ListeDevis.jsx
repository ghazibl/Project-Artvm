import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';

Modal.setAppElement('#root');

const ListDevis = () => {
  const [devisList, setDevisList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevi, setSelectedDevi] = useState(null);
  const [livraison, setLivraison] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editDevi, setEditDevi] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const devisPerPage = 10;
  const fetchDevis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/devis/getDevisByUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reversedDevisList = response.data.devisList.reverse();
      setDevisList(reversedDevisList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
   

    fetchDevis();
  }, []);

  const openModal = (devi) => {
    setSelectedDevi(devi);
    setAddress(devi.Adresse || '');
    setPhoneNumber(devi.Telephone || '');
    setLivraison(devi.Livraison || '');
  };

  const closeModal = () => {
    setSelectedDevi(null);
  };

  const handleConfirm = async () => {
    if (!address || !phoneNumber) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/devis/confirm/${selectedDevi._id}`, {
        address: address,
        phoneNumber: phoneNumber,
        livraison: livraison,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log('Devis confirmed and commande created:', response.data.commande);
        closeModal();
        toast.success("Commande envoyée avec succès");
        setDevisList(devisList.map(devi => devi._id === selectedDevi._id ? { ...devi, status: 'confirmer' } : devi));
      }
    } catch (error) {
      console.error('Error confirming devis:', error);
      toast.error("Erreur lors de la confirmation du devis");
    }
  };

  const handleRadioChange = (e) => {
    setLivraison(e.target.value === 'oui');
  };

  const handleDelete = async (devisId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/devis/${devisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Devis supprimé avec succès");
      setDevisList(devisList.filter(devi => devi._id !== devisId));
      closeModal();
    } catch (error) {
      console.error('Error deleting devis:', error);
      toast.error("Erreur lors de la suppression du devis");
    }
  };

  const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token');
    const updatedProductCart = editDevi.productCart.map(item => ({
      ...item,
      hauteur: item.product && item.product.type === 'product' ? item.hauteur : null,
      largeur: item.product && item.product.type === 'product' ? item.largeur : null,
      quantite: item.quantite,
    }));

    const response = await axios.put(`http://localhost:3000/api/devis/${editDevi._id}`, {
      productCart: updatedProductCart,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Mise à jour de l'état local avec le devis modifié
    setDevisList(prevDevisList => {
      return prevDevisList.map(devi =>
        devi._id === editDevi._id ? response.data : devi
      );
    });

    toast.success("Devis modifié avec succès");

    closeEditModal();
    fetchDevis();
  } catch (error) {
    console.error('Error updating devis:', error);
    toast.error("Erreur lors de la modification du devis");
  }
};

  const openEditModal = (devi) => {
    setEditDevi(devi);
  };

  const closeEditModal = () => {
    setEditDevi(null);
  };

  const handleProductChange = (index, key, value) => {
    if (editDevi) {
      const updatedProductCart = [...editDevi.productCart];
      updatedProductCart[index][key] = value;
      setEditDevi({ ...editDevi, productCart: updatedProductCart });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastDevi = currentPage * devisPerPage;
  const indexOfFirstDevi = indexOfLastDevi - devisPerPage;
  const currentDevis = devisList.slice(indexOfFirstDevi, indexOfLastDevi);
  const totalPages = Math.ceil(devisList.length / devisPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <Toaster />
    <h1 className="text-2xl font-bold mb-6">Mes Devis</h1>
    {isLoading ? (
      <p className="text-gray-500">Chargement des devis...</p>
    ) : devisList.length === 0 ? (
      <p className="text-gray-500">Vous n'avez pas encore de devis.</p>
    ) : (
      <div className="space-y-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date du devis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits commandés</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDevis.map((devi) => (
              <tr key={devi._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(devi.DateCreation).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${devi.status === 'confirmer' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {devi.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="list-disc pl-4">
                    {devi.productCart.map(item => (
                      <li key={item._id}>
                        <span className="font-bold">{item.product.nom}</span>
                        {item.product.type === 'product' && (
                          <span> - Dimension: {item.hauteur}m x {item.largeur}m</span>
                        )}
                        <span> - Quantité: {item.quantite}</span>
                        <span> - Prix Total: {item.prixCart} DT</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  {devi.status === 'confirmer' && (
                    <>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => openModal(devi)}>Détail</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(devi._id)}>Supprimer</button>
                    </>
                  )}
                  {devi.status === 'En attente' && (
                    <>
                      <button className="text-green-600 hover:text-green-900 mr-2" onClick={() =>openEditModal(devi)}>Modifier</button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(devi._id)}>Supprimer</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {selectedDevi && (
        <Modal
          isOpen={!!selectedDevi}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
          contentLabel="Devi Details"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-xl text-blue-700 font-bold mb-4"> Détails du Devis</h2>
            <div className="mt-4">
              <p><strong>Remise:</strong> {selectedDevi.Remise}%</p>
              <p><strong>Prix Total:</strong> {selectedDevi.PrixApresRemise} DT</p>
            </div>
            <p><strong>Date de Livraison:</strong> {new Date(selectedDevi.DateLivraison).toLocaleDateString('fr-FR')}</p>
            <div>
              <p className='text-blue-600 font-semibold'>Veuillez saisir ces informations avant de passer la commande</p>
              <label>Adresse:</label>
              <input
                type="text"
                placeholder="Entrez votre adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
              <label>Téléphone:</label>
              <input
                type="text"
                placeholder="Entrez votre numéro de téléphone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </div>
            <div className='flex items-center mt-2'>
              <label className='mr-4'>Livraison:</label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="livraison"
                  value="oui"
                  checked={livraison === true}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Oui
              </label>
              <label>
                <input
                  type="radio"
                  name="livraison"
                  value="non"
                  checked={livraison === false}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Non
              </label>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded-lg "
                onClick={handleConfirm}
              >
                Passer Commande
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editDevi && (
        <Modal
          isOpen={!!editDevi}
          onRequestClose={closeEditModal}
          className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
          contentLabel="Modifier Devis"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Modifier Devis</h2>
            <div>
              <h3 className="text-lg font-bold mb-2">Produits:</h3>
              <ul className="space-y-2">
                {editDevi.productCart.map((item, index) => (
                  <li key={item._id} className="p-2 border rounded">
                    <div>
                      <p className="font-bold">{item.product.nom}</p>
                      <div className="mt-2">
                        {item.product.type === 'product' && (
                          <>
                            <label>
                              Hauteur:
                              <input
                                type="number"
                                value={item.hauteur || ''}
                                onChange={(e) => handleProductChange(index, 'hauteur', e.target.value)}
                                className="block w-full mt-1 p-1 border rounded"
                              />
                            </label>
                            <label>
                              Largeur:
                              <input
                                type="number"
                                value={item.largeur || ''}
                                onChange={(e) => handleProductChange(index, 'largeur', e.target.value)}
                                className="block w-full mt-1 p-1 border rounded"
                              />
                            </label>
                          </>
                        )}
                        <label>
                          Quantité:
                          <input
                            type="number"
                            value={item.quantite}
                            onChange={(e) => handleProductChange(index, 'quantite', e.target.value)}
                            className="block w-full mt-1 p-1 border rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-lg mr-2"
                onClick={handleUpdate}
              >
                Mettre à jour
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg"
                onClick={closeEditModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListDevis;
