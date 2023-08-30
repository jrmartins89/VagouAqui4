import React, { useState, useEffect } from 'react';
import './AdGrid.css'; // Import the CSS file for styling

function AdGrid() {
    const [ads, setAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(5);
    const [neighborhoodFilter, setNeighborhoodFilter] = useState('');

    useEffect(() => {
        // Fetch ads from the backend
        fetch('http://127.0.0.1:5000/api/ads/all') // Update the API endpoint as needed
            .then(response => response.json())
            .then(data => {
                setAds(data);
                setFilteredAds(data);
            })
            .catch(error => console.error('Error fetching ads:', error));
    }, []);

    useEffect(() => {
        // Filter ads based on the selected neighborhood
        if (neighborhoodFilter === '') {
            setFilteredAds(ads);
        } else {
            const filtered = ads.filter(ad => ad.neighbourhood === neighborhoodFilter);
            setFilteredAds(filtered);
        }
        setCurrentPage(1); // Reset current page when filtering
    }, [neighborhoodFilter, ads]);

    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="grid-container">
            <div className="filter-section">
                <label>Filter by Neighbourhood:</label>
                <select onChange={e => setNeighborhoodFilter(e.target.value)}>
                    <option value="">All</option>
                    {[...new Set(ads.map(ad => ad.neighbourhood))].map(neighbourhood => (
                        <option key={neighbourhood} value={neighbourhood}>
                            {neighbourhood}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid">
                {currentAds.map(ad => (
                    <div key={ad._id} className="grid-item">
                        <h2>{ad.title}</h2>
                        <img src={ad.imageLinks[0]} alt={ad.title} className="ad-image" />
                        <p className="ad-description">{ad.description}</p>
                        <p className="ad-price">{ad.price}</p>
                        <p className="ad-neighbourhood">Neighbourhood: {ad.neighbourhood}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredAds.length / adsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AdGrid;