const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
require('dotenv').config(); // Load environment variables from .env file

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado com sucesso ao MongoDB');
        startScraping(); // Start scraping after successful MongoDB connection
    })
    .catch(error => {
        console.error('Erro de conexão com o banco de dados:', error);
    });


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

// Start scraping function
async function startScraping() {
    const scraper = require("./scrapers/classificadosUfscScraper"); // Import the scraper module
    const Ad = require("./models/Ads"); // Make sure to provide the correct path

    const url = 'https://classificados.inf.ufsc.br/index.php?catid=88';

    try {
        const adItems = await scraper.getAdsLinks(url);
        const existingAds = await Ad.find({}, 'link'); // Get existing ad links from the database

        const newAdItems = adItems.filter(item =>
            !existingAds.some(existingAd => existingAd.link === item.link)
        );

        if (newAdItems.length > 0) {
            const itemsWithDetails = await scraper.getAdDetails(newAdItems);

            const finalItems = itemsWithDetails.map(item => ({
                title: item.title,
                link: item.link,
                description: item.description
            }));

            await Ad.insertMany(finalItems);
            console.log('Scraped data has been saved to MongoDB collection "ads"');
        } else {
            console.log('No new ads to save.');
        }
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}
app.listen(port, () => console.log(`O Servidor está rodando na porta ${port} !`));