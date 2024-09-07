import React from 'react';


import { CiCalendarDate } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
function MapComponent() {
   
  return (
    <div className="w-full px-4 sm:px-4 lg:px-4">
    <h2 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl text-center md:text-left">Notre Emplacement</h2>
    <div className="flex flex-wrap md:flex-nowrap md:space-x-4">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <iframe className="w-full h-96 md:h-96 rounded-2xl" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=G2CJ+X4X,%20Hiboun+(ISET%20MAHDIA)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" title="Google Map"></iframe>
      </div>
      <div className="w-full md:w-1/2 pt-10 md:pt-0">
        <div className="text-gray-900 dark:text-white px-4 md:px-10">
          <h2 className="mb-4 text-2xl font-bold"><CiLocationOn className="inline mr-2" />Localisation</h2>
          <p>Rue de la Republique, Mahdia 5100</p>
          <h2 className="mt-4 mb-2 text-2xl font-bold"><CiCalendarDate className="inline mr-2" />Ouverture</h2>
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
