import React, { useState, useEffect } from 'react';

function AdGrid() {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        // Fetch ads from the backend
        fetch('http://127.0.0.1:5000/api/ads/all') // Update the API endpoint as needed
            .then(response => response.json())
            .then(data => setAds(data))
            .catch(error => console.error('Error fetching ads:', error));
    }, []);

    return (
        <div className="grid-container">
            {ads.map(ad => (
                <div key={ad._id} className="grid-item">
                    <h2>{ad.title}</h2>
                    <img src={ad.imageLinks[0]} alt={ad.title} />
                    <p>{ad.description}</p>
                    <p>{ad.price}</p>
                </div>
            ))}
        </div>
    );
}

export default AdGrid;