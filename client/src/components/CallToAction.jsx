import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
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
  pagination: { el: '.swiper-pagination', clickable: true, dynamicMainBullets: 5 },
  modules: [EffectCoverflow, Pagination, Navigation],
  initialSlide: 0, // Initialize with the first element
};

export default function CallToAction() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredProducts.length) {
    return <div>Aucun produit trouvé</div>;
  }

  return (
    <div className='h-full'>
     <div className='flex justify-between items-center'>
     <div className="text-center">
    <h3 className='mb-4 text-xl font-bold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-4xl dark:text-white py-8 px-20'>Verre et Miroirs sur mesure :</h3>
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
        {filteredProducts.map((product) => (
          <SwiperSlide key={product._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.nom} className="rounded-t-lg w-full h-40 object-cover bg-gray-500" />
            </Link>
            <div className="p-5">
              <p to={`/product/${product._id}`} className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{product.nom}</p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
              <p className="mb-3 font-bold text-gray-700 dark:text-gray-400">Épaisseur :{product.epaisseur}mm</p>
              <div className='flex justify-between'>
                <p className="mb-3 font-bold text-gray-700 dark:text-gray-400">{product.prix} DT</p>
                <p className={`mb-2 text-xl font-bold ${product.status === 'En stock' ? 'text-green-500' : 'text-red-500'} dark:text-white`}>{product.status}</p>
              </div>
              <Link to={`/product/${product._id}`} className='bg-blue-700 text-white px-2 py-1 rounded-lg content-center'>Lire la suite</Link>
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
