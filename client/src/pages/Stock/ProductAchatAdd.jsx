import React, { useState, useEffect } from 'react';
import { HiClipboardDocumentList } from "react-icons/hi2";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const FactureAchatAdd = ({ updatedProduct }) => {
  const [nomFournisseur, setNomFournisseur] = useState('');
  const [dateAchat, setDateAchat] = useState('');
  const [tvaAchat, setTvaAchat] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([{ nom: '', prix: '', quantite: '', categorie: '', epaisseur: '' }]);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProductFields = () => {
    setProducts([...products, { nom: '', prix: '', quantite: '', categorie: '', epaisseur: '' }]);
  };

  const removeProductFields = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const calculateTotalPrice = () => {
    const total = products.reduce((acc, product) => {
      return acc + Number(product.prix) ;
    }, 0);
    const totalWithTva = total + (total * Number(tvaAchat) / 100);
    setTotalPrice(totalWithTva);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [products, tvaAchat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/products/addProduct',
        {
          nomFournisseur,
          dateAchat,
          tvaAchat,
          prixTotal: totalPrice,
          products: products.map(product => ({
            ...product,
            quantite: Number(product.quantite), // Ensure quantite is a number
            epaisseur: Number(product.epaisseur), // Ensure epaisseur is a number if necessary
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 201) {
        throw new Error('Erreur lors de la création de la facture d\'achat');
      }
  
      const { productsNotFound, updatedProduct } = response.data;
  
      setNomFournisseur('');
      setDateAchat('');
      setTvaAchat('');
      setProducts([{ nom: '', prix: '', quantite: '', categorie: '', epaisseur: '' }]);
  
      if (updatedProduct) {
        toast.success("Facture ajoutée avec succès et la quantité du produit modifiée");
      } else {
        toast.success("Facture ajoutée avec succès");
      }
  
      if (productsNotFound.length > 0) {
        toast.info(`La facture a été ajoutée mais les produits suivants ne sont pas disponibles: ${productsNotFound.join(', ')}`);
      }
  
      if (!updatedProduct) {
        toast.info('Il faut ajouter ce produit');
      }
  
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-2/4 mx-auto p-4w-2/3 px-10 py-8">
      <Toaster />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold mb-4">Créer Facture d'Achat</h2>
        <a href='/dashboard?tab=factAchat' className="text-blue-500 text-3xl"><HiClipboardDocumentList /></a>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div>
          <label>Nom du Fournisseur:</label>
          <input type="text" placeholder="Entrez le Nom" value={nomFournisseur} onChange={(e) => setNomFournisseur(e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
        </div>

        {products.map((product, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1">
                <label>Catégorie:</label>
                <select value={product.categorie} onChange={(e) => handleProductChange(index, 'categorie', e.target.value)} required className="block w-full px-3 py-2 border rounded-md">
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="chagrin">Chagrin</option>
                  <option value="lisse">Lisse</option>
                  <option value="miroir">Miroir</option>
                  <option value="accessoire">Accessoire</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1">Nom du Produit:</label>
                <input type="text" placeholder="Entrez le Nom" value={product.nom} onChange={(e) => handleProductChange(index, 'nom', e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
              </div>
              {index === 0 ? (
                <button type="button" onClick={addProductFields} className="bg-blue-500 text-white px-3 py-2 mt-6 rounded-md">+</button>
              ) : (
                <button type="button" onClick={() => removeProductFields(index)} className="bg-red-500 text-white px-3 py-2 mt-6 rounded-md">-</button>
              )}
            </div>
            <div className="flex space-x-2">
              {product.categorie !== 'accessoire' && (
                <div className="flex-1">
                  <label>Épaisseur:</label>
                  <input type="number" placeholder="Entrez épaisseur" value={product.epaisseur} onChange={(e) => handleProductChange(index, 'epaisseur', e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
                </div>
              )}
              <div className="flex-1">
                <label>Quantité:</label>
                <input type="number" placeholder="Entrez la quantité" value={product.quantite} onChange={(e) => handleProductChange(index, 'quantite', e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex-1">
                <label className="">Prix:</label>
                <input type="number" placeholder="Entrez le prix" value={product.prix} onChange={(e) => handleProductChange(index, 'prix', e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          </div>
        ))}
        <div>
          <label>TVA Achat:</label>
          <input type="number" placeholder="Entrez le TVA" value={tvaAchat} onChange={(e) => setTvaAchat(e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="">
          <label className="block mb-1">Prix Total:</label>
          <input type="number" placeholder="Entrez le prix total" value={totalPrice.toFixed(2)} readOnly className="block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label>Date d'Achat:</label>
          <input type="date" value={dateAchat} onChange={(e) => setDateAchat(e.target.value)} required className="block w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default FactureAchatAdd;
