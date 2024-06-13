import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/project/${projectId}`);
        const data = await res.json();
        if (res.ok) {
          setProject(data.data); // Access the project data correctly
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center p-5">
            <img
              src={project.image}
              alt={project.nom}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{project.nom}</h3>
            <p className="text-base sm:text-lg font-normal text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
