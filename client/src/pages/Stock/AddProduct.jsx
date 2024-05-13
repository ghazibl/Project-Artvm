import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiClipboardDocumentList } from "react-icons/hi2";


function AjoutProduit() {
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState('');
  const [epaisseur, setEpaisseur] = useState('');
  const [type, setType] = useState('');
  const [couleur, setCouleur] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [nomOptions, setNomOptions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [otherNom, setOtherNom] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle category change
    if (name === 'categorie') {
      setCategorie(value);
      // Reset other fields when category changes
      setNom('');
      setType('');
      setCouleur('');
      updateNomOptions(value);
    } 
    // Handle image change
    else if (name === 'image') {
      setImage(e.target.files[0]);
    }
    // Handle status change
    else if (name === 'status') {
      setStatus(value);
    }
    // Handle other field changes
    else {
      // For the "nom" field
      if (name === 'nom') {
        setNom(value);
        if (value === 'Other') setOtherNom('');
      }
      // For other fields
      else {
        // Dynamically set state based on the field name
        switch (name) {
          case 'epaisseur':
            setEpaisseur(value);
            break;
          case 'type':
            setType(value);
            break;
          case 'couleur':
            setCouleur(value);
            break;
          case 'description':
            setDescription(value);
            break;
          case 'prix':
            setPrix(value);
            break;
          case 'quantite':
            setQuantite(value);
            break;
          case 'otherNom':
            setOtherNom(value);
            setNom(value);
            break;
          default:
            break;
        }
      }
    }
  };
  

  const updateNomOptions = (selectedCategorie) => {
    let options = [];
    switch (selectedCategorie) {
      case 'miroir':
        options = ['Miroir'];
        break;
      case 'chagrin':
        options = ['mistrecarre', 'mistre point', 'cartago', 'delta', 'sablé', 'peau d\'orange', 'nuages'];
        break;
      case 'lisse':
        options = ['claire', 'fumée', 'stopsol'];
        break;
      default:
        options = [];
    }
    setNomOptions(options);
  };
  const resetInputs = () => {
    setNom('');
    setCategorie('');
    setEpaisseur('');
    setType('');
    setCouleur('');
    setDescription('');
    setPrix('');
    setQuantite('');
    setImage(null);
    setOtherNom('');
     
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${image.name}`);
      
      setImageUploadError('');
      setImageUploadProgress(0);
  
      // Upload the image to Firebase Storage
      const uploadTask = uploadBytes(storageRef, image);
      uploadTask
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          return axios.post('http://localhost:3000/api/products/', {
            nom: nom === 'Other' ? otherNom : nom,
            categorie,
            epaisseur,
            type,
            couleur,
            description,
            prix,
            quantite,
            image: downloadURL,
            status: status,
          });
         
        })
        .then((response) => {
            console.log('Response from server:', response);
            
                setSuccess(true);
                resetInputs();
            
        })
        .catch((error) => {
            console.error('Error:', error);
            setImageUploadError('Image upload failed');
            setError('Une erreur s\'est produite lors de l\'ajout du produit.');
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
   <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Ajouter produit</h2>
        <a href='/dashboard?tab=AjoutAccessoire' className="text-blue-500 text-3xl">Accessoire</a>
        <a href='/dashboard?tab=ListProduct' className="text-blue-500 text-3xl"><HiClipboardDocumentList /></a>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4">
        <label className="block mb-2">
          Catégorie:
          <select
            name="categorie"
            value={categorie}
            onChange={handleChange}
            required
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="miroir">Miroir</option>
            <option value="chagrin">Chagrin</option>
            <option value="lisse">Lisse</option>
          </select>
        </label>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Nom:</label>
            <select
              name="nom"
              value={nom}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Sélectionner un nom</option>
              {nomOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
              <option value="Other">Autre</option>
            </select>
            {nom === 'Other' && (
              <input
              type="text"
              name="otherNom"
              value={otherNom}
              onChange={(e) => setOtherNom(e.target.value)}
              placeholder="Entrez un autre nom"
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
            )}
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Épaisseur (mm):</label>
            <select
                name="epaisseur"
                value={epaisseur}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Sélectionner épaisseur</option>  
                <option value="2">2 mm</option>
                <option value="4">4 mm</option>
                <option value="6">6 mm</option>
                <option value="8">8 mm</option>
                <option value="10">10 mm</option>
            </select>
            </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Type:</label>
            <input
              type="text"
              name="type"
              value={type}
              onChange={handleChange}
              placeholder="Entrez le type"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Couleur:</label>
            <input
              type="text"
              name="couleur"
              value={couleur}
              onChange={handleChange}
              placeholder="Entrez la couleur"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full px-2 mb-4">
            <label className="block mb-2">Description:</label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Entrez la description"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Prix:</label>
            <input
              type="text"
              name="prix"
              value={prix}
              onChange={handleChange}
              placeholder="Entrez le prix"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block mb-2">Quantité:</label>
            <input
              type="text"
              name="quantite"
              value={quantite}
              onChange={handleChange}
              placeholder="Entrez la quantité"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full px-2 mb-4">
            <label className="block mb-2">Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>
          <div className="w-full px-2 mb-4">
          <label className="block mb-2">Statut:</label>
          <select
            name="status"
            value={status}
            onChange={handleChange}
            required
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Sélectionner un statut</option>
            <option value="En stock">En stock</option>
            <option value="Épuisé">Épuisé</option>
            {/* Ajoutez d'autres options de statut au besoin */}
          </select>
        </div>
        </div>
        {success && <p className="bg-green-200 text-green-800 px-4 py-2 rounded-md p-2">
            Le produit est ajouter avec success.
        </p>}
        {error && <p className="text-white bg-red-500 px-2 py-2">{error}</p>}
        <div className="flex justify-between py-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Ajouter
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400"
            onClick={resetInputs}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
 
}

export default AjoutProduit;
