import React from 'react';
import { Modal } from 'flowbite-react';

const InvoiceDetailsModal = ({ isOpen, onClose, facture }) => {
  if (!facture) return null;

  return (
    <Modal show={isOpen} onClose={onClose} >
      <Modal.Header>
    <h2>Facture N°{facture.numero}</h2>
      </Modal.Header>
      <Modal.Body>
        
        <p>Client: {facture.commande.client.username}</p>
        <p>Adresse : {facture.commande.client.address}</p>
        <p>Numero  tel : {facture.commande.client.phoneNumber}</p>
      
        
        
      
        <p>Remise: {facture.remise} %</p>
        <p>Frais de livraison: {facture.fraisLivraison }</p>
        
        <p>Date de Livraison: {new Date(facture.date).toLocaleDateString('fr-FR')}</p>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceDetailsModal;
