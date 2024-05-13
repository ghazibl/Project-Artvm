import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

const swiperSettings = {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    clickable: true,
  },
  pagination: { el: '.swiper-pagination', clickable: true },
  modules: [EffectCoverflow, Pagination, Navigation],
  initialSlide: 0, // Initialize with the first element
};

export default function CallToProject() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/accessoire/');
        const data = await res.json();
        if (res.ok) {
          const projectsFiltered = data.data.filter(project => project.type === 'Projet');
          setProjects(projectsFiltered);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!filteredProjects.length) {
    return <div>Aucun produit trouvé</div>;
  }
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className="text-center">
          <h3 className='mb-4 text-xl font-bold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-4xl dark:text-white py-8 px-20'>Exemples de nos Projets :</h3>
        </div>
        <div className="search-container mb-4 px-20 ">
          <input
            type="text"
            placeholder="Rechercher un Projet..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <Swiper {...swiperSettings} className="swiper_container">
        {filteredProjects.map((project) => (
          <SwiperSlide key={project._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ height: 'auto' }}>
            <Link to={`/project/${project._id}`}>
              <img src={project.image} alt={project.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
            </Link>
            <div className="p-5">
              <Link to={`/project/${project._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{project.nom}</Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-white">{project.description}</p>
              <Button href="/products" gradientDuoTone='blueToBlue' className='bg-black' rounded outline={true}>Lire la suite</Button>
            </div>
          </SwiperSlide>
        ))}
        <div className="slider-controler flex justify-center items-center">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}
