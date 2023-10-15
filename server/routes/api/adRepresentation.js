const _ = require('lodash');
const Ad = require('../../models/Ads'); // Replace with the actual path to your Ad model

// Function to extract and create features from ad data
function extractFeaturesFromAd(ad) {
    // Define regular expressions for feature extraction
    const featureRegex = {
        houseOrApartment: /(?:casa|apartamento)/i,
        genderPreference: /(?:homem|mulher|masculino|feminino|masculina|feminina)/i,
        acceptsPets: /(?:aceita pets|pets permitidos)/i,
        leaseLength: /(?:aluguel anual|aluguel mensal|alugo mensal|alugo anual|aluguel temporada)/i,
        budget: /\b(?:R\$\s?\d{3,}(?:,\d{1,2})?|\$\s?\d{3,}(?:,\d{1,2})?|\d{3,}(?:,\d{1,2})?)\b/,
        wheelchairAccessible: /(?:acessível a cadeirantes|acesso à cadeirantes|acesso à cadeira de rodas)/i,
        noiseLevel: /(?:tranquilo|barulhento|local tranquilo|local perto do centro)/i,
        acceptSmoker: /(?:aceita fumante|fumante permitido)/i,
    };

    // Initialize an object to store the extracted features
    const features = {};

    // Extract features from ad properties
    Object.keys(featureRegex).forEach((feature) => {
        const regex = featureRegex[feature];
        const sourceText = ad.description + ad.title + ad.neighborhood; // Combine relevant fields

        // Check if the regex pattern matches in the source text
        const match = regex.exec(sourceText);

        if (match) {
            // If a match is found, save the matched value in features
            features[feature] = match[0];
        } else {
            // If no match is found, set the feature to a default value
            features[feature] = null;
        }
    });

    // Special handling for genderPreference
    if (!features.genderPreference) {
        features.genderPreference = 'tanto faz';
    }

    // Special handling for acceptsPets
    if (!features.acceptsPets) {
        features.acceptsPets = false;
    }

    // Special handling for leaseLength
    if (!features.leaseLength) {
        features.leaseLength = 'aluguel anual';
    }

    // Special handling for budget
    if (!features.budget) {
        features.budget = null;
    } else {
        features.budget = parseInt(features.budget, 10);
    }

    // Special handling for wheelchairAccessible
    if (!features.wheelchairAccessible) {
        features.wheelchairAccessible = false;
    }

    // Special handling for noiseLevel
    if (!features.noiseLevel) {
        features.noiseLevel = 'tranquilo';
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