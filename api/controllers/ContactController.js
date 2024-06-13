import Contact from '../models/ContactModal.js'; // Assuming ContactModel.js exports the Contact schema

// GET request handler for retrieving all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST request handler for creating a new contact
const createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteContact = async (req, res) => {
    const { id } = req.params; // Get the contact ID from request parameters
  
    try {
      // Find the contact by ID and delete it
      const deletedContact = await Contact.findByIdAndDelete(id);
      
      if (!deletedContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
  
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
export { getAllContacts, createContact,deleteContact };
