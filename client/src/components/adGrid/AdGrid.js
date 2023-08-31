import React, { useState, useEffect } from 'react';
import './AdGrid.css'; // Import the CSS file for styling
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


function AdGrid() {
    const [ads, setAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(5);

    useEffect(() => {
        async function fetchAds() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/ads/all'); // Update the API endpoint as needed
                const data = await response.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        }
        fetchAds();
    }, []);

    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="grid-container">
            <div className="grid">
                {currentAds.map(ad => (
                    <div key={ad._id} className="grid-item">
                        <h2>{ad.title}</h2>
                        <Carousel showArrows={true} infiniteLoop={true}>
                            {ad.imageLinks.map((imageLink, index) => (
                                <div key={index}>
                                    <img src={imageLink} alt={`Ad ${index}`} className="ad-image" />
                                </div>
                            ))}
                        </Carousel>
                        <p className="ad-description">{ad.description}</p>
                        <p className="ad-price">{ad.price}</p>
                        <p className="ad-neighbourhood">Bairro: {ad.neighbourhood}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(ads.length / adsPerPage) }).map((_, index) => (
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