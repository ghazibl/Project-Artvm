import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCommande, setCurrentCommande] = useState(null);
  const [formValues, setFormValues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6; // Nombre d'éléments par page

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/commande/getByUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reversedCommandes = response.data.commandes.reverse();
      setCommandes(reversedCommandes);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      setIsLoading(false);
    }
  };

  const deleteCommande = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/commande/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Commande supprimée avec succès");
      fetchCommandes();
    } catch (error) {
      console.error('Error deleting commande:', error);
      toast.error("Erreur lors de la suppression de la commande");
    }
  };

  const updateCommande = async (id, updatedCommandeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/commande/update/${id}`, updatedCommandeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Commande mise à jour avec succès");
        setIsEditModalOpen(false);
        fetchCommandes();
      } else {
        console.error('Erreur lors de la mise à jour de la commande:', response.data.message);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la mise à jour de la commande:', error);
      toast.error("Erreur lors de la mise à jour de la commande");
    }
  };

  const openEditModal = (commande) => {
    setCurrentCommande(commande);
    setFormValues(commande.productCart.map(item => ({
      nom: item.product.nom,
      type: item.product.type,
      hauteur: item.hauteur || '',
      largeur: item.largeur || '',
      quantite: item.quantite || ''
    })));
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentCommande(null);
    setFormValues([]);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = {
      ...updatedFormValues[index],
      [name]: value
    };
    setFormValues(updatedFormValues);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentCommande) {
      const updatedCommandeData = {
        productCart: currentCommande.productCart.map((item, index) => ({
          ...item,
          hauteur: formValues[index].hauteur,
          largeur: formValues[index].largeur,
          quantite: formValues[index].quantite
        }))
      };
      updateCommande(currentCommande._id, updatedCommandeData);
    }
  };

  // Calcul des index pour la pagination
  const indexOfLastCommande = currentPage * perPage;
  const indexOfFirstCommande = indexOfLastCommande - perPage;
  const currentCommandes = commandes.slice(indexOfFirstCommande, indexOfLastCommande);
  const totalPages = Math.ceil(commandes.length / perPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Mes Commandes</h1>
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-300">Chargement des commandes...</p>
      ) : commandes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Vous n'avez pas encore de commandes.</p>
      ) : (
        <div className="space-y-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits Commandés
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
            {currentCommandes.map((commande) => (
              <tr key={commande._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-200">{new Date(commande.Date).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    commande.Status === "confirmé" ? "bg-green-100 text-green-800" :
                    commande.Status === "En attente" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {commande.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="space-y-2">
                    {commande.productCart.map((item) => (
                      <li key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <img src={item.product.image} alt={item.product.nom} className="w-16 h-16 object-cover rounded" />
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <p className="font-semibold sm:mr-4">{item.product.nom}</p>
                          <p className="sm:mr-4">Quantité: {item.quantite}</p>
                          {item.product.type === 'product' && (
                            <p className="sm:mr-4">Dimension: {item.hauteur}m x {item.largeur} m</p>
                          )}
                          <p>Prix Total: {item.prixCart} DT</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">
                    {commande.Status === "confirmé" && (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600"
                          onClick={() => openModal(commande)}
                        >
                          Détail
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                          onClick={() => deleteCommande(commande._id)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                    {commande.Status === "En attente" && (
                      <>
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600"
                          onClick={() => openEditModal(commande)}
                        >
                          Modifier
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                          onClick={() => deleteCommande(commande._id)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-lg focus:outline-none ${
                  currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
        contentLabel="Modifier Commande"
      >
        <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
          <h2 className="text-xl text-blue-700 font-bold mb-4">Modifier Commande</h2>
          <form onSubmit={handleFormSubmit}>
            {formValues.map((formValue, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-bold mb-2">Produit: {formValue.nom}</h3>
                {formValue.type === 'product' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">Hauteur (m)</label>
                      <input
                        type="number"
                        name="hauteur"
                        value={formValue.hauteur}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">Largeur (m)</label>
                      <input
                        type="number"
                        name="largeur"
                        value={formValue.largeur}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Quantité</label>
                  <input
                    type="number"
                    name="quantite"
                    value={formValue.quantite}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-500 text-white px-3 py-1 rounded-lg mr-2"
                onClick={closeEditModal}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Commandes;
