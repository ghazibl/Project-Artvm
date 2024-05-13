import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import MapComponent from '../components/Map/MapComponent';
import Contact from '../components/Map/Contact';
import CallToAccessoire from '../components/CallAccessoire';
import CallToProject from '../components/CallToProject';
import { CiDiscount1 } from "react-icons/ci";


export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Bienvenue chez ARTVM</h1>
        <h2 className='text-2xl font-bold lg:text-6xl'>Du verre sur-mesure pour toutes vos envies. </h2>       
        <p className='text-gray-500 text-xl '>
          Choisissez votre verre préféré,et nous le livrerons à votre maison.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-xl text-red-500 font-bold flex hover:underline'
        >
          Les remises <CiDiscount1  className='text-red-500 mt-1 ml-1 text-2xl'/>

        </Link>
      </div>
      <div className='bg-blue-100'>
      <div className='p-3  dark:bg-slate-700 py-4 mb-6 rounded-2xl'>
        <CallToAction />
      </div>
      <div className='p-3  dark:bg-slate-700 py-4 mt-10 rounded-2xl'>
        <CallToAccessoire />
      </div>
      <div className='p-3  dark:bg-slate-700 py-4 mt-10 rounded-2xl'>
        <CallToProject />
      </div >
      </div>
  <div className="py-10 px-20">
    <MapComponent />
  </div>
  
  <div className=" " id="contact-section">
    <Contact />
  </div>
  
    </div>
  );
}
