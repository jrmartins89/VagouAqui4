const _ = require('lodash');
const Ad = require('../../models/Ads'); // Replace with the actual path to your Ad model

// Function to extract and create features from ad data
function extractFeaturesFromAd(ad) {
    // Define regular expressions for feature extraction
    const featureRegex = {
        houseOrApartment: /(?:house|apartment)/i,
        genderPreference: /(?:men|women)/i,
        acceptsPets: /pets allowed/i,
        leaseLength: /(?:year round|monthly basis)/i,
        budget: /(\d+)/, // Extract the first number as the budget
        wheelchairAccessible: /wheelchair accessible/i,
        noiseLevel: /(?:quiet|social)/i,
        acceptSmoker: /smoker/i,
    };

    // Initialize an object to store the extracted features
    const features = {};

    // Extract features from ad properties
    Object.keys(featureRegex).forEach((feature) => {
        const regex = featureRegex[feature];
        const sourceText = ad.description + ad.title + ad.neighborhood; // Combine relevant fields

        // Check if the regex pattern matches in the source text
        features[feature] = regex.test(sourceText);
    });

    // Special handling for genderPreference
    if (!features.genderPreference) {
        features.genderPreference = 'Any';
    }

    // Special handling for acceptsPets
    if (!features.acceptsPets) {
        features.acceptsPets = false;
    }

    // Special handling for leaseLength
    if (!features.leaseLength) {
        features.leaseLength = 'year round';
    }

    // Special handling for budget
    if (!features.budget) {
        features.budget = null;
    } else {
        // Parse the budget as an integer
        features.budget = parseInt(features.budget[1], 10);
    }

    // Special handling for wheelchairAccessible
    if (!features.wheelchairAccessible) {
        features.wheelchairAccessible = false;
    }

    // Special handling for noiseLevel
    if (!features.noiseLevel) {
        features.noiseLevel = 'quiet';
    }

    // Special handling for acceptSmoker
    if (!features.acceptSmoker) {
        features.acceptSmoker = false;
    }

    return features;
}

// Function to calculate cosine similarity between two feature objects
function cosineSimilarity(userPrefs, listingPrefs) {
    const userVector = Object.values(userPrefs);
    const listingVector = Object.values(listingPrefs);

    // Calculate cosine similarity using lodash
    return _.round(_.divide(_.sum(_.multiply(userVector, listingVector)), (_.multiply(_.sum(_.map(userVector, val => Math.pow(val, 2))), _.sum(_.map(listingVector, val => Math.pow(val, 2))))), 2));
}

// Function to fetch ads from the database and generate recommendations
async function generateRecommendations(userPreferences) {
    try {
        // Fetch all ads from the database
        const ads = await Ad.find({});

        // Generate recommendations
        const recommendations = ads.map((ad) => {
            const listingFeatures = extractFeaturesFromAd(ad);
            const similarityScore = cosineSimilarity(userPreferences, listingFeatures);

            return {
                ad,
                similarityScore,
            };
        });

        // Sort ads by similarity score in descending order
        recommendations.sort((a, b) => b.similarityScore - a.similarityScore);

        return recommendations;
    } catch (error) {
        console.error('Error fetching ads or generating recommendations:', error);
        return [];
    }
}

module.exports = generateRecommendations