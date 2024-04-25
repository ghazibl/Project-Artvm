import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiClipboardDocumentList } from "react-icons/hi2";
import { IoIosAddCircle } from "react-icons/io";
const AddFactureForm = () => {
    
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let hours = '' + d.getHours();
        let minutes = '' + d.getMinutes();
        let seconds = '' + d.getSeconds();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;
    
        return [year, month, day].join('-') + 'T' + [hours, minutes, seconds].join(':');
      };
  
  useEffect(() => {
    // Récupérer la date actuelle et la formater
    const currentDate = formatDate(new Date());
    setFactureData(prevData => ({
      ...prevData,
      date: currentDate
    }));
  }, []);
   
    const [factureData, setFactureData] = useState({
        client: '',
        total: 0,
        date: '',
        livraison: null,
        products: [{ name: '', hauteur: 0, largeur: 0, quantite: 0 }]
      });
      
     const initialProductState = { name: '', hauteur: 0, largeur: 0, quantite: 0 };
     
        const initialFactureState = {
            client: '',
            total: 0,
            date: formatDate(new Date()),
            livraison: null,
            products: [initialProductState]
        };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFactureData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...factureData.products];
        updatedProducts[index][name] = value;
        setFactureData(prevData => ({
          ...prevData,
          products: updatedProducts
        }));
      };
      const [showAdditionalFields, setShowAdditionalFields] = useState(false);
      const handleAddProduct = () => {
        setFactureData(prevData => ({
          ...prevData,
          products: [
            ...prevData.products, 
            { name: '', hauteur: 0, largeur: 0, quantite: 0 }
          ]
        }));
       setShowAdditionalFields(true);
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:3000/api/facture/create', factureData);
          alert('Facture ajoutée avec succès!');
          setFactureData(initialFactureState);
        } catch (error) {
          console.error('Une erreur s\'est produite lors de l\'ajout de la facture : ', error);
          alert('Une erreur s\'est produite lors de l\'ajout de la facture. Veuillez réessayer.');
        }
      };
    
      useEffect(() => {
        const currentDate = formatDate(new Date());
        setFactureData(prevData => ({
          ...prevData,
          date: currentDate
        }));
      }, []);
    
      const deleteProduct = (indexToDelete) => {
        setFactureData(prevData => ({
          ...prevData,
          products: prevData.products.filter((_, index) => index !== indexToDelete)
        }));
      };

  return (
    <form onSubmit={handleSubmit} className="w-2/5 mx-auto mt-8">
         <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Créer nouvelle Factuer</h2>
        <a href='/dashboard?tab=Listfacture' className="text-blue-500 text-3xl"><HiClipboardDocumentList /></a>
      </div>
      <div className="grid grid-cols-1 gap-6">
      
        <label className="block">
          <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du Client:</span>
          <input type="text" name="client" value={factureData.client} onChange={handleChange} required 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </label>
        <div className="flex items-center"> {/* Utilisez flex pour aligner les éléments horizontalement */}
  <label className="block flex-1">
    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du Produit:</span>
        <input 
            type="text" 
            name="name" 
            value={factureData.products[0].name || ''} 
             onChange={(e) => handleProductChange(0, e)} 
         required 
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
        </label>
        <button
            type="button"
            onClick={handleAddProduct}
            className='bg-blue-700 w-10 rounded-lg text-white py-2 ml-2 ' 
            style={{ marginTop: '2em' }}
            >
            + 
        </button>
        </div>

        <div className="flex flex-wrap gap-x-4">
        <label className="block flex-1">
        <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hauteur:</span>
        <input 
            type="number" 
            name="hauteur" 
            value={factureData.products[0].hauteur} 
            onChange={(e) => handleProductChange(0, e)} 
            required 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        />
        </label>
        <label className="block flex-1">
        <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Largeur:</span>
        <input 
            type="number" 
            name="largeur" 
            value={factureData.products[0].largeur} 
            onChange={(e) => handleProductChange(0, e)} 
            required 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        />
        </label>
        <label className="block flex-1">
        <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantité:</span>
        <input 
            type="number" 
            name="quantite" 
            value={factureData.products[0].quantite} 
            onChange={(e) => handleProductChange(0, e)} 
            required 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        />
        </label>

        
        </div>

{showAdditionalFields && factureData.products.slice(1).map((product, index) => (
      <div key={index + 1}>
        
        <div className="flex items-center"> 
  <label className="block flex-1">
    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du Produit:</span>
        <input 
            type="text" 
            name="name" 
            value={factureData.products[0].name || ''} 
             onChange={(e) => handleProductChange(0, e)} 
         
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
        </label>
       
        <button
          type="button"
          onClick={() => deleteProduct(index)}
          className='bg-blue-700 w-10 rounded-lg text-white py-2 ml-2 ' 
          style={{ marginTop: '2em' }}
        >
          -
        </button>
      
        </div>
        <div className="flex flex-wrap gap-x-4">
          <label className="block flex-1">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hauteur:</span>
            <input
              type="number"
              name="hauteur"
              value={product.hauteur} 
              onChange={(e) => handleProductChange(index, e)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </label>
          <label className="block flex-1">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Largeur:</span>
            <input
              type="number"
              name="largeur"
              value={product.largeur} 
              onChange={(e) => handleProductChange(index, e)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </label>
          <label className="block flex-1">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantité:</span>
            <input
              type="number"
              name="quantite"
              value={product.quantite} 
              onChange={(e) => handleProductChange(index, e)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </label>
        </div>
      </div>
    ))}
        <label className="block">
          <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total:</span>
          <input type="number" name="total" value={factureData.total} onChange={handleChange} required 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </label>
        <label className="block">
          <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de création:</span>
          <input type="datetime-local" name="date" value={factureData.date} onChange={handleChange} required 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </label>
        <div className="flex items-center">
  <span className="block mr-2 text-sm font-medium text-gray-900 dark:text-white">Livraison :</span>
  <div className="flex items-center">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="livraison"
        value={true}
        checked={factureData.livraison === true}
        onChange={handleChange}
        className="form-radio h-4 w-4 text-cyan-600"
      />
      <span className="ml-2 text-sm text-gray-900 dark:text-white">Oui</span>
    </label>
    <label className="inline-flex items-center ml-4">
      <input
        type="radio"
        name="livraison"
        value={false}
        checked={factureData.livraison === false}
        onChange={handleChange}
        className="form-radio h-4 w-4 text-cyan-600"
      />
      <span className="ml-2 text-sm text-gray-900 dark:text-white">Non</span>
    </label>
  </div>
</div>
      </div>
      <div className="mt-6">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-20">Ajouter </button>
      </div>
    </form>
  );
};

export default AddFactureForm;
