const express = require('express');
const router = express.Router();
const adController = require('../../controller/adsController'); // Importa o controlador

// Rota para obter todos os anúncios
router.get('/all', adController.getAllAds);

// Rota para obter LAST_SCRAPING_DATE
router.get('/lastScrapingDate', adController.getLastScrapingDate);

module.exports = router;
