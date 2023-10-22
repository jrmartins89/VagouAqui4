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

module.exports = router;
