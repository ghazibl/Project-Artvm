import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import './Chart.css';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const ChartComponent = () => {
  const [sourceData, setSourceData] = useState([]);

  useEffect(() => {
    // Fetch the data from the API
    axios.get('http://localhost:3000/api/products/categories/quantities')
      .then(response => {
        const data = response.data;
        console.log('API Data:', data); // Log raw data from API
        
        // Transform the data into the desired format
        const transformedData = data.map(item => ({
          label: item._id,
          value: item.totalQuantite,
        }));
        setSourceData(transformedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="chart mt-10">
        <div className="categoryCard ">
         
   
        <Bar
          data={{
            labels: sourceData.map(data => data.label),
            datasets: [
              {
                label: 'Quantité',
                data: sourceData.map(data => data.value),
                backgroundColor: [
                  'rgba(43, 63, 229, 0.8)',
                  'rgba(250, 192, 19, 0.8)',
                  'rgba(253, 135, 135, 0.8)',
                ],
                borderColor: [
                  'rgba(43, 63, 229, 0.8)',
                  'rgba(250, 192, 19, 0.8)',
                  'rgba(253, 135, 135, 0.8)',
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Quantité de produits par catégories',
              },
            },
          }}
        />
      </div>
     
  
    </div>
  );
};

export default ChartComponent;
