import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import MapComponent from '../components/Map/MapComponent';
import Contact from '../components/Map/Contact';
import CallToAccessoire from '../components/CallAccessoire';
import CallToProject from '../components/CallToProject';
import { CiDiscount1 } from "react-icons/ci";




import g from '../assets/image7.jpg';

import i from '../assets/image9.jpg';
import v from '../assets/image10.jpg';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const images = [i,v,g];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  return (
    
     
     <div className="">
      {/* Carousel container */}
      <div className="relative w-full h-screen">
        {/* Carousel indicators */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-0 mb-4">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 mx-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Carousel items */}
        <div className="relative w-full overflow-hidden h-screen">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={image} className="block w-full h-full object-cover" alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <button
          className="absolute top-0 bottom-0 left-0 z-30 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline"
          type="button"
          onClick={goToPrevSlide}
        >
          <span className="inline-block bg-no-repeat" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </span>
          <span className="hidden">Previous</span>
        </button>
        <button
          className="absolute top-0 bottom-0 right-0 z-30 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline"
          type="button"
          onClick={goToNextSlide}
        >
          <span className="inline-block bg-no-repeat" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
          <span className="hidden">Next</span>
        </button>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col gap-6 p-32 px-16 mt-40 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl text-cyan-500">Bienvenue chez ARTVM</h1>
        <h2 className="text-xl font-bold lg:text-5xl text-black">Du verre sur-mesure pour toutes vos envies.</h2>
        <p className=" text-black  font-bold text-3xl">
          Choisissez votre verre préféré, et nous le livrerons à votre maison.
        </p>
      
      </div>

      


      <div className='bg-blue-100'>
      <div className='p-3  dark:bg-slate-700 py-4 mb-6 rounded-2xl mb-10 pt-20'>
        <CallToAction />
      </div>
      <div className='p-3  dark:bg-slate-700 py-4 mt-10 rounded-2xl mb-10 pt-20'>
        <CallToAccessoire />
      </div>
      <div className='p-3  dark:bg-slate-700 py-4 mt-10 rounded-2xl mb-10 pt-20'>
        <CallToProject />
      </div >
      <div className="py-10 px-20">
    <MapComponent />
  </div>
  
  <div className=" " id="contact-section">
    <Contact />
  </div>
      </div>
 
  
    </div>
  );
}
