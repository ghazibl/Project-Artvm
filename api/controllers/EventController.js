import Event from '../models/EventModel.js';

// Créer un événement
export const createEvent = async (req, res) => {
  try {
    const { title, start, end } = req.body;
    const newEvent = new Event({ title, start, end });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id) ;
           await Event.findByIdAndDelete(id);
         
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: 'Event not found' });
    }
  };

  export const updateEvent = async (req, res) => {
    const eventId = req.params.id; // ID de l'événement à mettre à jour
    const { title, start, end } = req.body; // Données mises à jour

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.title = title;
        event.start = start;
        event.end = end;
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
};