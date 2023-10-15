const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('users'); // Assuming 'users' is the name of your user model
const generateRecommendations = require('../../recommendations/adRepresentation'); // Import the function to generate recommendations based on user preferences

// Route to fetch content-based recommendations for a user
router.get('/', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch the user's preferences
        const user = await User.findById(userId);
        const userPreferences = user.preferences;
        // Generate recommendations based on user preferences
        const recommendations = generateRecommendations(userPreferences);

        res.json(recommendations);
    } catch (error) {
        console.error("Error generating content-based recommendations:", error);
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;
