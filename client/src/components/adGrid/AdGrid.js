import React, { useState, useEffect } from 'react';
import './AdGrid.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Select from 'react-select';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function AdGrid() {
    const [ads, setAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(5);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const [isLightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(-1);

    useEffect(() => {
        async function fetchAds() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/ads/all');
                const data = await response.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        }
        fetchAds();
    }, []);

    const uniqueNeighborhoods = Array.from(new Set(ads.map(ad => ad.neighborhood.toLowerCase())));

    const filteredAds = selectedNeighborhood
        ? ads.filter(ad => ad.neighborhood.toLowerCase() === selectedNeighborhood.value.toLowerCase())
        : ads;

    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const neighborhoodOptions = uniqueNeighborhoods.map(neighborhood => ({
        value: neighborhood,
        label: neighborhood,
    }));

    const handleNeighborhoodChange = selectedOption => {
        setSelectedNeighborhood(selectedOption);
        setCurrentPage(1);
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
                    {currentAds.map((ad, index) => (
                        <div key={ad._id} className="grid-item">
                            <h2>{ad.title}</h2>
                            <Carousel showArrows={true} infiniteLoop={true}>
                                {ad.imageLinks.map((imageLink, imgIndex) => (
                                    <div
                                        key={imgIndex}
                                        onClick={() => {
                                            setLightboxImageIndex(imgIndex);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <img src={imageLink} alt={`Ad ${imgIndex}`} className="ad-image" />
                                    </div>
                                ))}
                            </Carousel>
                            <p className="ad-description">{ad.description}</p>
                            <p className="ad-price">{ad.price}</p>
                            <p className="ad-neighborhood">{ad.neighborhood}</p>
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
            {isLightboxOpen && (
                <Lightbox
                    mainSrc={currentAds[lightboxImageIndex].imageLinks[lightboxImageIndex]}
                    nextSrc={
                        currentAds[lightboxImageIndex].imageLinks[(lightboxImageIndex + 1) % currentAds[lightboxImageIndex].imageLinks.length]
                    }
                    prevSrc={
                        currentAds[lightboxImageIndex].imageLinks[
                        (lightboxImageIndex + currentAds[lightboxImageIndex].imageLinks.length - 1) %
                        currentAds[lightboxImageIndex].imageLinks.length
                            ]
                    }
                    onCloseRequest={() => setLightboxOpen(false)}
                    onMovePrevRequest={() => setLightboxImageIndex((lightboxImageIndex + currentAds[lightboxImageIndex].imageLinks.length - 1) % currentAds[lightboxImageIndex].imageLinks.length)}
                    onMoveNextRequest={() => setLightboxImageIndex((lightboxImageIndex + 1) % currentAds[lightboxImageIndex].imageLinks.length)}
                />
            )}
        </div>
    );
}

export default AdGrid;