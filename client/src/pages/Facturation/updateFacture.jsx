import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateFacture = ({ match }) => {
    const factureId = match.params.id;
    
  const [facture, setFacture] = useState({
    client: '',
    products: [],
    total: 0,
    date: '',
    livraison: false
  });

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/facture/${match.params.id}`);
        setFacture(response.data);
      } catch (error) {
        console.error('Une erreur s\'est produite lors du chargement de la facture : ', error);
      }
    };

    fetchFacture();
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacture(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/facture/${match.params.id}`, facture);
      // Rediriger l'utilisateur vers la page de détail de la facture après la mise à jour
      // Remplacez '/facture-details' par le chemin réel de votre page de détail de la facture
      history.push(`/facture-details/${match.params.id}`);
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la mise à jour de la facture : ', error);
    }
  };

  return (
    <div>
        <h1>Modifier la facture avec l'ID : {factureId}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client:</label>
          <input type="text" name="client" value={facture.client} onChange={handleChange} />
        </div>
        <div>
          <label>Total:</label>
          <input type="number" name="total" value={facture.total} onChange={handleChange} />
        </div>
        <div>
          <label>Date:</label>
          <input type="text" name="date" value={facture.date} onChange={handleChange} />
        </div>
        <div>
          <label>Livraison:</label>
          <input type="checkbox" name="livraison" checked={facture.livraison} onChange={handleChange} />
        </div>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default UpdateFacture;
