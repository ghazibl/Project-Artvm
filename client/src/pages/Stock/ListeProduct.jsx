import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import { HiClipboardDocumentList } from "react-icons/hi2";
function ListeProduct() {
  const [products, setProducts] = useState([]);
 const[selectedProduct,setSelectedProduct]= useState(null);
 const [updatedQuantity, setUpdatedQuantity] = useState(0);
 const [updatedPrice, setUpdatedPrice] = useState(0);
 const [updatedStatus, setUpdatedStatus] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [currentPageMiroir, setCurrentPageMiroir] = useState(1);
  const [currentPageChagrin, setCurrentPageChagrin] = useState(1);
  const [currentPageLisse, setCurrentPageLisse] = useState(1);
  const productsPerPage = 3;

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products/');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 
  const handleUpdate = async (productId) => {
    try {
      // Fetch product details from the backend
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      const productToUpdate = response.data; // Assuming the product details are in the response data
  
      if (!productToUpdate) {
        console.error(`Product with ID ${productId} not found.`);
        return; // Exit the function if no product is found
      }
  
      // Update the state with the fetched product details
      setSelectedProduct(productToUpdate);
      setUpdatedQuantity(productToUpdate.quantite);
      setUpdatedPrice(productToUpdate.prix);
      setUpdatedStatus(productToUpdate.status);
      setIsModalOpen(true);
      fetchProducts();
    } catch (error) {
      console.error('Error fetching product:', error);
      // Handle error accordingly
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      id: selectedProduct._id,
      quantite: updatedStatus === 'Épuisé' ? 0 : updatedQuantity,
      prix: updatedPrice,
      status: updatedStatus
    };

    try {
      const response = await axios.put(`http://localhost:3000/api/products/product/${selectedProduct._id}`, updatedProduct);
      console.log("Product updated successfully:", response.data);

      // Update the local state
      setProducts(products.map(product => 
        product._id === selectedProduct._id ? { ...selectedProduct, ...updatedProduct } : product
      ));
      
      handleCancel();
      toast.success("Produit modifié avec succès");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleCancel = () => {
    setSelectedProduct(null);
    setUpdatedQuantity(0);
    setUpdatedPrice(0);
    setUpdatedStatus("");
    setIsModalOpen(false);
  };
  const handleDetail = async (ProductId) => {
    try {
      console.log(ProductId); // Vérifiez si l'ID du produit est correct
      const response = await axios.get(`http://localhost:3000/api/products/${ProductId}`);
      const productDetails = response.data;
      console.log("Product details:", productDetails);
      setProductDetails(productDetails);
      // Faites quelque chose avec les détails du produit, comme les afficher dans votre interface utilisateur
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'En stock':
        return 'text-green-700  font-bold dark:text-blue-400';
      case 'Épuisé':
        return 'text-red-700 font-bold dark:text-red-400';
      default:
        return 'text-gray-700 font-bold dark:text-gray-400'; 
    }
  };
  const renderProducts = (filteredProducts) => (
    <tbody  className="bg-white dark:bg-gray-800">
      {filteredProducts.map((product, index) => (
        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
        <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold">{product.nom}</td>
        <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{product.epaisseur}mm</td>
        <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{product.quantite} m²</td>
        <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{product.prix} DT</td>
        
        <td className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${getStatusColor(product.status)}`}>{product.status}</td>
        <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  
        
    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 px-2 py-1 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
      onClick={() => handleUpdate(product._id)} ><FaRegEdit/></button>
    <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
     onClick={() => {
      handleDetail(product._id);
     
    }}><FaEye/></button>
  </td>
              
          
         
        </tr>
      ))}
    </tbody>
  );

  const getCurrentProductsMiroir = () => {
    const indexOfLastProduct = currentPageMiroir * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.filter(product => product.categorie === 'miroir').slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const totalPagesMiroir = Math.ceil(products.filter(product => product.categorie === 'miroir').length / productsPerPage);

  const getCurrentProductsChagrin = () => {
    const indexOfLastProduct = currentPageChagrin * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.filter(product => product.categorie === 'chagrin').slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const totalPagesChagrin = Math.ceil(products.filter(product => product.categorie === 'chagrin').length / productsPerPage);

  const getCurrentProductsLisse = () => {
    const indexOfLastProduct = currentPageLisse * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.filter(product => product.categorie === 'lisse').slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const totalPagesLisse = Math.ceil(products.filter(product => product.categorie === 'lisse').length / productsPerPage);

  return (
    <div className='w-4/5 mx-auto p-8'>
      <Toaster />
      <div className='flex items-center justify-between mb-8'>
        <h2 className="text-2xl font-bold text-blue-500 flex"><HiClipboardDocumentList className='text-4xl text-blue-500'/>Liste de Produits </h2>
        <a href='/dashboard?tab=addproduct'><IoIosAddCircle className="text-blue-700 text-3xl" /> </a>
      </div>
      
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 bg-white p-4">
        <h3 className="text-xl font-semibold text-center text-blue-500 mb-4 ">Chagrin</h3>
        <table className="w-full text-sm text-center text-gray-700 mb-4">
          <thead>
            <tr className="bg-blue-100">
              <th scope="col" className="px-6 py-3">Nom</th>
              <th scope="col" className="px-6 py-3">Epaisseur</th>
              <th scope="col" className="px-6 py-3">Quantité</th>
              <th scope="col" className="px-10 py-3">Prix</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          {renderProducts(getCurrentProductsChagrin())}
        </table>
        <div className="flex justify-center space-x-4 ">
          <button
            className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-500"
            onClick={() => setCurrentPageChagrin(currentPageChagrin - 1)}
            disabled={currentPageChagrin === 1}
          >
            <GrFormPrevious />
          </button>
          <span className="text-gray-700"><strong> {currentPageChagrin} | {totalPagesChagrin}</strong></span>
          <button
            className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-500"
            onClick={() => setCurrentPageChagrin(currentPageChagrin + 1)}
            disabled={currentPageChagrin === totalPagesChagrin}
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 bg-white p-4">
        <h3 className="text-xl font-semibold text-center text-blue-500 mb-4">Lisse</h3>
        <table className="w-full text-sm text-center text-gray-700 mb-4">
          <thead>
            <tr className="bg-blue-100">
              <th scope="col" className="px-6 py-3">Nom</th>
              <th scope="col" className="px-6 py-3">Epaisseur</th>
              <th scope="col" className="px-6 py-3">Quantité</th>
              <th scope="col" className="px-10 py-3">Prix</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          {renderProducts(getCurrentProductsLisse())}
        </table>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-500"
            onClick={() => setCurrentPageLisse(currentPageLisse - 1)}
            disabled={currentPageLisse === 1}
          >
            <GrFormPrevious />
          </button>
          <span className="text-gray-700"><strong> {currentPageLisse} sur {totalPagesLisse}</strong></span>
          <button
            className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-500"
            onClick={() => setCurrentPageLisse(currentPageLisse + 1)}
            disabled={currentPageLisse === totalPagesLisse}
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 bg-white p-4">
        <h3 className="text-xl font-semibold text-center text-blue-700 mb-4">Miroir</h3>
        <table className="w-full text-sm text-center text-gray-700 mb-4">
          <thead>
            <tr className="bg-blue-100">
              <th scope="col" className="px-6 py-3">Nom</th>
              <th scope="col" className="px-6 py-3">Epaisseur</th>
              <th scope="col" className="px-6 py-3">Quantité</th>
              
              <th scope="col" className="px-10 py-3">Prix</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          {renderProducts(getCurrentProductsMiroir())}
        </table>
        <div className="flex justify-center space-x-4 py-0">
          <button
            className="bg-green-400  text-white px-3 py-2 rounded hover:bg-green-800"
            onClick={() => setCurrentPageMiroir(currentPageMiroir - 1)}
            disabled={currentPageMiroir === 1}
          >
            <GrFormPrevious />
          </button>
          <span className="text-gray-700"><strong> {currentPageMiroir} | {totalPagesMiroir}</strong></span>
          <button
            className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-800"
            onClick={() => setCurrentPageMiroir(currentPageMiroir + 1)}
            disabled={currentPageMiroir === totalPagesMiroir}
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      </div>
      {selectedProduct && isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-cyan-600">Modifier Produit "{selectedProduct && selectedProduct.nom}"</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                Quantité:
                <input
                  type="number"
                  value={updatedQuantity}
                  onChange={(e) => setUpdatedQuantity(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </label>
              <label className="block">
                Prix:
                <input
                  type="number"
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </label>
              <label className="block">
                Status:
                <select
                  name="status"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  required
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="En stock">En stock</option>
                  <option value="Épuisé">Épuisé</option>
                </select>
              </label>
              <div className="flex justify-between">
                <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">Enregistrer</button>
                <button type="button" onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Annuler</button>
              </div>
            </form>
          </div>
        </div>


      )}
      {productDetails && (
  <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="modal-container bg-white w-96 p-6 rounded-lg shadow-lg">
    
      <div className='flex justify-between'>
        
        <p className=" text-xl text-blue-500 ">   <strong className='text-center'>{productDetails.nom}</strong></p>
        <button onClick={() => setProductDetails(null)} className="btn-primary text-2xl text-black px-2 py-2 rounded-lg"><IoCloseSharp /></button>
      </div>
      <img src={productDetails.image} alt={productDetails.nom} className="w-full h-auto mt-4" />
      <div >
      <p ><strong className="text-blue-700 ">Catégorie: </strong> {productDetails.categorie}</p>
        <p><strong className="text-blue-700 ">Epaisseur:</strong> {productDetails.epaisseur} mm</p>
        <p><strong className="text-blue-700 ">Description:</strong>  {productDetails.description}</p>
        <p><strong className="text-blue-700 ">Prix: </strong> {productDetails.prix} DT</p>
        <div className='flex justify-between'>
        <p><strong className="  text-blue-700 ">Quantité:</strong>  {productDetails.quantite} m</p>
        <td className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${getStatusColor(productDetails.status)}`}>{productDetails.status}</td>
      </div>
        {productDetails.categorie === 'chagrin' && <p>Type: {productDetails.type}</p>}
        {productDetails.categorie === 'lisse' && <p>Couleur: {productDetails.couleur}</p>}
        
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ListeProduct;
