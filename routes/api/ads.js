const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ads'); // Adjust the path as needed
const { generateContentBasedRecommendations } = require('../../recommendationSystem/recommendation'); // Import the recommendation function

// Route to fetch ads
router.get('/all', async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ads', error: error.message });
    }
});

// Route to fetch content-based recommendations for a user
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Call the generateContentBasedRecommendations function from the recommendation.js file
        const recommendedAds = await generateContentBasedRecommendations(userId);

        res.json(recommendedAds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;
