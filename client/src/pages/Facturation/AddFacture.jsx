import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddFacture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [facture, setFacture] = useState({
    livraison: false,
    TVA: '20',
    montantHT: '',
    montantTTC: '',
    remise: '0',
    fraisLivraison: '0',
  });

  useEffect(() => {
    const fetchCommandDetails = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/commande/${id}`);
        setCommande(response.data);
        const montantHT = response.data.prixTotale;
        setFacture((prevFacture) => ({
          ...prevFacture,
          montantHT: montantHT.toFixed(2),
          livraison: response.data.livraison,
        }));
      } catch (error) {
        console.error('Error fetching command details:', error);
      }
    };

    if (id) {
      fetchCommandDetails(id);
    }
  }, [id]);
console.log(id);
  useEffect(() => {
    if (facture.montantHT) {
      // Calculer le montant TTC initial
      const montantTVA = (parseFloat(facture.montantHT) * (parseFloat(facture.TVA) / 100)).toFixed(2);
      let montantTTC = (parseFloat(facture.montantHT) + parseFloat(montantTVA)).toFixed(2);
      
      // Ajouter les frais de livraison si applicable
      if (facture.livraison) {
        montantTTC = (parseFloat(montantTTC) + parseFloat(facture.fraisLivraison)).toFixed(2);
      }

      // Appliquer la remise en pourcentage si applicable
      if (facture.remise > 0) {
        const montantRemise = (parseFloat(montantTTC) * (parseFloat(facture.remise) / 100)).toFixed(2);
        montantTTC = (parseFloat(montantTTC) - parseFloat(montantRemise)).toFixed(2);
      }

      setFacture((prevFacture) => ({
        ...prevFacture,
        montantTTC,
      }));
    }
  }, [facture.remise, facture.TVA, facture.montantHT, facture.fraisLivraison, facture.livraison]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFacture({
      ...facture,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/factures/', {
        commande: id,
        TVA: facture.TVA,
        montantHT: facture.montantHT,
        montantTTC: facture.montantTTC,
        remise: facture.remise,
        fraisLivraison: facture.fraisLivraison,
      });
  
      if (response.status === 201) {
        console.log('Facture créée avec succès', response.data);
        toast.success("Facture créée avec succès");
        response.data.modifiedQuantities.forEach(item => {
          toast.success(`Quantité de ${item.productName} réduite de ${item.quantityReduced} m²`);
        });
        await delay(2000);
        navigate('/dashboard?tab=Listfacture');
      } else {
        console.error('Erreur lors de la création de la facture:', response.data.message);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la création de la facture:', error);
    }
  };
  
  if (!commande) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6">Créer nouvelle Facture</h2>
      <div className="mb-6 ">
        <p className="mb-2"><span className='text-blue-500 font-bold'>Envoyé à:</span> Nom de client : {commande.client.username} <br /> Adresse : {commande.client.address} <br /> Numéro : {commande.client.phoneNumber}</p>
        <div className="mb-4 ">
          <h4 className='text-blue-500 font-bold'>Produits commandés:</h4>
          {commande.productCart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <p>Nom : {item.product.nom}</p>
              {item.product.type === 'product' ? (
                <>
                  <p>Dimension : {item.hauteur}m x {item.largeur}m</p>
                
                  <p>Quantité : {item.quantite}</p>
                </>
              ) : (
                <p>Quantité : {item.quantite}</p>
              )}
            </div>
          ))}
        </div>
      
        <p className="mb-2">Quantité Totale : {commande.QuentiteTotals}</p>
        <p>Livraison : {commande.livraison ? "Oui" : "Non"}</p>
      </div>
      <div className="flex justify-end">
        <form onSubmit={handleSubmit} className="w-2/4 space-y-4 p-4 bg-gray-100 shadow-lg rounded-md">
          <div className="flex items-center">
            <label htmlFor="montantHT" className="mr-4">Montant HT:</label>
            <input
              type="text"
              id="montantHT"
              name="montantHT"
              value={facture.montantHT}
              readOnly
              className="border border-gray-300 p-2 rounded-md flex-1"
            />
          </div>
          {facture.livraison && (
            <div className="flex items-center">
              <label htmlFor="fraisLivraison" className="mr-4">Frais de Livraison:</label>
              <input
                type="text"
                id="fraisLivraison"
                name="fraisLivraison"
                value={facture.fraisLivraison}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md flex-1"
              />
            </div>
          )}
          <div className="flex items-center">
            <label htmlFor="TVA" className="mr-4">TVA (%):</label>
            <input
              type="text"
              id="TVA"
              name="TVA"
              value={facture.TVA}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md flex-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="remise" className="mr-4">Remise (%):</label>
            <input
              type="text"
              id="remise"
              name="remise"
              value={facture.remise}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md flex-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="montantTTC" className="mr-4">Montant TTC:</label>
            <input
              type="text"
              id="montantTTC"
              name="montantTTC"
              value={facture.montantTTC}
              readOnly
              className="border border-gray-300 p-2 rounded-md flex-1"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
            Ajouter Facture
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFacture;
