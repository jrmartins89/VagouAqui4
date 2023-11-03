const express = require('express');
const router = express.Router();
const adController = require('../../controller/adsController'); // Import the controller

// Route to fetch all ads
router.get('/all', adController.getAllAds);

// Route to fetch LAST_SCRAPING_DATE
router.get('/lastScrapingDate', adController.getLastScrapingDate);

module.exports = router;
