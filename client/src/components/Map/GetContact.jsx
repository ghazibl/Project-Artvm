import React, { useState, useEffect } from 'react';
import { FaComments } from "react-icons/fa";

const ContactComp = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 6;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Function to handle contact deletion
  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the deleted contact from the state
        setContacts(contacts.filter(contact => contact._id !== id));
      } else {
        console.error('Failed to delete contact:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Calculate the current contacts to display
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="container mx-auto py-16">
      <div className="w-full md:w-3/4 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 py-4 flex items-center">
  <FaComments className='mr-2' />
  Liste de messages
</h1>
        <ul>
          {currentContacts.map(contact => (
            <li key={contact._id} className="mb-4 p-4 bg-blue-100 rounded-lg">
              <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <div className="flex flex-col mb-4 md:mb-0 md:mr-4">
                  <p className='mr-3'><span className="font-bold">Name:</span><br/>{contact.name}</p>
                  <p className='mr-3'><span className="font-bold">Email:</span><br/>{contact.email}</p>
                  <p className='mr-3'><span className="font-bold">Phone:</span><br/>{contact.phone}</p>
                </div>           
                <div className="flex-1">
                  <p><span className="font-bold">Message:</span><br/>{contact.message}</p>
                </div>
                <button className='bg-blue-600 px-4 py-1 mt-2 md:mt-0 text-white rounded-lg'
                  onClick={() => handleDeleteContact(contact._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-center">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default ContactComp;
