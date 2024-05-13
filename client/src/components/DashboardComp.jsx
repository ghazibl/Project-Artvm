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
import StockChart from './StockChart';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCommande, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [details, setDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        const res = await fetch('http://localhost:3000/api/commande/getAll?limit=5');
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          setCommandes(data);
          setTotalPosts(4);
          setLastMonthPosts(2);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
  
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchCommande();
      fetchComments();
    }
  }, [currentUser]);

  const fetchCommandDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/commande/commandes/${id}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching command details:', error);
    }
  };
  const handleConfirme = async (id) => {

    try {
      console.log(id);
      const response = await axios.put(`http://localhost:3000/api/commande/confirm/${id}`);
     
      if (response.data && response.data.success) {
        // Successful update, you can perform additional actions if needed
        console.log('Commande confirme avec succès');
        setDetails(null);
      } else {
        // Error handling
        console.error(response.data && response.data.message);
      }
    } catch (error) {
      // Request error handling
      console.error('Une erreur s\'est produite lors de la mise à jour du statut de la commande :', error);
    }
    console.log(id);
    navigate(`/addDevis?commandeId=${id}`);
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
              Totales Factures
              </h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Le mois dernier</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Totales Commandes</h3>
              <p className='text-2xl'>{totalCommande}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Le mois dernier</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
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
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Factures</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=comments'}>Voir tous</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-96'>
                        <p className='line-clamp-2'>{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'> Commandes</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=commandes'}>Voir tous</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Client </Table.HeadCell>
              <Table.HeadCell>produit </Table.HeadCell>
              <Table.HeadCell>Date </Table.HeadCell>
              
            </Table.Head>
            {commandes &&
              commandes.map((post) => (
                <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='flex items-center'>
                      <img
                        src={post.client.profilePicture}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                      <p className='mx-4'> {post.client.username}</p>
                    </Table.Cell>
                    
                    <Table.Cell >{post.cart.product.nom}</Table.Cell>
                    <Table.Cell >{(post.Date).slice(0,10)}</Table.Cell>
                    <Table.Cell ><button onClick={() => fetchCommandDetails(post._id)} className='text-blue-700 '><FaEye/></button></Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {details && (
  <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="modal-container bg-white w-96 p-6 rounded-lg shadow-lg">
      <div className='flex justify-between'>
      <h3 className="text-xl font-semibold mb-4 ">Demande par <strong className='text-green-700'>{details.client.username}</strong></h3>
      <button onClick={() => setDetails(null)} className="btn-primary text-2xl text-black px-2 py-2 rounded-lg"><IoCloseSharp /></button>
      </div>
      <div>
      
        <p>Produit: {details.cart.product.nom}</p>
        <p>Epaisseur: {details.cart.product.epaisseur}</p>
        <p>Hauteur: {details.cart.hauteur} m</p>
        <p>Largeur: {details.cart.largeur} m</p>
        
        <p>Quantité Commander: {details.cart.quantite} m </p>
        <p className='text-green-700 font-semibold'>Quantité En Stock: {details.cart.product.quantite} m </p>
        
        {/* Add more command details here */}
      </div>
      <div className="flex justify-center mt-8">
      <button className='bg-blue-700 rounded px-2 py-2 text-white'  onClick={() => handleConfirme(details._id)}>Confirmer</button>
      <button className='bg-red-700 rounded px-4 py-2 mx-4 text-white' onClick={() => handleRefuse(details._id)}>Refuser</button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
     
    </div>
  );
}
