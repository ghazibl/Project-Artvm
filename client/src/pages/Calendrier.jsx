import React, { useState, useEffect } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FcCalendar } from "react-icons/fc";
import axios from 'axios';

const Calendrier = () => {
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = (slotInfo) => {
    setShowModal(true);
    setStartDate(slotInfo.startStr);
    setEndDate(slotInfo.endStr);
    setSelectedEvent(null); // Reset selected event
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log(event.id);
    setEventTitle(event.title);
    setStartDate(event.startStr);
    setEndDate(event.endStr);
    setShowModal(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const saveEvent = async () => {
    if (eventTitle && startDate && endDate) {
      if (selectedEvent) { // If selectedEvent is truthy, it means it's an existing event to be updated
        try {
          await axios.put(`/api/events/edit/${selectedEvent.id}`, {
            title: eventTitle,
            start: startDate,
            end: endDate
          });
          const updatedEvents = events.map(ev => ev.id === selectedEvent.id ? { ...ev, title: eventTitle, start: startDate, end: endDate } : ev);
          setEvents(updatedEvents);
          setSelectedEvent(null);
        } catch (error) {
          console.error('Error updating event:', error);
        }
      } else { 
        try {
          const response = await axios.post('/api/events', {
            title: eventTitle,
            start: startDate,
            end: endDate
          });
          setEvents([...events, response.data]);
          setEventTitle('');
        } catch (error) {
          console.error('Error saving event:', error);
        }
      }
      
      setShowModal(false);
    }
  };
 
  const deleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
        console.log(selectedEvent);
        console.log(selectedEvent.id);
      try {
        await axios.delete(`http://localhost:3000/api/events/${selectedEvent.id}`);
        const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        setEvents(updatedEvents);
        setSelectedEvent(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    } else {
      console.error('Selected event or its ID is undefined');
    }
  };
  return (
    <div className='w-3/4 mb-10'>
      <h1 className="flex items-center text-3xl py-4 px-4"> 
        <FcCalendar size={38} className="mr-2" />
        Calendrier
      </h1>
      <div className="form-container">
        {showModal && (
          <div className="w-2/4">
            <div className="modal-dialog bg-white rounded-lg overflow-hidden">
              <div className="modal-content">
                <div className="modal-header  px-4 ">
                  <h5 className="modal-title text-lg font-bold">{selectedEvent ? 'Modifier' : 'Ajouter un'} événement :</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body px-4 ">
                  <label htmlFor="eventTitle" className="block mb-1">Titre de l'événement :</label>
                  <input type="text" id="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1 mb-2" />
                  
                  <label htmlFor="startDate" className="block mb-1">Date de début :</label>
                  <input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1 mb-2" />
          
                  <label htmlFor="endDate" className="block mb-1">Date de fin :</label>
                  <input type="datetime-local" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1 mb-2" />
                </div>
                <div className="modal-footer flex justify-between px-4 py-2 mb-10">
                  {selectedEvent && (
                    <button type="button" className="text-white bg-red-500 rounded-lg px-4 py-2" onClick={deleteEvent}>Supprimer</button>
                  )}
                  <button type="button" className="text-white bg-blue-700 rounded-lg px-4 py-2" onClick={saveEvent}>{selectedEvent ? 'Enregistrer les modifications' : 'Enregistrer'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ml-10 ">
        <Fullcalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={"90vh"}
        
          events={events}
          selectable={true}
          select={handleSelectSlot}
          eventClick={handleSelectEvent}
        />
      </div>
    </div>
  );
};

export default Calendrier;
