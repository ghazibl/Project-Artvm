import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdSearch } from "react-icons/io";
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

export default function CallToAccessoire() {
  const [accessoires, setAccessoires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState([]);

  
const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAccessoires = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/acces');
        const data = await res.json();
        if (res.ok) {
          // Filtrer les accessoires avec le type "Accessoire"
          
          setAccessoires(data);
        }
      } catch (error) {
        console.error('Error fetching accessoires:', error);
      }
    };

    fetchAccessoires();
    const fetchUserInfo = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(`http://localhost:3000/api/user/${currentUser._id}`);
          console.log(currentUser._id);
          const data = await res.json();
          if (res.ok) {
            setUserInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    };
  
    fetchUserInfo();
  
  }, [],[currentUser]);

  // Filtrer les accessoires en fonction du terme de recherche
  const filteredAccessoires = accessoires.filter(accessoire =>
    accessoire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredAccessoires.length) {
    return <div>Aucun accessoire trouvé</div>;
  }

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-20 py-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold leading-none tracking-tight text-gray-700 dark:text-white">
            Accessoires et quincaillerie :
          </h3>
        </div>
        <div className="relative mb-4 md:mb-0">
  <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
  <input
    type="text"
    placeholder="Rechercher accessoire..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  />
</div>
        {currentUser ? (
          <Link
            to="/listAccess"
            className="bg-green-500 rounded-lg px-4 py-2 text-white"
          >
            Voir Tous
          </Link>
        ) : (
          <div></div>
        )}
      </div>
      <Swiper {...swiperSettings} className="swiper_container">
        {accessoires.map(accessoire => (
          <SwiperSlide key={accessoire._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link to={`/product/${accessoire._id}`}>
              <img src={accessoire.image} alt={accessoire.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
            </Link>
            <div className="p-5">
              <Link to={`/product/${accessoire._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{accessoire.nom}</Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-white">{accessoire.description}</p>
              <div className='flex justify-between'>
                <p className="mb-3 font-bold text-gray-700 dark:text-white">{accessoire.prix} DT</p>
                <p className={`mb-2 text-xl font-bold ${accessoire.status === 'En stock' ? 'text-green-500' : 'text-red-500'} dark:text-white`}>{accessoire.status}</p>
              </div>
              <>
      {currentUser  ?  (
        <Link to={`/product/${accessoire._id}`}>
          <Button gradientDuoTone='blueToBlue'  className='bg-blue-600 text-white' rounded outline={true}>
            Lire la suite
          </Button>
        </Link>
      ) : (
        <Link to="/sign-in" className='bg-blue-700 text-white px-2 py-1 rounded-lg content-center'>
          Lire la suite
        </Link>
      )}
    </>
              
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
