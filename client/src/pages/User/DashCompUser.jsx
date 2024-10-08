import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { LuClipboardList } from "react-icons/lu";
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";

Modal.setAppElement('#root');

const DashCompUser = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commandesCount, setCommandesCount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [devis, setDevis] = useState([]);
  const [devisCount, setDevisCount] = useState(0);
  const [factures, setFactures] = useState([]);
  const [facturesCount, setFacturesCount] = useState(0);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editDevi, setEditDevi] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommande, setEditCommande] = useState(null);
  const [formValues, setFormValues] = useState([]);

  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/commande/getByUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommandesCount(response.data.totalCommandes);
      setCommandes(response.data.commandes.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      setIsLoading(false);
    }
  };

  const fetchDevis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/devis/getDevisByUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevis(response.data.devisList.reverse());
      setDevisCount(response.data.totalDevis);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching devis:', error);
      setIsLoading(false);
    }
  };

  const fetchFactures = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.userId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`http://localhost:3000/api/factures/user/${currentUser.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFactures(response.data.factures.reverse());
          setFacturesCount(response.data.facturesCount);
        } catch (error) {
          console.error('Error fetching factures:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('No token found in localStorage');
        setIsLoading(false);
      }
    } else {
      console.error('No user found in localStorage');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
    fetchDevis();
    fetchFactures();
  }, [currentUser]);

  useEffect(() => {
    console.log(commandes);
  }, [commandes]);

  const openModal = (facture) => {
    setSelectedFacture(facture);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFacture(null);
    setModalIsOpen(false);
  };

  function getStatusColorClass(status) {
    switch (status) {
      case 'En attente':
        return 'text-yellow-500';
      case 'Confirmée':
        return 'text-green-500';
      case 'Annulée':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  const handleDeleteDevis = async (devisId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/devis/${devisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Devis supprimé avec succès");
      setDevis(devis.filter(devi => devi._id !== devisId));
      closeModal();
    } catch (error) {
      console.error('Error deleting devis:', error);
      toast.error("Erreur lors de la suppression du devis");
    }
  };

  const handleUpdateDevis = async () => {
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

      toast.success("Devis modifié avec succès");
      setDevis(devis.map(devi => devi._id === editDevi._id ? response.data : devi));
      closeEditModal();
    } catch (error) {
      console.error('Error updating devis:', error);
      toast.error("Erreur lors de la modification du devis");
    }
  };

  const openEditModalDevis = (devi) => {
    setEditDevi(devi);
    console.log('Editing Devis:', devi);
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

  const deleteCommande = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/commande/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Commande supprimée avec succès");
      setCommandes(commandes.filter(commande => commande._id !== id));
      closeModal();
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

  const openEditModalCommande = (commande) => {
    setEditCommande(commande);
    setFormValues(commande.productCart.map(item => ({
      nom: item.product.nom,
      type: item.product.type,
      hauteur: item.hauteur || '',
      largeur: item.largeur || '',
      quantite: item.quantite || ''
    })));
    setIsEditModalOpen(true);
  };

  const closeEditModalCommande = () => {
    setIsEditModalOpen(false);
    setEditCommande(null);
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
    if (editCommande) {
      const updatedCommandeData = {
        productCart: editCommande.productCart.map((item, index) => ({
          ...item,
          hauteur: formValues[index].hauteur,
          largeur: formValues[index].largeur,
          quantite: formValues[index].quantite
        }))
      };
      updateCommande(editCommande._id, updatedCommandeData);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center">
          <div className="flex-1">
            <div className="text-2xl font-bold dark:text-white">{commandesCount}</div>
            <div className="text-gray-500 dark:text-gray-400">Commandes</div>
          </div>
          <div className="text-white text-3xl border-3 bg-green-500 rounded-full p-3">
            <MdOutlineShoppingCart />
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center">
          <div className="flex-1">
            <div className="text-2xl font-bold dark:text-white">{devisCount}</div>
            <div className="text-gray-500 dark:text-gray-400">Devis</div>
          </div>
          <div className="text-white text-3xl border-3 bg-yellow-300 rounded-full p-3">
            <CiDiscount1 />
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center">
          <div className="flex-1">
            <div className="text-2xl font-bold dark:text-white">{facturesCount}</div>
            <div className="text-gray-500 dark:text-gray-400">Factures</div>
          </div>
          <div className="text-white text-3xl border-3 bg-blue-500 rounded-full p-3">
            <LuClipboardList />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Liste Commandes</h2>
          <a href="/dashboard?tab=listCommande" className="btn bg-blue-900 dark:bg-blue-900 text-white py-2 px-4 rounded-lg">Voir tous</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 text-left">
            <thead className="bg-blue-900 dark:bg-blue-900 text-white">
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Date</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Produits</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Livraison</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Prix Total</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Status</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 dark:text-white">Loading...</td>
                </tr>
              ) : (
                commandes.length > 0 ? (
                  commandes.filter(commande => commande.Status === 'En attente').map((commande) => (
                    <tr key={commande._id} className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{new Date(commande.Date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                        <ul className="list-disc pl-4">
                          {commande.productCart.map((item) => (
                            <li key={item._id} className="text-start dark:text-gray-200">    
                                      {item.product.type === 'product' ? (
                                        <>
                                          {item.product.nom} : {item.hauteur}mx{item.largeur}m -Qte: {item.quantite}
                                        </>
                                      ) : (
                                        <>{item.product.nom} -Qte: {item.quantite}</>
                                      )}
                                    </li>
                                  ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{commande.livraison ? "Oui" : "Non"}</td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{commande.prixTotale} DT</td>
                      <td className={`py-2 px-4 border-b border-gray-200 dark:border-gray-600 ${getStatusColorClass(commande.Status)}`}>{commande.Status}</td>
                      <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 flex flex-col md:flex-row min-h-16">
                       
                        <button className="py-2 px-2 text-green-500 dark:text-green-400 text-2xl rounded-lg mr-0 md:mr-2 mb-2 md:mb-0"
                          onClick={() => openEditModalCommande(commande)}><FaRegEdit /></button>
                        <button className="py-2 px-2 text-red-500 dark:text-red-400 text-2xl rounded-lg mr-0 md:mr-2 mb-2 md:mb-0"
                          onClick={() => deleteCommande(commande._id)}><MdDelete /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 dark:text-white">Aucune commande trouvée.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Liste Devis</h2>
          <a href="/dashboard?tab=listDevis" className="btn bg-blue-900 dark:bg-blue-900 text-white py-2 px-4 rounded-lg">Voir tous</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 text-left">
            <thead className="bg-blue-900 dark:bg-blue-900 text-white">
              <tr>
                <th className="py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600">Date</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600">Produits</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600">Livraison</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600">Status</th>
                <th className="py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 dark:text-white">Loading...</td>
                </tr>
              ) : (
                devis.length > 0 ? (
                  devis.filter(devi => devi.status === 'En attente').map((devi) => (
                    <React.Fragment key={devi._id}>
                      {devi.productCart.map((item, index) => (
                        <tr key={item._id} className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                          {index === 0 && (
                            <>
                              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600" rowSpan={devi.productCart.length}>
                                {new Date(devi.DateCreation).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600" rowSpan={devi.productCart.length}>
                                <ul className="list-disc pl-4">
                                  {devi.productCart.map((cartItem) => (
                                    <li key={cartItem._id} className="dark:text-gray-200">
                                      {cartItem.product.type === 'product' ? (
                                        <>
                                          {cartItem.product.nom} : {cartItem.hauteur}mx{cartItem.largeur}m -Qte: {cartItem.quantite}
                                        </>
                                      ) : (
                                        <>{cartItem.product.nom} -Qte: {cartItem.quantite}</>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600" rowSpan={devi.productCart.length}>
                                {devi.livraison ? "Oui" : "Non"}
                              </td>
                              <td className={`py-2 px-4 border-b border-gray-200 dark:border-gray-600 ${getStatusColorClass(devi.status)}`} rowSpan={devi.productCart.length}>
                                {devi.status}
                              </td>
                              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 flex flex-col md:flex-row min-h-16" rowSpan={devi.productCart.length}>
                                
                                <button className="py-2 px-2 text-green-500 dark:text-green-400 text-2xl rounded-lg mr-0 md:mr-2 mb-2 md:mb-0"
                                  onClick={() => openEditModalDevis(devi)}><FaRegEdit /></button>
                                <button className="py-2 px-2 text-red-500 dark:text-red-400 text-2xl rounded-lg"
                                  onClick={() => handleDeleteDevis(devi._id)}><MdDelete /></button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 dark:text-white">Aucune devis trouvée.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-blue-900 dark:text-blue-400 font-bold">Liste Factures</h2>
          <a href="/listFacturesUser" className="btn bg-blue-900 dark:bg-blue-900 text-white py-2 px-4 rounded-lg">Voir tous</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 text-left mt-10">
            <thead className="bg-blue-900 dark:bg-blue-900 text-white">
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Date</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Produit</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Quantité Totale</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Montant TTC</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 dark:text-white">Loading...</td>
                </tr>
              ) : (
                factures.length > 0 ? (
                  factures.map((facture) => (
                    <tr key={facture._id} className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{new Date(facture.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                        <ul className="list-disc pl-4 dark:text-gray-200">
                          {facture.commande.productCart.map((item) => (
                            <li key={item._id}>
                              {item.product.nom}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{facture.commande.QuentiteTotals}</td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">{facture.montantTTC} DT</td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                        <button className="py-2 px-4 text-blue-700 dark:bg-blue-600 text-2xl rounded-lg" onClick={() => openModal(facture)}>
                          <FaEye/>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 dark:text-white">Aucune facture trouvée.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editCommande && (
  <Modal
    isOpen={isEditModalOpen}
    onRequestClose={closeEditModalCommande}
    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
    contentLabel="Modifier Commande"
  >
    <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-xl text-blue-700 font-bold mb-4">Modifier Commande</h2>
      <form onSubmit={handleFormSubmit}>
        {formValues.map((formValue, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-bold mb-2">Produit: {formValue.nom}</h3>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Hauteur (m)</label>
                <input
                  type="number"
                  name="hauteur"
                  value={formValue.hauteur}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Largeur (m)</label>
                <input
                  type="number"
                  name="largeur"
                  value={formValue.largeur}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
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
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Sauvegarder
          </button>
        </div>
      </form>
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
                onClick={handleUpdateDevis}
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

      {selectedFacture && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Facture Details"
          className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
          overlayClassName="overlay"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-xl text-blue-700 font-bold mb-4">Détails de la Facture</h2>
            <p>Date: {new Date(selectedFacture.date).toLocaleDateString('fr-FR')}</p>
            <p>Produits:</p>
            <ul className="list-disc pl-5 mb-2">
              {selectedFacture.commande.productCart.map((item) => (
                <li key={item._id} className='flex'>
                  {item.product.type === 'product' ? (
                    <>
                      {item.product.nom} - Hauteur: {item.hauteur}m - Largeur: {item.largeur}m - Quantité: {item.quantite} - Prix: {item.prixCart} DT
                    </>
                  ) : (
                    <>
                      {item.product.nom} - Quantité: {item.quantite} - Prix: {item.prixCart} DT
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p>Quantité Totals: {selectedFacture.commande.QuentiteTotals}</p>
            <p>Livraison: {selectedFacture.commande.livraison ? "Oui" : "Non"}</p>
            <p>Frais de Livraison {selectedFacture.fraisLivraison}</p>
            <p>Montant HT: {selectedFacture.montantHT} DT</p>
            <p>TVA: {selectedFacture.commande.TVA} %</p>
            <p>Remise: {selectedFacture.remise}</p>
            <p>Montant TTC: {selectedFacture.montantTTC} DT</p>
            <div className="flex justify-end ">
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg mt-4"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashCompUser;
