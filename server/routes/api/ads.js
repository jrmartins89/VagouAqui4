const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ads'); // Adjust the path as needed

// Route to fetch ads
router.get('/all', async (req, res) => {
    try {
        const ads = await Ad.find();
        const lastScrapingDate = process.env.LAST_SCRAPING_DATE; // Use 'N/A' if the variable is not set
        res.json({ads, lastScrapingDate});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar anúncios', error: error.message });
    }
});

module.exports = router;
