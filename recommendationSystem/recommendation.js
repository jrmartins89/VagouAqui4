const mongoose = require("mongoose");

// Assume you have defined your User and Ad models
const User = require("../models/User");
const Ad = require("../models/Ads");

// Function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(userPrefs, adFeatures) {
    if (userPrefs.length !== adFeatures.length) {
        throw new Error("Vectors must have the same dimensionality");
    }

    const dotProduct = userPrefs.reduce((acc, value, index) => acc + (value * adFeatures[index]), 0);
    const userPrefsMagnitude = Math.sqrt(userPrefs.reduce((acc, value) => acc + Math.pow(value, 2), 0));
    const adFeaturesMagnitude = Math.sqrt(adFeatures.reduce((acc, value) => acc + Math.pow(value, 2), 0));

    const similarity = dotProduct / (userPrefsMagnitude * adFeaturesMagnitude);

    return similarity;
}

// Function to generate content-based recommendations for a user
async function generateContentBasedRecommendations(userId) {
    try {
        // Fetch the user's preferences
        const user = await User.findById(userId);

        // Fetch all ads from the database
        const allAds = await Ad.find();

        // Calculate similarity scores for each ad
        const recommendations = allAds.map(ad => ({
            ad,
            similarity: calculateCosineSimilarity(
                [
                    user.preferences.houseOrApartment === "House" ? 1 : 0,
                    user.preferences.genderPreference === "Men" ? 1 : 0,
                    user.preferences.genderPreference === "Women" ? 1 : 0,
                    user.preferences.acceptsPets ? 1 : 0,
                    user.preferences.wheelchairAccessible ? 1 : 0,
                    user.preferences.acceptSmoker ? 1 : 0,
                    user.preferences.roommates === "With Roommates" ? 1 : 0,
                    user.preferences.noiseLevel === "Social" ? 1 : 0,
                ], // User preferences
                [
                    ad.houseOrApartment === "House" ? 1 : 0,
                    ad.genderPreference === "Men" ? 1 : 0,
                    ad.genderPreference === "Women" ? 1 : 0,
                    ad.acceptsPets ? 1 : 0,
                    ad.wheelchairAccessible ? 1 : 0,
                    ad.acceptSmoker ? 1 : 0,
                    ad.roommates === "With Roommates" ? 1 : 0,
                    ad.noiseLevel === "Social" ? 1 : 0,
                ] // Ad features
            )
        }));

        // Sort recommendations by similarity score in descending order
        recommendations.sort((a, b) => b.similarity - a.similarity);

        // Extract the recommended ads (you can limit the number of recommendations)
        const recommendedAds = recommendations.map(item => item.ad);

        return recommendedAds;
    } catch (error) {
        console.error("Error generating content-based recommendations:", error);
        return [];
    }
}

module.exports = {
    generateContentBasedRecommendations,
};
