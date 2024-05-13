import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
export default function CallToAccessoire() {
  const [accessoires, setAccessoires] = useState([]);

  useEffect(() => {
    const fetchAccessoires = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/accessoire/');
        const data = await res.json();
        if (res.ok) {
          // Filtrer les accessoires avec le type "Accessoire"
          const accessoiresFiltered = data.data.filter(accessoire => accessoire.type === 'Accessoire');
          setAccessoires(accessoiresFiltered);
        }
      } catch (error) {
        console.error('Error fetching accessoires:', error);
      }
    };

    fetchAccessoires();
  }, []);

  return (
    <div className="w-3/4 ml-20">
       
      <h3 className='mb-4 text-xl font-bold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-4xl dark:text-white py-8 '>Liste de Accessoires</h3>
      
     
      <table className="table-auto w-full">
        <thead>
          <tr className='bg-gray-100'>
          <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Nom</th>
            
            <th className="px-4 py-2">Prix</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {accessoires.map((accessoire) => (
            <tr key={accessoire._id}>
                 <td className="border px-4 py-2"><img src={accessoire.image} alt={accessoire.nom} className="w-16 h-16 object-cover rounded" /></td>
              <td className="border px-4 py-2">
                <Link to={`/accessoire/${accessoire._id}`} className="text-blue-500 hover:underline">{accessoire.nom}</Link>
              </td>
              
              <td className="border px-4 py-2">{accessoire.prix} DT</td>
              <td className="border px-4 py-2 text-green-500">{accessoire.Status}</td>
              <td className="border px-4 py-2 text-green-500">
               
              <div className="flex ml-10">
    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 py-2 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 px-2 py-1 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
      onClick={() => handleUpdate(product._id)} >modifier</button>
    <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium  rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
     onClick={() => {
      handleDetail(product._id);
     
    }}>Detail</button>
    </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
