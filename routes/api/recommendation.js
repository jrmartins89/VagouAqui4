// Function to generate content-based recommendations for a user
async function generateContentBasedRecommendations(userId, mongooseConnection) {
    try {
        // Fetch the user's preferences
        const User = mongooseConnection.model("users");
        const user = await User.findById(userId);
        console.log('usuario:', user);
        // Fetch all ads from the database
        const Ad = mongooseConnection.model("Ad");
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
        console.log('recommendedAds', recommendedAds);
        return recommendedAds;
    } catch (error) {
        console.error("Error generating content-based recommendations:", error);
        return [];
    }
}

module.exports = {
    generateContentBasedRecommendations,
};
