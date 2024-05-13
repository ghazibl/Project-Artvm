import React, { useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase.js';

const AjoutAccessoire = () => {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [quantite, setQuantite] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const storage = getStorage(app);
            const storageRef = ref(storage, `images/${image.name}`);
            
            // Upload the image to Firebase Storage
            const uploadTask = uploadBytes(storageRef, image);
            uploadTask.then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                
                // After image upload is successful, send data to backend
                const response = await axios.post('http://localhost:3000/api/accessoire/', {
                    nom,
                    description,
                    prix,
                    quantite,
                    type,
                    status,
                    image: downloadURL  // Use the downloadURL obtained from Firebase
                });

                console.log('New Accessoire added:', response.data);
                // Reset form fields after successful submission
                setNom('');
                setDescription('');
                setPrix('');
                setQuantite('');
                setType('');
                setStatus('');
                setImage(null); // Clear the selected image
            });
        } catch (error) {
            console.error('Error adding new Accessoire:', error.response.data.error);
            setError('Failed to add Accessoire. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mb-10">
            <h2 className="text-2xl mb-4 font-bold">Ajout d'Accessoire</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 w-full">
                        <option value="">-- Sélectionner --</option>
                        <option value="Accessoire">Accessoire</option>
                        <option value="Projet">Projet</option>
                    </select>
                </div>
                {type === 'Accessoire' && (
                    <>
                        <div>
                            <label className="block mb-1">Nom:</label>
                            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label className="block mb-1">Description:</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label className="block mb-1">Prix:</label>
                            <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label className="block mb-1">Quantité:</label>
                            <input type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label className="block mb-1">Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                <option value="">-- Sélectionner --</option>
                                <option value="En stock">En stock</option>
                                <option value="Épuisé">Épuisé</option>
                            </select>
                        </div>
                    </>
                )}
                {type === 'Projet' && (
                    <>
                        <div>
                            <label className="block mb-1">Nom:</label>
                            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label className="block mb-1">Description:</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                    </>
                )}
                <div>
                    <label className="block mb-1">Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Ajouter</button>
            </form>
        </div>
    );
};

export default AjoutAccessoire;
