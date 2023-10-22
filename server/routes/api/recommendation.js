const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User");// Load User model // Assuming 'users' is the name of your user model
const generateRecommendations = require('../../recommendations/adRecommendation'); // Import the function to generate recommendations based on user preferences

// Route to fetch content-based recommendations for a user
router.get('/all', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch the user's preferences
        const user = await User.findById(userId);
        const userPreferences = user.preferences;
        // Generate recommendations based on user preferences
        const recommendations = await generateRecommendations(userPreferences);

        res.json(recommendations);
    } catch (error) {
        console.error("Erro ao gerar os anúncios recomendados baseados em conteúdo:", error);
        res.status(500).json({ message: 'Erro ao listar as recomendações', error: error.message });
    }
});

module.exports = router;
