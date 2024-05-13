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

export default function CallToAccessoire() {
  const [accessoires, setAccessoires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrer les accessoires en fonction du terme de recherche
  const filteredAccessoires = accessoires.filter(accessoire =>
    accessoire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredAccessoires.length) {
    return <div>Aucun accessoire trouvé</div>;
  }

  return (
    <div className="relative">
      <div className='flex justify-between items-center'>
        <div className="text-center mx-auto">
          <h3 className='mb-4 text-xl font-bold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-4xl dark:text-white py-8 px-20'>Accessoires et quincaillerie :</h3>
        </div>
        <div className="search-container mb-4 px-20 ">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <Swiper {...swiperSettings} className="swiper_container">
        {filteredAccessoires.map(accessoire => (
          <SwiperSlide key={accessoire._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link to={`/accessoire/${accessoire._id}`}>
              <img src={accessoire.image} alt={accessoire.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
            </Link>
            <div className="p-5">
              <Link to={`/accessoire/${accessoire._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{accessoire.nom}</Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-white">{accessoire.description}</p>
              <div className='flex justify-between'>
                <p className="mb-3 font-bold text-gray-700 dark:text-white">{accessoire.prix} DT</p>
                <p className={`mb-2 text-xl font-bold ${accessoire.Status === 'En stock' ? 'text-green-500' : 'text-red-500'} dark:text-white`}>{accessoire.Status}</p>
              </div>
              <Button href="#" gradientDuoTone='blueToBlue' className='bg-black' rounded outline={true}>Lire la suite</Button>
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
