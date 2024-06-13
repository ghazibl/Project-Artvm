import React, { useEffect, useState } from 'react';

export default function ListProject() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/project/');
        const data = await res.json();
        if (res.ok) {
          setProjects(data.data); // Accéder correctement aux données des projets
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
      }
    };

    fetchProjects();
  }, []);

  if (projects.length === 0) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-5">
          {projects.map(project => (
            <div key={project._id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <img
                src={project.image}
                alt={project.nom}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{project.nom}</h3>
                <p className="text-base font-normal text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
