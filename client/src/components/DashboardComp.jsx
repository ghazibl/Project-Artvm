import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link, useNavigate  } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import axios from 'axios';
import ChartComponent from './Chart';
import CalendarComponent from './Calendar';


export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [devis, setDevis] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [totalDevis, setTotalDevis] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthCommandes, setLastMonthCommande] = useState(0);
  const [lastMonthDevis, setLastMonthDevis] = useState(0);
  const [details, setDetails] = useState(null);
  const [detailsDevis, setDetailsDevis] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [posts,setPosts] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {

    const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    console.log(token);
    if (!token) {
      throw new Error('Token not found');
    }

    const res = await fetch('http://localhost:3000/api/user/getusers?limit=5', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setLastMonthUsers(data.lastMonthUsers);
    } else {
      console.error('Failed to fetch users:', data.message);
    }
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
};
   
    const fetchCommande = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/commande/totalCommandes?limit=5');
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          const reversedCommandes = data.commandes.reverse();
      setCommandes(reversedCommandes);
          setTotalCommandes(data.totalCommandes);
          setLastMonthCommande(data.lastMonthCommandes);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
  
    const fetchDevis= async () => {
      try {
        const res = await fetch('http://localhost:3000/api/devis/?limit=5');
        const data = await res.json();
        if (res.ok) {
          const reversedDevis = data.devis.reverse();
          setDevis(reversedDevis);
         
          setTotalDevis(data.totalDevis);
          setLastMonthDevis(data.lastMonthDevis);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchProduitFiltrage = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:3000/api/post/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = res.data;
        const reversedPosts = data.reverse(); // Reverse the array of posts
        setPosts(reversedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchCommande();
      fetchDevis();
      fetchProduitFiltrage();
    }
  }, [currentUser]);
  const fetchDevisDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/devis/devi/${id}` );
      const data = await res.json();
      if (res.ok) {
        console.log(data); // Afficher les détails du devis dans la console
        setDetailsDevis(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchCommandDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/commande/${id}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching command details:', error);
    }
  };
  const handleConfirme = async (id) => {
    const User = JSON.parse(localStorage.getItem('user'));
    try {
      console.log(id);
      const response = await axios.put(`http://localhost:3000/api/commande/confirm/${id}`);
  
      if (response.data && response.data.success) {
        console.log('Commande confirmée avec succès');
        setDetails(null);
        navigate(`/addfacture/${id}`); 
      } else {
        console.error(response.data && response.data.message);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la mise à jour du statut de la commande :', error);
    }
  };
  const handleRefuse = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(`http://localhost:3000/api/commande/refuse/${id}`);
     
      if (response.data && response.data.success) {
        // Successful update, you can perform additional actions if needed
        console.log('Commande refusée avec succès');
        setDetails(null);
      } else {
        // Error handling
        console.error(response.data && response.data.message);
      }
    } catch (error) {
      // Request error handling
      console.error('Une erreur s\'est produite lors de la mise à jour du statut de la commande :', error);
    }
    
  };
  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Totales Utilisateurs</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Le mois dernier</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
              Totales Devis
              </h3>
              <p className='text-2xl'>{totalDevis}</p>
            </div>
            <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthDevis}
            </span>
            <div className='text-gray-500'>Le mois dernier</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Totales Commandes</h3>
              <p className='text-2xl'>{totalCommandes}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthCommandes}
            </span>
            <div className='text-gray-500'>Le mois dernier</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
      
      <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'> Commandes en attente</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=commandes'}>Voir tous</Link>
            </Button>
          </div>
          <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Client</Table.HeadCell>
        <Table.HeadCell>Produit</Table.HeadCell>
        <Table.HeadCell>Date</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {commandes && Array.isArray(commandes) && commandes
          .filter(command => command.Status === 'En attente')
          .map((command) => (
            <React.Fragment key={command._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell className='flex items-center'>
                  {command.client.username}
                </Table.Cell>
                <Table.Cell>
                  {command.productCart.map((item) => (
                    <p key={item._id}>
                      {item.product && (
                        <>
                          {item.product.nom} 
                        </>
                      )}
                    </p>
                  ))}
                </Table.Cell>
                <Table.Cell>{new Date(command.Date).toLocaleDateString('fr-FR')}</Table.Cell>
                <Table.Cell>
                  <button onClick={() => fetchCommandDetails(command._id)} className='text-blue-700'><FaEye /></button>
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ))}
      </Table.Body>
    </Table>
</div>
<div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Utilisateurs</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=users'}>Voir tous</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell> Image</Table.HeadCell>
              <Table.HeadCell>Nom</Table.HeadCell>
              <Table.HeadCell>Adresse Email</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      
    
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
  <div className='flex justify-between p-3 text-sm font-semibold'>
    <h1 className='text-center p-2'>Demandes Devis</h1>
    <Button outline gradientDuoTone='purpleToPink'>
      <Link to={'?tab=devis'}>Voir tous</Link>
    </Button>
  </div>
  <div className='flex flex-col space-y-4'> {/* Added space-y-4 for spacing between elements */}
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Client</Table.HeadCell>
        <Table.HeadCell>Produit</Table.HeadCell>
        <Table.HeadCell>Date</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {devis && Array.isArray(devis) && devis
          .filter(devi => devi.status === 'En attente')
          .map((devi) => (
            <React.Fragment key={devi._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell className='flex items-center'>
                  {devi.client?.username}
                </Table.Cell>
                <Table.Cell>
                  {devi.productCart.map((item) => (
                    <p key={item._id}>
                      {item.product && (
                        <>
                          {item.product.nom} 
                        </>
                      )}
                    </p>
                  ))}
                </Table.Cell>
                <Table.Cell>{new Date(devi.DateCreation).toLocaleDateString('fr-FR')}</Table.Cell>
                <Table.Cell>
                  <button onClick={() => fetchDevisDetails(devi._id)} className='text-blue-700'><FaEye /></button>
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ))}
      </Table.Body>
    </Table>
    
  </div>
</div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
  <div className='flex justify-between p-3 text-sm font-semibold'>
    <h1 className='text-center p-2'>Produit pour filtrage</h1>
    <Button outline gradientDuoTone='purpleToPink'>
      <Link to={'?tab=devis'}>Voir tous</Link>
    </Button>
  </div>
<div className='flex flex-col space-y-4'> {/* Added space-y-4 for spacing between elements */}
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Client</Table.HeadCell>
        <Table.HeadCell>Produit</Table.HeadCell>
        <Table.HeadCell>Date</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {posts && Array.isArray(posts) && posts
          .filter(post => post.status === 'En attente')
          .map((post) => (
            <React.Fragment key={post._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell className='flex items-center'>
                  {post.user?.username}
                </Table.Cell>
                <Table.Cell>
                 {post.title} - {post.height}m x {post.width}m
                </Table.Cell>
                <Table.Cell>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</Table.Cell>
                <Table.Cell>
                  <button onClick={() => fetchDevisDetails(post._id)} className='text-blue-700'><FaEye /></button>
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ))}
      </Table.Body>
    </Table>

  
  </div>
</div>

      
{details && (
  <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="modal-container bg-white w-2/3 p-6 rounded-lg shadow-lg">
      <div className='flex justify-between items-center mb-4'>
        <h3 className="text-xl font-semibold">Demande par <strong className='text-blue-500'>{details.client.username}</strong></h3>
        <button onClick={() => setDetails(null)} className="text-2xl text-black px-2 py-2 rounded-lg hover:bg-gray-200">
          <IoCloseSharp />
        </button>
      </div>
      <table className="min-w-full bg-white border h-full border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Produit</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Épaisseur</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Dimension</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Quantité Commandée</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Quantité en Stock</th>
          </tr>
        </thead>
        <tbody>
          {details.productCart.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-4 text-sm text-gray-700">{item.product.nom}</td>
              {item.product.type === 'product' ? (
                <>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.product.epaisseur}mm</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.hauteur}m x {item.largeur}m</td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm text-gray-700">-</td>
                  <td className="px-6 py-4 text-sm text-gray-700">-</td>
                </>
              )}
              <td className="px-6 py-4 text-sm text-gray-700">{item.quantite}m</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.product.quantite ? item.product.quantite + 'm' : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-sm text-gray-700"><strong>Livraison :</strong> {details.livraison ? 'oui' : 'non'}</p>
        <p className="text-sm text-gray-700"><strong>Adresse :</strong> {details.client.address}</p>
        <p className="text-sm text-gray-700"><strong>Numéro de tel :</strong> {details.client.phoneNumber}</p>
      </div>
      <div className="flex justify-between mt-8 space-x-4 ">
        <button className='bg-blue-600 hover:bg-blue-800 text-white  py-2 px-4 rounded' onClick={() => handleConfirme(details._id)}>Confirmer</button>
        <button className='bg-red-500 hover:bg-red-800 text-white  py-2 px-4 rounded' onClick={() => handleRefuse(details._id)}>Refuser</button>
      </div>
    </div>
  </div>
)}
{detailsDevis && (
  <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="modal-container bg-white w-2/4  p-6 rounded-lg shadow-lg">
      <div className='flex justify-between'>
        <h3 className="text-xl font-semibold mb-4 ">Demande par <strong className='text-green-500'>{detailsDevis.client.username}</strong></h3>
        <button onClick={() => setDetailsDevis(null)} className="btn-primary text-2xl text-black px-2 py-2 rounded-lg"><IoCloseSharp /></button>
      </div>
      <div>
      <table className="border-collapse border border-gray-300">
  <thead>
    <tr>
      <th className="border border-gray-300 p-2">Produit</th>
      <th className="border border-gray-300 p-2">Épaisseur</th>
      <th className="border border-gray-300 p-2">Hauteur</th>
      <th className="border border-gray-300 p-2">Largeur</th>
      
    </tr>
  </thead>
  <tbody>
    {detailsDevis.productCart.map((item, index) => (
      <tr key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <td className="border border-gray-300 p-2">{item.product.nom}</td>
        <td className="border border-gray-300 p-2">{item.product.epaisseur}mm</td>
        <td className="border border-gray-300 p-2">{item.hauteur}m</td>
        <td className="border border-gray-300 p-2">{item.largeur}m</td>
        <td className="border border-gray-300 p-2">{item.quantite}m</td>
        <td className="border border-gray-300 p-2">
          {item.product.quantite && (
            <span className='text-green-700 font-semibold'>{item.product.quantite}m</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
      <div className=" flex justify-center mt-8">
      <Link to={`/addDevis/${detailsDevis._id}`}
                className='bg-blue-700 text-white px-4 py-2'
              >
                Créer Devis
              </Link>
      </div>
    </div>
    </div>
)}

      </div>
      
      <div className=' flex'>
        <ChartComponent />
        <CalendarComponent  /> 
      </div>
     
    </div>
  );
}
