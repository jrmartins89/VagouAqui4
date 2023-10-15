const Ad = require('../models/Ads'); // Replace with the actual path to your Ad model

// Function to fetch ads from the database and generate recommendations
async function generateRecommendations(userPreferences) {
    try {
        // Fetch all ads from the database
        const ads = await Ad.find({});

        // Initialize an array to store recommended ads
        const recommendations = [];

        // Loop through the ads and calculate a score for each ad based on user preferences
        ads.forEach((ad) => {
            // Extract features from the ad
            const adFeatures = {
                houseOrApartment: ad.description.match(/casa|apartamento/i),
                genderPreference: ad.description.match(/homem|mulher|masculino|feminino|masculina|feminina/i),
                acceptsPets: ad.description.match(/aceita pets|pets permitidos/i),
                location: ad.neighborhood,
                roommates: ad.description.match(/alugo quarto|aluga-se quarto|quarto disponível|quarto compartilhado/i),
                leaseLength: ad.description.match(/aluguel anual|aluguel mensal|alugo mensal|alugo anual|aluguel temporada/i),
                budget: ad.description.match(/\bR\$\s?\d{3,}(?:,\d{1,2})?|\$\s?\d{3,}(?:,\d{1,2})?|\d{3,}(?:,\d{1,2})?\b/),
                wheelchairAccessible: ad.description.match(/acessível a cadeirantes|acesso à cadeirantes|acesso à cadeira de rodas/i),
                noiseLevel: ad.description.match(/tranquilo|barulhento|local tranquilo|local perto do centro/i),
                acceptSmoker: ad.description.match(/aceita fumante|fumante permitido/i),
            };

            // Calculate a score for the ad based on user preferences
            let score = 0;

            for (const feature in adFeatures) {
                if (userPreferences[feature] && adFeatures[feature]) {
                    score++;
                }
            }

            // Add the ad and its score to the recommendations
            recommendations.push({
                ad,
                score,
            });
        });

        // Sort recommendations by score in descending order
        recommendations.sort((a, b) => b.score - a.score);

        // Return the recommended ads as a JSON object
        return recommendations;
    } catch (error) {
        console.error('Error fetching ads or generating recommendations:', error);
        return [];
    }
}

module.exports = generateRecommendations;
