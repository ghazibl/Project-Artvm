import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddDevis = () => {
  const [detailsDevis, setDetailsDevis] = useState(null);
  const [remise, setRemise] = useState("");
  const [prix, setPrix] = useState("");
  const [date, setDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const[prixTotal,setPrixTotal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevisDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/devis/devi/${id}`);
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          setDetailsDevis(data);
          setPrixTotal(data.PrixTotal);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDevisDetails();
  }, [id]);

  const calculatePrixApresRemise = () => {
    if (remise && prixTotal) {
      const prixFloat = parseFloat(prixTotal);
      const remiseFloat = parseFloat(remise);
      const prixApresRemise = prixFloat - (prixFloat * remiseFloat / 100);
      return prixApresRemise.toFixed(2); // Arrondir à deux décimales
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const res = await fetch(`http://localhost:3000/api/devis/devi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Remise: remise,
          PrixApresRemise: calculatePrixApresRemise(),
          DateLivraison: date,
          messageAdmin: additionalInfo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Devis submitted successfully.");
        navigate('/dashboard?tab=dash');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred while submitting the form.");
    }
  };

  if (!detailsDevis) {
    return <div>No details available</div>;
  }

  return (
    <div className='px-4 md:px-40'>
      <div className='w-full md:w-3/4 mx-auto'>
        <h1 className="text-xl font-bold mb-4 mt-10">Nouveau Devis</h1>
        <div className='bg-slate-100 px-4 py-2 pt-4'>
          <p>Nom : {detailsDevis.client?.username}</p>
          <p>Adresse Email : {detailsDevis.client?.email}</p>
          <p>Date: {new Date(detailsDevis.DateCreation).toLocaleDateString()}</p>
          <h2 className="mt-2 mb-2 font-bold">Produit :</h2>
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr className='bg-gray-500 text-white'>
                <th className="border border-gray-300 p-2">Nom</th>
                <th className="border border-gray-300 p-2">Epaisseur</th>
                <th className="border border-gray-300 p-2">Hauteur</th>
                <th className="border border-gray-300 p-2">Largeur</th>
                <th className="border border-gray-300 p-2">Quantité</th>
                <th className="border border-gray-300 p-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {detailsDevis.productCart.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{item.product.nom}</td>
                  <td className="border border-gray-300 p-2">{item.product.epaisseur}mm</td>
                  <td className="border border-gray-300 p-2">{item.hauteur}m</td>
                  <td className="border border-gray-300 p-2">{item.largeur}m</td>
                  <td className="border border-gray-300 p-2">{item.quantite}</td>
                  <td className="border border-gray-300 p-2">{item.prixCart} DT</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pt-4 font-bold text-right">Prix Total : {detailsDevis.PrixTotal} DT</p>
        </div>
        <div className="bg-white px-4 py-4 mt-2 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <div className='md:flex md:justify-between md:space-x-4'>
              <div className="mb-4 flex-1">
                <label className="block mb-1">Remise :</label>
                <input type="text" placeholder='Remise en %' value={remise} onChange={(e) => setRemise(e.target.value)} className="border border-gray-300 p-2 w-full rounded" />
              </div>
              <div className="mb-4 flex-1">
              <label className="block mb-1">Prix Après Remise :</label>
              <p>{calculatePrixApresRemise()} DT</p>
            </div>
            </div>
            <div className="mb-4 ">
              <label className="block mb-1">Date de Livraison :</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 p-2 w-full rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Plus d'information :</label>
              <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="border border-gray-300 p-2 w-full rounded"></textarea>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-red-500">{message}</div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDevis;
