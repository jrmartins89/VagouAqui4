const _ = require('lodash');
const Ad = require('../models/Ads'); // Replace with the actual path to your Ad model

// Function to extract and create features from ad data
function extractFeaturesFromAd(ad) {
    // Define features as sets
    const featureSets = {
        houseOrApartment: new Set(['casa', 'apartamento']),
        genderPreference: new Set(['homem', 'mulher', 'masculino', 'feminino', 'masculina', 'feminina']),
        acceptsPets: new Set(['aceita pets', 'pets permitidos']),
        location: new Set(['Ribeirão da Ilha', 'Campeche', 'Ingleses do Rio Vermelho', 'Cachoeira do Bom Jesus', 'Canasvieiras', 'Lagoa da Conceição', 'São João do Rio Vermelho', 'Pântano do Sul', 'Santo Antônio de Lisboa', 'Barra da Lagoa', 'Ratones']),
        roommates: new Set(['alugo quarto', 'aluga-se quarto', 'quarto disponível', 'quarto compartilhado', 'quarto em republica']),
        leaseLength: new Set(['aluguel anual', 'aluguel mensal', 'alugo mensal', 'alugo anual', 'aluguel temporada']),
        noiseLevel: new Set(['tranquilo', 'barulhento', 'local tranquilo', 'local perto do centro']),
        acceptSmoker: new Set(['aceita fumante', 'fumante permitido']),
    };

    // Initialize an object to store the extracted features
    const features = {};

    // Extract features from ad properties
    Object.keys(featureSets).forEach((feature) => {
        const keywords = featureSets[feature];
        const sourceText = ad.description + ad.title + ad.neighborhood; // Combine relevant fields

        // Tokenize the source text into words (case-insensitive)
        const words = sourceText.toLowerCase().match(/\w+/g);

        // Calculate Jaccard similarity
        const intersection = _.intersection(keywords, words);
        const union = _.union(keywords, words);
        const similarity = intersection.length / union.length;

        // Store the similarity score in features
        features[feature] = similarity;
    });

    // Special handling for genderPreference
    if (!features.genderPreference) {
        features.genderPreference = 0; // Default similarity score
    }

    // Special handling for acceptsPets
    if (!features.acceptsPets) {
        features.acceptsPets = 0; // Default similarity score
    }

    // Special handling for leaseLength
    if (!features.leaseLength) {
        features.leaseLength = 1; // Default similarity score (perfect match)
    }

    return features;
}

// Function to calculate overall similarity between two feature objects
function calculateOverallSimilarity(userPrefs, listingPrefs) {
    // Weight factors for different features (you can adjust these)
    const featureWeights = {
        houseOrApartment: 1,
        genderPreference: 1,
        acceptsPets: 1,
        location: 1,
        roommates: 1,
        leaseLength: 1,
        noiseLevel: 1,
        acceptSmoker: 1,
    };

    let totalSimilarity = 0;
    let totalWeight = 0;

    for (const feature of Object.keys(userPrefs)) {
        totalSimilarity += featureWeights[feature] * userPrefs[feature] * listingPrefs[feature];
        totalWeight += featureWeights[feature];
    }

    if (totalWeight === 0) {
        return 0; // Avoid division by zero
    }

    return totalSimilarity / totalWeight;
}

// Function to fetch ads from the database and generate recommendations
async function generateRecommendations(userPreferences) {
    try {
        // Fetch all ads from the database
        const ads = await Ad.find({});

        // Generate recommendations
        const recommendations = ads.map((ad) => {
            const listingFeatures = extractFeaturesFromAd(ad);
            const similarityScore = calculateOverallSimilarity(userPreferences, listingFeatures);

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

module.exports = generateRecommendations;
