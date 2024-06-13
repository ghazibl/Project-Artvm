import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DemandeDevis = () => {
  const { id } = useParams();
  const [devisDetail, setDevisDetail] = useState(null);

  useEffect(() => {
    // Replace this with your actual API call to fetch the detail
    const fetchDevisDetail = async () => {
      const response = await fetch(`/api/devis/${id}`);
      const data = await response.json();
      setDevisDetail(data);
    };

    fetchDevisDetail();
  }, [id]);

  if (!devisDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Details for Devis {id}</h1>
      <p>Client: {devisDetail.client?.username}</p>
      <p>Date: {devisDetail.Date}</p>
      <h2>Products</h2>
      {devisDetail.productCart.map((item) => (
        <div key={item._id}>
          <p>Product: {item.product?.nom}</p>
          {/* Add other details as necessary */}
        </div>
      ))}
    </div>
  );
};

export default DemandeDevis;
