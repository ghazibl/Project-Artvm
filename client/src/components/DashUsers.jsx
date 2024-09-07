import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalDetaille, setShowModalDetaille] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user details
  const [userInvoices, setUserInvoices] = useState([]);
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const res = await fetch('http://localhost:3000/api/user/getusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const fetchUserInvoices = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const res = await axios.get(`http://localhost:3000/api/factures/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserInvoices(res.data.factures); // Set user invoices in state
      setShowModalDetaille(true);
        } catch (error) {
      console.error('Error fetching user invoices:', error.message);
    }
  };
  useEffect(() => {
    if (selectedUser) {
      fetchUserInvoices(selectedUser._id); // Fetch invoices when selectedUser changes
    }
  }, [selectedUser]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/user/getusers?startIndex=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:3000/api/user/delete/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setUsers(users.filter((user) => user._id !== userIdToDelete));
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  // Function to handle click on "Détail"
  const handleShowDetailModal = (user) => {
    setSelectedUser(user); // Set the selected user for detail modal
    setShowModalDetaille(true); // Show the detail modal
  };
  const handleCloseUserModal = () => {
    setShowModalDetaille(false);
    setSelectedUser(null); // Clear selected user
  };
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Création</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Nom</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleShowDetailModal(user)} // Handle click on "Détail"
                      className='font-medium text-blue-500 hover:underline cursor-pointer'
                    >
                      Détail
                    </span>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer ml-4'
                    >
                      Supprimer
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-2'
            >
              Voir plus
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      {/* Detail modal */}
      {selectedUser && (
  <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="modal-container bg-white sm:w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-6 rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
  <h3 className="text-xl mb-4">
    Détails de l'utilisateur : 
  </h3>
  <button
    onClick={handleCloseUserModal}
    className="btn-primary text-2xl text-black px-2 py-2 rounded-lg self-start"
    style={{ marginTop: "-0.5rem" }} // Adjust the margin-top as needed
  >
    x
  </button>
</div>
      <div>
        <div className="flex items-center mb-4">
          <img
            src={selectedUser.profilePicture}
            alt={selectedUser.username}
            className="w-20 h-20 object-cover bg-gray-500 rounded-full mr-4"
          />
          <div>
            <p className="text-lg font-semibold">{selectedUser.username}</p>
            <p className="text-gray-600">{selectedUser.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <p>
            <strong>Adresse :</strong> {selectedUser.address}
          </p>
          <p>
            <strong>Téléphone :</strong> {selectedUser.phoneNumber}
          </p>
        </div>
        <div>
          <p>
            <strong>Statut :</strong>{" "}
            {selectedUser.isActive ? (
              <span className="text-green-500">Actif</span>
            ) : (
              <span className="text-red-500">Inactif</span>
            )}
          </p>
          <p>
            <strong>Rôle :</strong>{" "}
            {selectedUser.isAdmin ? (
              <span className="text-green-500">Admin</span>
            ) : (
              <span className="text-gray-500">Utilisateur standard</span>
            )}
          </p>
         
                    {userInvoices.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold text-blue-700">Factures :</h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {userInvoices.map((invoice) => (
  <li key={invoice._id} className="">
    <div className="flex justify-between items-center">
      <div>
        <p className="">Numéro de facture : {invoice.numero}</p>
        {/* Check if commande and productCart exist before accessing product */}
        {invoice.commande && invoice.commande.productCart && invoice.commande.productCart.length > 0 && (
          <p className="">Produit commander: {invoice.commande.productCart[0].product.nom}</p>
        )}
        
        <p className="">Montant: {invoice.montantTTC} €</p>
        <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
      </div>
      <div>
       
      </div>
    </div>
  </li>
))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
)}
      {/* Delete confirmation modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Oui, je suis sûr
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Non, annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
