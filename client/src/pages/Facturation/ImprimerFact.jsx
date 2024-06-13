import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 20,
    textAlign: 'center',
  },
  headerLeft: {
    textAlign: 'right',
    fontSize: 20,
    textAlign: 'center',
  },
  center: {
    fontSize: 30,
    paddingTop: 200,
  },
  headerRight: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 60,
    paddingRight: 20,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    paddingBottom: 40,
    textTransform: 'uppercase',
    marginTop: 40,
    marginLeft: 20,
  },
  section: {
    marginBottom: 10,
    fontSize: 20,
    paddingTop: 40,
    marginLeft: 20,
  },
  detailRow: {},
  label: {},
  table: {
    paddingLeft: 20,
  },
  tableRow: {
    display: 'table-row',
  },
  tableHeader: {
    display: 'table-cell',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: '#bfbfbf',
    borderBottomColor: '#bfbfbf',
    fontSize: 25,
    textAlign: 'center',
  },
  tableCell: {
    display: 'table-cell',
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: '#bfbfbf',
    borderBottomColor: '#bfbfbf',
    fontSize: 25,
  },
  footer: {
    textAlign: 'left',
    fontStyle: 'italic',
    fontSize: 30,
    paddingLeft: 20,
  },
  text: {
    paddingBottom: 40,
    fontSize: 20,
  },
  texttt: {
    fontSize: 30,
    marginLeft: 20,
    fontStyle: 'italic',
  },
});

const PrintableInvoice = forwardRef(({ facture }, ref) => {
  if (!facture) {
    return null;
  }

  return (
    <div ref={ref}>
      <Document key={facture._id}>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text><strong>Artvm</strong></Text><br />
              <Text>Toutes de verre et Miroir</Text><br />
              <Text>Tél / Fax : 73 674 071</Text><br />
              <Text> 20 530 544</Text><br />
              <Text> CCP : 17503000000064562041</Text><br />
              <Text> BT : 05501000014313557843</Text>
            </View>
            <View style={styles.center}>
              <Text>BL/Facture <br /> N°{facture.numero}</Text><br />
            </View>
            <View style={styles.headerRight}>
              <Text>MF : 1406521G/N/M/000</Text><br /><br /><br /><br /><br /><br /><br /><br />
              <Text>Mahdia, le {new Date(facture.date).toLocaleDateString('fr-FR')}</Text><br />
            </View>
          </View>
          <Text style={styles.texttt}>M {facture.commande.client.username}</Text><br />

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}> Quantité <br />الكمية </Text>
              <Text style={styles.tableHeader}>DESIGNATION <br />نوع البضاعة</Text>
              <Text style={styles.tableHeader}>P.U.<br />س الفردي</Text>
              <Text style={styles.tableHeader}>MONTANT<br />الجملة</Text>
            </View>
            {facture.commande.productCart.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.quantite} </Text>
                <Text style={styles.tableCell}>
                  {item.product.type === 'product' ? (
                    <>
                      {item.product.nom} : {item.product.epaisseur}mm - D: {item.hauteur}m x {item.largeur}m
                    </>
                  ) : (
                    item.product.nom
                  )}
                </Text>
                <Text style={styles.tableCell}>{item.product.prix}</Text>
                <Text style={styles.tableCell}>{item.prixCart} DT</Text>
              </View>
            ))}
          </View><br /><br />

          <Text style={styles.footer}>
            Arrêtée à la somme de {facture.montantTTC}
          </Text>
        </Page>
      </Document>
    </div>
  );
});

export default PrintableInvoice;
