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
    const [adsPerPage] = useState(15);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]);
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

    const openLightbox = (images, imageIndex) => {
        setLightboxImages(images);
        setLightboxImageIndex(imageIndex);
    };

    const closeLightbox = () => {
        setLightboxImages([]);
        setLightboxImageIndex(-1);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredAds.length / adsPerPage)) {
            paginate(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
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
                    {currentAds.map((ad, adIndex) => (
                        <div key={ad._id} className="grid-item">
                            <h2>{ad.title}</h2>
                            <Carousel showArrows={true} infiniteLoop={true}>
                                {ad.imageLinks.map((imageLink, imgIndex) => (
                                    <div
                                        key={imgIndex}
                                        onClick={() => openLightbox(ad.imageLinks, imgIndex)}
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
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    {Array.from({ length: Math.ceil(filteredAds.length / adsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredAds.length / adsPerPage)}>Next</button>
                </div>
            </div>
            {lightboxImages.length > 0 && lightboxImageIndex !== -1 && (
                <Lightbox
                    mainSrc={lightboxImages[lightboxImageIndex]}
                    nextSrc={lightboxImages[(lightboxImageIndex + 1) % lightboxImages.length]}
                    prevSrc={lightboxImages[(lightboxImageIndex + lightboxImages.length - 1) % lightboxImages.length]}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() => setLightboxImageIndex((lightboxImageIndex + lightboxImages.length - 1) % lightboxImages.length)}
                    onMoveNextRequest={() => setLightboxImageIndex((lightboxImageIndex + 1) % lightboxImages.length)}
                />
            )}
        </div>
    );
}

export default AdGrid;
