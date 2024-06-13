import  { useState, useEffect } from 'react';
import axios from 'axios';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/commande/getByUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCommandes(response.data.commandes);
        console.log(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching commandes:', error);
        setIsLoading(false);
      }
    };

    fetchCommandes();

  }, []);
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
      const response = await axios.put(`http://localhost:3000/api/commande/update/${id}`, updatedCommandeData);
  
      if (response.status === 200) {
        console.log('Commande mise à jour avec succès', response.data);
        return response.data;
      } else {
        console.error('Erreur lors de la mise à jour de la commande:', response.data.message);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la mise à jour de la commande:', error);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Mes Commandes</h1>
  {isLoading ? (
    <p className="text-gray-500 dark:text-gray-300">Chargement des commandes...</p>
  ) : commandes.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-300">Vous n'avez pas encore de commandes.</p>
  ) : (
    <div className="space-y-6">
      {commandes.map((commande) => (
        <div key={commande._id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 dark:text-gray-200 font-bold">
                Commande du {new Date(commande.Date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-bold">Status : {commande.Status}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold dark:text-white">Produits commandés:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {commande.productCart.map((item) => (
                <li key={item._id}>
                  {item.product.type === "product" ? (
                    <>
                      {item.product.nom} - Quantité: {item.quantite} - hauteur {item.hauteur} m - largeur {item.largeur} m - Prix Totale : {item.prixCart} DT
                    </>
                  ) : (
                    <>
                      {item.product.nom} - Quantité: {item.quantite} - Prix Totale : {item.prixCart} DT
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p className="dark:text-gray-200">Livraison : {commande.livraison ? "Oui" : "Non"}</p>
            <p className="text-blue-700 dark:text-blue-300">Prix Total : {commande.prixTotale} DT</p>
          </div>
          {commande.Status === "confirmer" && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                onClick={() => openModal(commande)}
              >
                Détail
              </button>
            </div>
          )}
          {commande.Status === "En attente" && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
                onClick={() => openEditModal(commande)}
              >
                Modifier
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded-lg"
                onClick={() => handleDelete(commande._id)}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Commandes;