import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function CallToAccessoire() {
  const [accessoires, setAccessoires] = useState([]);
  const [selectedAccessoire, setSelectedAccessoire] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({
    quantite: '',
    prix: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const accessoiresPerPage = 6;

  useEffect(() => {
    const fetchAccessoires = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/acces');
        const data = await res.json();
        if (res.ok) {
          setAccessoires(data);
        }
      } catch (error) {
        console.error('Error fetching accessoires:', error);
      }
    };

    fetchAccessoires();
  }, []);

  const handleUpdateClick = (accessoire) => {
    setSelectedAccessoire(accessoire);
    setUpdatedValues({
      quantite: accessoire.quantite,
      prix: accessoire.prix,
      status: accessoire.status
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/api/products/product/${selectedAccessoire._id}`, updatedValues);
      console.log("Product updated successfully:", response.data);

      // Update the accessoires state with the new values
      setAccessoires(prevAccessoires => 
        prevAccessoires.map(acc => 
          acc._id === selectedAccessoire._id ? { ...acc, ...updatedValues } : acc
        )
      );

      setIsModalOpen(false);
      toast.success("Modifier avec succès");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const indexOfLastAccessoire = currentPage * accessoiresPerPage;
  const indexOfFirstAccessoire = indexOfLastAccessoire - accessoiresPerPage;
  const currentAccessoires = accessoires.slice(indexOfFirstAccessoire, indexOfLastAccessoire);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(accessoires.length / accessoiresPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => (
    <button
      key={number}
      onClick={() => setCurrentPage(number)}
      className={`px-3 py-1 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    >
      {number}
    </button>
  ));

  return (
    <div className="w-3/4 ml-20">
      <Toaster />
      <h3 className='mb-4  font-bold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-3xl dark:text-white py-8'>Liste de Accessoires</h3>
      <table className="table-auto w-full">
        <thead>
          <tr className='bg-gray-100'>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Quantité</th>
            <th className="px-4 py-2">Prix</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentAccessoires.map((accessoire) => (
            <tr key={accessoire._id}>
              <td className="border px-4 py-2"><img src={accessoire.image} alt={accessoire.nom} className="w-16 h-16 object-cover rounded" /></td>
              <td className="border px-4 py-2">
                <Link to={`/accessoire/${accessoire._id}`} className="text-blue-500 hover:underline">{accessoire.nom}</Link>
              </td>
              <td className="border px-4 py-2">{accessoire.quantite}</td>
              <td className="border px-4 py-2">{accessoire.prix} DT</td>
              <td className="border px-4 py-2 text-green-500">{accessoire.status}</td>
              <td className="border px-4 py-2 text-green-500">
                <div className="flex ml-10">
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 py-2 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-blue-600 px-2 py-1 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => handleUpdateClick(accessoire)}
                  >
                    Modifier
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {renderPageNumbers}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Modifier Accessoire"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="modal-container bg-white w-96 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">Modifier Accessoire "{selectedAccessoire && selectedAccessoire.nom}"</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <label className="block">
                  Quantité:
                  <input
                    type="number"
                    name="quantite"
                    value={updatedValues.quantite}
                    onChange={handleChange}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </label>
                <label className="block">
                  Prix:
                  <input
                    type="number"
                    name="prix"
                    value={updatedValues.prix}
                    onChange={handleChange}
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </label>
                <label className="block">
                  Status:
                  <select
                    name="status"
                    value={updatedValues.status}
                    onChange={handleChange}
                    required
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="En stock">En stock</option>
                    <option value="Épuisé">Épuisé</option>
                </select>
              </label>
              <div className="flex justify-between">
              <button type="submit" className="btn-primary bg-cyan-600 text-white px-2 py-2 rounded-lg">Enregistrer</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-primary bg-red-600 text-white px-2 py-2 rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        </div>
  </Modal>
)}

    </div>
  );
}
