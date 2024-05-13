
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { SlBasketLoaded } from "react-icons/sl";
import { useSelector } from 'react-redux';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = currentUser._id;
        console.log(userId);
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
        setIsLoading(false);

        // Stocker les données du panier dans le localStorage
        localStorage.setItem('cart', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching cart:', error);
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setCart(cart.filter((item) => item._id !== itemId));
        localStorage.setItem('cart', JSON.stringify(cart.filter((item) => item._id !== itemId)));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément du panier:', error);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantite: quantity }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
        // Mettre à jour le panier après la modification de la quantité et du prix
        setCart(
          cart.map((item) =>
            item._id === itemId ? { ...item, quantite: quantity, prixTotal: item.product.prix * quantity} : item
          )
        );
        // Mettre à jour les données du panier dans le localStorage
        localStorage.setItem('cart', JSON.stringify(cart.map((item) =>
          item._id === itemId ? { ...item, quantite: quantity, prixTotal: item.product.prix * quantity} : item
        )));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité:', error);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      <SlBasketLoaded className='text-2xl'/>
      </div>
      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="bg-gray-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center">
                  {item.product && item.product.image && (
                    <img src={item.product.image} alt={item.product.nom} className="w-40 h-40 mr-4 rounded-lg" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{item.product ? item.product.nom : 'Product Name Unknown'}</h3>
                    <p className="text-gray-500">Hauteur: {item.hauteur}</p>
                    <p className="text-gray-500">Largeur: {item.largeur}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleQuantityChange(item._id, item.quantite - 1)} disabled={item.quantite === 1} className="px-2 py-1 bg-gray-300 rounded-l hover:bg-gray-400">-</button>
                  <span className="px-4 py-1 bg-gray-300 rounded">{item.quantite}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantite + 1)} className="px-2 py-1 bg-gray-300 rounded-r hover:bg-gray-400">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700 font-bold">Prix: {item.product ? item.product.prix : 'Price Unknown'} dt</p>
                <button onClick={() => handleRemoveFromCart(item._id)} className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center justify-between flex">
        <NavLink to="/infouser" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-500">
          Passer Commande
        </NavLink>
        <NavLink to="/addDevis" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Demande devis
        </NavLink>
      </div>
    </div>
  );
};

export default Cart;
