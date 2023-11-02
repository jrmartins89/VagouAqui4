const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ads'); // Adjust the path as needed

// Route to fetch ads
router.get('/all', async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar anúncios', error: error.message });
    }
});

// New route to fetch LAST_SCRAPING_DATE
router.get('/lastScrapingDate', (req, res) => {
    try {
        const lastScrapingDate = process.env.LAST_SCRAPING_DATE;
        if (lastScrapingDate) {
            res.json({ lastScrapingDate });
        } else {
            res.status(404).json({ message: 'LAST_SCRAPING_DATE not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar LAST_SCRAPING_DATE', error: error.message });
    }
});

module.exports = router;
