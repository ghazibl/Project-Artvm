import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TextInput } from 'flowbite-react';


const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm) return;

    const apiUrl = `/api/search?term=${searchTerm}`;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const searchData = await response.json();
        setResults(searchData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div>
      <TextInput
        type='text'
        placeholder='Chercher produits...'
        rightIcon={AiOutlineSearch}
        className='hidden lg:inline'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {results.products?.length > 0 && (
          <div>
            <h2>Products</h2>
            <ul>
              {results.products.map(product => (
                <li key={product._id}>{product.nom}</li>
              ))}
            </ul>
          </div>
        )}
        {results.factures?.length > 0 && (
          <div>
            <h2>Factures</h2>
            <ul>
              {results.factures.map(facture => (
                <li key={facture._id}>{facture.numero} - {facture.nomClient}</li>
              ))}
            </ul>
          </div>
        )}
        {results.commandes?.length > 0 && (
          <div>
            <h2>Commandes</h2>
            <ul>
              {results.commandes.map(commande => (
                <li key={commande._id}>{commande.numero} - {commande.nomClient}</li>
              ))}
            </ul>
          </div>
        )}
        {results.devis?.length > 0 && (
          <div>
            <h2>Devis</h2>
            <ul>
              {results.devis.map(devi => (
                <li key={devi._id}>{devi.numero} - {devi.nomClient}</li>
              ))}
            </ul>
          </div>
        )}
        {results.users?.length > 0 && (
          <div>
            <h2>Users</h2>
            <ul>
              {results.users.map(user => (
                <li key={user._id}>{user.nom} - {user.email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
