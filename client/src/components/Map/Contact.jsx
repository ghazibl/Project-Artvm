import React from 'react';

const Contact = () => {
  return (

    <div className="flex justify-center items-center h-full  ">
      <div className="px-4 py-8  rounded-lg shadow-lg w-2/5 ">
        <h1 className="mb-4 text-4xl font-bold text-center py-8">Contactez-nous</h1>
        <div className="grid grid-cols-1 md:grid-cols- gap-4">
          <div>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom</label>
                <input type="text" placeholder='Entrez votre nom' className="form-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" id="name" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Adresse mail</label>
                <input type="email" placeholder='Entrez votre email' className="form-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" id="email" />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Numéro de téléphone mobile</label>
                <input type="tel" placeholder='Entrez votre numéro' className="form-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" id="phone" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Votre Demande</label>
                <textarea className="form-textarea w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" placeholder='Comment pouvons-nous vous aider ?' id="message" rows="5"></textarea>
              </div>
              <button type="submit" className="mx-auto block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline">Envoyer</button>
            </form>
          </div>
          <div>
            {/* Additional content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
