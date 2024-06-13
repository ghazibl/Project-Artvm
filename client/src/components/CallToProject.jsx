import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { IoMdSearch } from "react-icons/io";
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';

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
  const [userInfo, setUserInfo] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/project/');
        const data = await res.json();
        if (res.ok) {
          console.log("Projects fetched: ", data); // Log the fetched data
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(`http://localhost:3000/api/user/${currentUser._id}`);
          const data = await res.json();
          if (res.ok) {
            console.log("User info fetched: ", data); // Log the fetched data
            setUserInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    };

    fetchUserInfo();
    fetchProjects();
  }, [currentUser]);

  // Temporarily remove filtering logic to test the fetch
  // const filteredProjects = projects.filter(project =>
  //   project.nom.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className='relative'>
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-20 py-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold leading-none tracking-tight text-gray-700 dark:text-white">
            Exemples de nos Projets :
          </h3>
        </div>
        <div className="relative mb-4 md:mb-0">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Rechercher produit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {currentUser &&  (
          <Link
            to="/tousProjet"
            className="bg-green-500 rounded-lg px-4 py-2 text-white"
          >
            Voir Tous
          </Link>
        )}
      </div>
      {projects.length ? (
        <Swiper {...swiperSettings} className="swiper_container">
          {projects.map((project) => (
            <SwiperSlide key={project._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ height: 'auto' }}>
              <Link to={`/project/${project._id}`}>
                <img src={project.image} alt={project.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
              </Link>
              <div className="p-5">
                <Link to={`/project/${project._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {project.nom}
                </Link>
                <p className="mb-3 font-normal h-16 text-gray-700 dark:text-white">
  {project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
</p>
                {currentUser ? (
                  <Link to={`/project/${project._id}`}>
                    <Button gradientDuoTone='blueToBlue' className='bg-blue-600 text-white' rounded outline={true}>
                      Lire la suite
                    </Button>
                  </Link>
                ) : (
                  <Link to="/sign-in" >
                    <Button gradientDuoTone='blueToBlue' className='bg-blue-600 text-white' rounded outline={true}>
                      Lire la suite
                    </Button>
                  </Link>
                )}
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
      ) : (
        <div className="text-center text-gray-700 dark:text-white">Aucun projet trouvé</div>
      )}
    </div>
  );
}
