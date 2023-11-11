import React, { useState, useEffect } from 'react';
import './AdGrid.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import axios from 'axios';

function AdGrid() {
    const [ads, setAds] = useState([]);
    const [lastScrapingDate, setLastScrapingDate] = useState([]); // Novo estado para a última data de scraping
    const [currentPage, setCurrentPage] = useState(1);
    const [adsPerPage] = useState(15);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(-1);

    useEffect(() => {
        async function fetchAds() {
            try {
                const response = await axios.get('/api/ads/all');
                const data = response.data;
                setAds(data);

                const lastScrapingDateResponse = await axios.get('/api/ads/lastScrapingDate'); // Busca a última data de scraping
                setLastScrapingDate(lastScrapingDateResponse.data.lastScrapingDate); // Define a última data de scraping
            } catch (error) {
                console.error('Erro ao listar anúncios:', error);
            }
        }
        fetchAds();
    }, []);

    const totalPages = Math.ceil(ads.length / adsPerPage);

    // Calcula os limites inferior e superior para os índices de página exibidos
    const pageRange = 10; // Número de índices de página a serem mostrados

    let lowerBound = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let upperBound = Math.min(lowerBound + pageRange - 1, totalPages);

    if (upperBound - lowerBound + 1 < pageRange) {
        lowerBound = Math.max(1, upperBound - pageRange + 1);
    }

    // Cria um array de índices de página para exibir
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
            <div className="last-scraping-date">
                Anúncios atualizados pela última vez em: {lastScrapingDate}
            </div>
            <div className="grid-container">
                <div className="grid">
                    {ads.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage).map((ad, adIndex) => (
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
                    <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
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
                    <button onClick={nextPage} disabled={currentPage === totalPages}>Próximo</button>
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
