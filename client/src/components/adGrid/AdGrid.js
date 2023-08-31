import React, { useState, useEffect } from 'react';
import './AdGrid.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Select from 'react-select';

function AdGrid() {
    const [ads, setAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(5);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null); // Selected neighborhood filter

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

    const neighborhoods = Array.from(new Set(ads.map(ad => ad.neighbourhood))); // Get unique neighborhoods
    const filteredAds = selectedNeighborhood
        ? ads.filter(ad => ad.neighbourhood === selectedNeighborhood.value)
        : ads;
    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const neighborhoodOptions = neighborhoods.map(neighborhood => ({
        value: neighborhood,
        label: neighborhood,
    }));

    const handleNeighborhoodChange = selectedOption => {
        setSelectedNeighborhood(selectedOption);
        setCurrentPage(1); // Reset page number when neighborhood filter changes
    };

    return (
        <div>
            <section className="filtros">
                <div className="filtro-item">
                    <label>Bairro:</label>
                    <div className="select-container">
                    <Select
                        options={neighborhoodOptions}
                        value={selectedNeighborhood}
                        onChange={handleNeighborhoodChange}
                        isClearable
                    />
                    </div>
                </div>
            </section>
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
        </div>
    );
}

export default AdGrid;