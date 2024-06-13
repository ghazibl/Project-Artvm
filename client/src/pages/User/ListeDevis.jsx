import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';

// Définir l'élément de l'application pour react-modal
Modal.setAppElement('#root');

const ListDevis = () => {
  const [devisList, setDevisList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevi, setSelectedDevi] = useState(null);
  const [livraison, setLivraison] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editDevi, setEditDevi] = useState(null);

  useEffect(() => {
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
      console.log(updatedProductCart.hauteur);
      const response = await axios.put(`http://localhost:3000/api/devis/${editDevi._id}`, {
        productCart: updatedProductCart,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Devis modifié avec succès");
      setDevisList(devisList.map(devi => devi._id === editDevi._id ? response.data : devi));
     
      console.log(devisList);
      
      closeEditModal();
      
    } catch (error) {
      console.error('Error updating devis:', error);
      toast.error("Erreur lors de la modification du devis");
    }
  };

  const openEditModal = (devi) => {
    setEditDevi(devi);
    console.log(devi);
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Mes Devis</h1>
      {isLoading ? (
        <p className="text-gray-500">Chargement des devis...</p>
      ) : devisList.length === 0 ? (
        <p className="text-gray-500">Vous n'avez pas encore de devis.</p>
      ) : (
        <div className="space-y-6">
          {devisList.map((devi) => (
            <div key={devi._id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-bold">Devis du {new Date(devi.DateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
                <p className="text-gray-700 font-bold">Status : {devi.status}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold">Produits commandés:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {devi.productCart.map((item) => (
                    <li key={item._id}>
                      {item.product && item.product.type === "product" && (
                        <>
                          {item.product.nom} - Quantité: {item.quantite} - hauteur {item.hauteur} m - 
                          largeur { item.largeur} m - Prix Totale : { item.prixCart} DT
                        </>
                      )}
                      {item.product && item.product.type === "accessoire" && (
                        <>
                          {item.product.nom} - Quantité: {item.quantite} - 
                          Prix Totale : { item.prixCart} DT
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {devi.status === "confirmer" && (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => openModal(devi)}
                    >
                      Détail
                    </button>
                  </div>
                )}
                {devi.status === "En attente" && (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
                      onClick={() => openEditModal(devi)}
                    >
                      Modifier
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded-lg "
                      onClick={() => handleDelete(devi._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
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
            <h2 className="text-xl text-blue-700 font-bold mb-4">Détails du Devis</h2>
            <div className="flex justify-between mt-4">
              <p><strong>Remise:</strong> {selectedDevi.Remise}%</p>
              <p><strong>Prix Total:</strong> {selectedDevi.PrixApresRemise} DT</p>
            </div>
            <p><strong>Date de Livraison:</strong> {new Date(selectedDevi.DateLivraison).toLocaleDateString('fr-FR')}</p>
            <div>
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
            <div>
              <label>Livraison:</label>
              <div className="flex items-center mt-2">
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
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2"
                onClick={handleConfirm}
              >
                Confirmer
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
    </div>
  );
};

export default ListDevis;
