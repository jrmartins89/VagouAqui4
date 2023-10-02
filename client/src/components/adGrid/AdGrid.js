import React, { useState, useEffect } from 'react';
import './AdGrid.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function AdGrid() {
    const [ads, setAds] = useState([]);
    const [recommendedAds, setRecommendedAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(15);
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

    useEffect(() => {
        async function fetchRecommendedAds() {
            try {
                // Replace 'userId' with the actual user ID or appropriate parameter.
                const response = await fetch('http://127.0.0.1:5000/api/recommendations/userId');
                const data = await response.json();
                setRecommendedAds(data);
            } catch (error) {
                console.error('Error fetching recommended ads:', error);
            }
        }
        fetchRecommendedAds();
    }, []); // Fetch recommended ads when the component mounts.

    const totalPages = Math.ceil(ads.length / adsPerPage);

    // Calculate the lower and upper bounds for the displayed page indices
    const pageRange = 10; // Number of page indices to show

    let lowerBound = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let upperBound = Math.min(lowerBound + pageRange - 1, totalPages);

    if (upperBound - lowerBound + 1 < pageRange) {
        lowerBound = Math.max(1, upperBound - pageRange + 1);
    }

    // Create an array of page indices to display
    const pageIndicesToDisplay = Array.from({ length: upperBound - lowerBound + 1 }, (_, i) => i + lowerBound);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const openLightbox = (images, imageIndex) => {
        setLightboxImages(images);
        setLightboxImageIndex(imageIndex);
    };

    const closeLightbox = () => {
        setLightboxImages([]);
        setLightboxImageIndex(-1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const advanceTenPages = () => {
        const newPage = Math.min(currentPage + 10, totalPages);
        paginate(newPage);
    };

    const retreatTenPages = () => {
        const newPage = Math.max(currentPage - 10, 1);
        paginate(newPage);
    };

    return (
        <div>
            <div className="grid-container">
                <div className="grid">
                    {[...ads, ...recommendedAds].slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage).map((ad, adIndex) => (
                        <div key={adIndex} className="grid-item">
                            <h2>{ad.title}</h2>
                            <p className="contact-info">
                                <h2>Contato: {ad.contactInfo}</h2>
                            </p>
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
                            <p className="ad-price">
                                <h3>{ad.price}</h3>
                            </p>
                            <p className="ad-neighborhood">
                                <h3>{ad.neighborhood}</h3>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <button onClick={retreatTenPages} disabled={currentPage - 10 < 1}>-10 Páginas</button>
                    {pageIndicesToDisplay.map((pageIndex) => (
                        <button
                            key={pageIndex}
                            onClick={() => paginate(pageIndex)}
                            className={currentPage === pageIndex ? 'active' : ''}
                        >
                            {pageIndex}
                        </button>
                    ))}
                    <button onClick={advanceTenPages} disabled={currentPage + 10 > totalPages}>+10 Páginas</button>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>

            {/* Lightbox code */}
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
