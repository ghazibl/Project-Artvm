import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';
import { FaShoppingCart } from "react-icons/fa";
import User from '../../../../api/models/user.model';
import { TiDelete } from "react-icons/ti";
import { Navigate } from 'react-router-dom';

const Cart = () => {
  const [ProductIncart, setProductInCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState("");
const[message, setMessage] = useState("");
const [modalIsOpen, setModalIsOpen] = useState(false);
const [totalPrice, setTotalPrice] = useState(0);
const [addressError, setAddressError] = useState("");
const [livraison, setLivraison] = useState("");
const [address, setAddress] = useState("");
const [phoneNumber, setPhoneNumber] = useState('');

useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/cart/getByUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setCart(response.data);
        setProductInCart(response.data.productCart);
        calculateTotalPrice(response.data.productCart);
        setIsLoading(false);

        localStorage.setItem('cart', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching cart:', error);
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);
  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((accumulator, item) => {
      return accumulator + (item.prixCart || 0);
    }, 0);
    setTotalPrice(total);
  };
  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart/remove', {
        cartId: cart._id,
        productCardId: itemId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status === 200) {
        console.log(data.message);
        const removedItem = ProductIncart.find((item) => item._id === itemId);
        const updatedCartItems = ProductIncart.filter((item) => item._id !== itemId);
        setProductInCart(updatedCartItems);
        setCart({ ...cart, productCart: updatedCartItems });
        localStorage.setItem('cart', JSON.stringify({ ...cart, productCart: updatedCartItems }));
        setTotalPrice(totalPrice - (removedItem ? removedItem.prixCart : 0));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément du panier:', error);
    }
  };
  const handleRadioChange = (e) => {
    setLivraison(e.target.value === 'oui');
  };
  const EmptyTheCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/api/cart/${cart._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (response.status === 200) {
        console.log(data.message);
        // Vider le panier
        setProductInCart([]);
        setCart("");
        localStorage.removeItem('cart');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
    }
  };
  const handleDevi = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    if (!ProductIncart || ProductIncart.length === 0) {
        console.error('ProductIncart is empty or not defined');
        return;
    }

    const productCart = ProductIncart.map(item => ({
        _id: item._id,
        product: item.product,
        hauteur: item.hauteur,
        largeur: item.largeur,
        quantite: item.quantite,
    }));

    const requestBody = {
        ProductInCart: productCart,
        QuantiteTotals: ProductIncart.reduce((total, item) => total + item.quantite, 0),
        PrixTotal:totalPrice,
        status: 'En attente',
    };

    console.log('Request Body:', requestBody);

    try {
        const response = await axios.post(
            'http://localhost:3000/api/devis/create',
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 201) {
          console.log('Order placed successfully:', response.data);
          toast.success("Demande devi envoyer avec succès");

          const deleteResponse = await axios.delete(`http://localhost:3000/api/cart/${cart._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (deleteResponse.status === 200) {
            setProductInCart([]);
            setCart("");
            localStorage.removeItem('cart');
          } else {
            console.error('Failed to clear cart:', deleteResponse.data.message);
          }
        } else {
            console.error('Failed to place order:', response.data.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
    }
};


const handleCloseModal = () => {
  setModalIsOpen(false);
};
const handleCommande = async () => {
  console.log('Commande');
  const token = localStorage.getItem('token');
  const User = JSON.parse(localStorage.getItem('user'));

  // Create the product cart details
  const productCart = ProductIncart.map(item => ({
    _id: item._id,
    product: item.product,
    hauteur: item.hauteur,
    largeur: item.largeur,
    quantite: item.quantite,
  }));

  // Create the request body for the order
  const requestBody = {
    ProductInCart: productCart,
    QuentiteTotals: ProductIncart.reduce((total, item) => total + item.quantite, 0),
    Client: User.userId,
    livraison,
    prixTotale: totalPrice,
    status: 'En attente',
  };

  console.log('Request Body:', requestBody); // Log the request body to ensure it is correct

  try {
    // Send the order request
    const response = await axios.post(
      'http://localhost:3000/api/commande/create',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      console.log('Order placed successfully:', response.data);
      toast.success("Commande envoyée avec succès");

      const deleteResponse = await axios.delete(`http://localhost:3000/api/cart/${cart._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (deleteResponse.status === 200) {
        console.log('Cart cleared successfully:', deleteResponse.data);
        setProductInCart([]);
        setCart("");
        localStorage.removeItem('cart');
        handleCloseModal();
        Navigate('/dashboard?tab=dashUser');
      } else {
        console.error('Failed to clear cart:', deleteResponse.data.message);
      }
    } else {
      console.error('Failed to place order:', response.data.message);
    }
  } catch (error) {
    console.error('Error during order placement:', error);
  }
};

const handleOpenModal = async () => {
  const token = localStorage.getItem('token');
  const User = JSON.parse(localStorage.getItem('user'));
  console.log(User);

  try {
    const userResponse = await axios.get(`http://localhost:3000/api/user/${User.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = userResponse.data;
    let { phoneNumber, address } = user;

    // Check if phone number and address are available
    if (!phoneNumber || !address) {
      setModalIsOpen(true);
      setPhoneNumber(phoneNumber || '');
      setAddress(address || '');
      return;
    }
    handleCommande(); 
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// Function to update user details and then place the order
const handleUpdateUserAndPlaceOrder = async () => {
  const token = localStorage.getItem('token');
  const User = JSON.parse(localStorage.getItem('user'));
  console.log(User);

  try {
    const response = await axios.put(
      `http://localhost:3000/api/user/profile/${User.userId}`,
      {
        phoneNumber: phoneNumber,
        address: address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log(response);
    if (response.status === 200) {
      console.log('User updated successfully:', response.data);
      toast.success("User details updated successfully");
      
      handleCommande();
      
    } else {
      console.error('Failed to update user:', response.data.message);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Toaster />
      <div className="justify-between flex text-2xl mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Panier</h1>
        <FaShoppingCart className="text-gray-700 dark:text-white" />
      </div>
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-300">Chargement...</p>
      ) : ProductIncart.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between">
            <button onClick={EmptyTheCart} className="px-2 py-1 bg-red-500 rounded-lg text-white">Vider le panier</button>
            <a href="/listProd" className="bg-blue-600 text-white px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">Ajouter autres produits</a>
          </div>
          {ProductIncart.map((item) => (
            <div key={item._id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 items-center">
                <div className="flex items-center">
                  <img src={item.product.image} alt={item.product.nom} className="w-20 h-20 md:w-40 md:h-32 mr-4 rounded-lg object-cover" />
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <h3 className="font-bold text-xl mb-2 dark:text-white">{item.product.nom}</h3>
                    {item.product.type === 'product' && (
                      <p className="text-gray-500 dark:text-gray-300 font-semibold">Dimension: {item.hauteur}m x {item.largeur}m</p>
                    )}
                    <p className="text-gray-500 dark:text-gray-300 font-semibold">Quantité: {item.quantite}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 text-2xl">
                  <button onClick={() => handleRemoveFromCart(item._id)} className="px-2 py-1 text-3xl rounded-lg "><TiDelete /></button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-700 dark:text-gray-300 font-bold">Prix : {item.prixCart} DT</p>
              </div>
            </div>
          ))}
          <p className="text-xl font-bold dark:text-white">Prix Total: {totalPrice} DT</p>
          <div className="flex">
            <label className="dark:text-white">Livraison:</label>
            <label className="ml-4 dark:text-white">
              <input
                type="radio"
                name="livraison"
                value="oui"
                checked={livraison === true}
                onChange={handleRadioChange}
                className="mr-1"
              />
              Oui
            </label>
            <label className="ml-4 dark:text-white">
              <input
                type="radio"
                name="livraison"
                value="non"
                checked={livraison === false}
                onChange={handleRadioChange}
                className="mr-1"
              />
              Non
            </label>
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col md:flex-row justify-between">
        <button onClick={handleOpenModal} className="bg-green-500 text-white px-4 py-2 mb-2 md:mb-0 md:mr-2 rounded hover:bg-green-600">
          Passer Commande
        </button>
        <button onClick={handleDevi} className="bg-blue-700 text-white px-4 py-2 md:ml-2 rounded hover:bg-blue-800">
          Demander Devi
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Informations supplémentaires</h2>
        <form onSubmit={handleUpdateUserAndPlaceOrder}>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 dark:text-white">Adresse:</label>
            <input
              id="address"
              type="text"
              className="border rounded-lg p-2 w-full dark:bg-gray-700 dark:text-white"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressError("");
              }}
              required
            />
            {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 dark:text-white">Numéro de téléphone:</label>
            <input
              id="phoneNumber"
              type="tel"
              className="border rounded-lg p-2 w-full dark:bg-gray-700 dark:text-white"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cart;