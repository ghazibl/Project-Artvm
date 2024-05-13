import React from 'react';


import { CiCalendarDate } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
function MapComponent() {
   
  return (
    <div className='w-full'>
    <h2 className='mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>Notre Emplacement </h2>
    <div className='flex flex-wrap md:flex-nowrap md:space-x-4'>
      <div className='w-full md:w-1/2'>
        <iframe className='w-full h-96 md:h-96 rounded-2xl' src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Boulangerie%20El%20Bey,%20Rue%20de%20la%20Republique,%20Mahdia,%20Tunisie+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" title="Google Map"></iframe>
      </div>
      <div className='w-full md:w-1/2 pt-10'>
        <div className='text-gray-900 dark:text-white px-10'>
          <h2 className='mb-4 text-2xl font-bold'><CiLocationOn className='inline mr-2 ' />Localisation</h2>
          <p>Rue de la Republique, Mahdia 5100</p>
          <h2 className='mt-4 mb-2 text-2xl font-bold'><CiCalendarDate className='inline mr-2'/>Ouverture</h2>
          <p>Du lundi au Vendredi : 8h - 12h et 13h30 - 18h</p>
          <p>Samedi : 8h - 12h</p>
          <p>Dimanche : fermée</p>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default MapComponent;
