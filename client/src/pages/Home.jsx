import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import MapComponent from '../components/Map/MapComponent';
import Contact from '../components/Map/Contact';
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
        <p className='text-gray-500 text-xs sm:text-sm'>
          Choisissez votre verre préféré,et nous le livrerons à votre maison.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-blue-200 dark:bg-slate-700 py-4'>
        <CallToAction />
      </div>
      <div className='py-10 '>
      <MapComponent/>
      </div>
    <div className='py-10 px-20 '>
    <Contact/>
    </div >
   
    </div>
  );
}
