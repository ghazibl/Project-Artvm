import React from 'react';

const Contact = () => {
  return (

    <div className="container w-full px-4 py-16">  {/* Added container and basic paddings */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1> {/* Adjusted heading styles */}
        <form className="w-full max-w-xl"> {/* Constrain form width */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom</label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              id="name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Adresse mail</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              id="email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Numéro de téléphone mobile</label>
            <input
              type="tel"
              placeholder="Entrez votre numéro"
              className="form-input w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              id="phone"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Votre Question :</label>
            <textarea
              className="form-textarea w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Comment pouvons-nous vous aider ?"
              id="message"
              rows="5"
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
