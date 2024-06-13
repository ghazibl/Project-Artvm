// ImprimerDevis.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
  text: {
    marginBottom: 5,
  },
  product: {
    marginBottom: 5,
    paddingLeft: 10,
  },
  productName: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
  },
  addressSection: {
    marginBottom: 20,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

const ImprimerDevis = ({ devis }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.addressSection}>
        <Text style={styles.bold}>Artvm</Text>
        <Text style={styles.addressText}>
          Adresse: Rue de la Republique,
          <br />
          Mahdia 5100
        </Text>
        <Text style={styles.addressText}>Numéro tel: 28817593</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Devis</Text>
        <Text style={styles.header}>{new Date(devis.DateCreation).toLocaleDateString()}</Text>
        <Text style={styles.text}>Nom de Client: {devis.client?.username}</Text>
      </View>
      {devis.productCart.map((item) => (
        <View key={item._id} style={styles.section}>
          <Text style={styles.productName}>Produit: {item.product.nom}</Text>
          <Text style={styles.product}>
            {item.product.type === 'product'
              ? `${item.hauteur}m x ${item.largeur}m - Quantité: ${item.quantite} - ${item.prixCart} DT`
              : `Quantité: ${item.quantite} - ${item.prixCart} DT`}
          </Text>
        </View>
      ))}
      <View style={styles.section}>
        <Text style={styles.text}>Remise: {devis.Remise} %</Text>
        <Text style={styles.text}>Prix Après Remise: {devis.PrixApresRemise} DT</Text>
        <Text style={styles.text}>Date de Livraison: {new Date(devis.DateLivraison).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.footer}>Merci pour votre confiance!</Text>
    </Page>
  </Document>
);

export default ImprimerDevis;
