import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FcCalendar } from "react-icons/fc";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(moment().format('LTS'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('LTS'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const day = moment(selectedDate).format('DD');
  const month = moment(selectedDate).format('MM');
  const year = moment(selectedDate).format('YY');

  return (
    <div className=" mr-20 mt-10 bg-white w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center font-bold shadow-lg rounded-lg mx-auto">
  <div className="flex justify-center items-center mb-4"> {/* Added mb-4 for bottom margin */}
    <a href="/dashboard?tab=Calendrier" className="flex items-center text-blue-500 justify-center">
      <FcCalendar className="text-4xl" />
      <span className="ml-2 text-2xl">Calendrier</span>
    </a>
  </div>
  <div className="mt-4">
    <h1 className="text-lg font-bold text-gray-500">Aujourd'hui:</h1>
    <div className="flex justify-center items-center mt-4 flex-wrap max-w-xs mx-auto">
      <div className="bg-gray-100 p-4 m-2 text-center rounded-lg shadow-md w-20">
        <div className="text-4xl font-bold">{day}</div>
        <div className="text-sm text-gray-500 mt-2">Day</div>
      </div>
      <div className="bg-gray-100 p-4 m-2 text-center rounded-lg shadow-md w-20">
        <div className="text-4xl font-bold">{month}</div>
        <div className="text-sm text-gray-500 mt-2">Month</div>
      </div>
      <div className="bg-gray-100 p-4 m-2 text-center rounded-lg shadow-md w-20">
        <div className="text-4xl font-bold">{year}</div>
        <div className="text-sm text-gray-500 mt-2">Year</div>
      </div>
    </div>
  </div>
  <div className="flex justify-center items-center mt-6">
    <div className="bg-gray-100 py-4 text-center rounded-lg shadow-md w-full max-w-xs">
      <h3 className="text-lg font-bold text-gray-500">Heure actuelle:</h3>
      <p className="font-bold text-4xl text-gray-700 pt-2">{currentTime}</p>
    </div>
  </div>
</div>
  );
};

export default CalendarComponent;
