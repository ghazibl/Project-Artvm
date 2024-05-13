import React from 'react';
import { Bar } from 'react-chartjs-2';

const StockChart = () => {
  // Données statiques pour les quantités de produits par catégorie
  const data = [20, 30, 50]; // Exemple : 20 miroirs, 30 chagrins, 50 lisses

  // Préparation des données pour le graphique
  const chartData = {
    labels: ['Miroir', 'Chagrin', 'Lisse'],
    datasets: [
      {
        label: 'Quantité de produits par catégorie',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Couleur pour Miroir
          'rgba(54, 162, 235, 0.6)',  // Couleur pour Chagrin
          'rgba(255, 206, 86, 0.6)'   // Couleur pour Lisse
        ],
      },
    ],
  };

  // Configuration des options du graphique
  const chartOptions = {
    scales: {
      x: {
        type: 'category', // Utilisation de l'échelle de catégorie pour l'axe X
        labels: {
          // Configuration des options des labels
          color: 'black', // Couleur du texte des labels
        },
      },
      y: {
        // Configuration de l'axe Y (optionnel)
      },
    },
  };

  return (
    <div>
      <h2>Répartition des quantités de produits par catégorie</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart;
