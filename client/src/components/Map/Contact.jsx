import React, { useState } from 'react';
import contact1 from '../../assets/contact1.jpg';
import contact2 from '../../assets/contact2.jpg'
import contact from '../../assets/contact.avif'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Successful submission
        console.log('Form submitted successfully');
        // Reset form fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container w-full py-16 px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col justify-center items-center py-2">
    <form className="w-full max-w-xl bg-white border rounded-3xl px-4 py-4" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 py-4">Contactez-nous</h1>
      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom</label>
        <input
          type="text"
          placeholder="Entrez votre nom"
          className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          id="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Adresse mail</label>
        <input
          type="email"
          placeholder="Entrez votre email"
          className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Numéro de téléphone mobile</label>
        <input
          type="tel"
          placeholder="Entrez votre numéro"
          className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Votre Question :</label>
        <textarea
          className="form-textarea w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Comment pouvons-nous vous aider ?"
          id="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto block">
        Envoyer
      </button>
    </form>
  </div>
</div>
  );
};

export default Contact;
