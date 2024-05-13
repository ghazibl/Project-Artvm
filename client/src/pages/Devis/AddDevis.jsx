import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const AddDevis = ({ cart }) => {
  const [message, setMessage] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');
  const [status, setStatus] = useState('En attente'); // Définir le statut par défaut

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/devis', {
        cart,
        message,
        prixTotals: calculateTotalPrice(cart),
        prixApresRemise: calculateTotalPrice(cart), // Pour l'exemple, pas de remise pour l'instant
        dateLivraison,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Réinitialiser les champs après soumission réussie
      setMessage('');
      setDateLivraison('');
      setStatus('En attente');
    } catch (error) {
      console.error('Erreur lors de la soumission du devis:', error);
    }
  };

  // Fonction pour calculer le prix total du devis
  const calculateTotalPrice = (cart) => {
    return cart.reduce((total, item) => total + (item.product.prix * item.quantite), 0);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Demande de Devis</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message:</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="resize-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" required />
        </div>
        <div className="mb-4">
          <label htmlFor="dateLivraison" className="block text-gray-700 font-bold mb-2">Date de Livraison:</label>
          <input type="date" id="dateLivraison" value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Demander le Devis</button>
      </form>
    </div>
  );
};

export default AddDevis;
