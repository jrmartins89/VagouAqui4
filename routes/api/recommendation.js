const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users'); // Assuming 'users' is the name of your user model
const Ad = mongoose.model('Ad'); // Assuming 'Ad' is the name of your ad model

// Route to fetch content-based recommendations for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch the user's preferences
        const user = await User.findById(userId);

        // Fetch all ads from the database
        const allAds = await Ad.find();

        // Filter ads based on user preferences
        const filteredAds = allAds.filter(ad => {
            return (
                ad.houseOrApartment === user.preferences.houseOrApartment &&
                ad.genderPreference === user.preferences.genderPreference &&
                ad.acceptsPets === user.preferences.acceptsPets &&
                ad.wheelchairAccessible === user.preferences.wheelchairAccessible &&
                ad.acceptSmoker === user.preferences.acceptSmoker &&
                ad.roommates === user.preferences.roommates &&
                ad.noiseLevel === user.preferences.noiseLevel
            );
        });

        // Sort filtered ads by a criteria of your choice, e.g., date posted or popularity
        filteredAds.sort((a, b) => {
            // You can change the sorting criteria here
            // For example, to sort by date in descending order:
            return b.datePosted - a.datePosted;
        });

        // Extract the recommended ads (you can limit the number of recommendations)
        const recommendedAds = filteredAds.slice(0, 10); // Change the number as needed

        res.json(recommendedAds);
    } catch (error) {
        console.error("Error generating content-based recommendations:", error);
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;
