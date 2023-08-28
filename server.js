const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const scraper = require("./scrapers/classificadosUfscScraper");
const Ad = require("./models/Ads");
const urls = require("./urls.json"); // Load URLs from the JSON file
require("dotenv").config();
require("./config/passport")(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
// Routes
app.use("/api/users", users);

// Start scraping function
async function startScraping() {
    try {
        for (const urlInfo of urls) {
            const adItems = await scraper.getAdLinks(urlInfo.url);
            const existingAds = await Ad.find({}, "link");

            const newAdItems = adItems.filter(
                (item) => !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItems.length > 0) {
                const itemsWithDetails = await scraper.getAdDetails(newAdItems);

                const finalItems = itemsWithDetails.map((item) => ({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    price: item.price,
                    imageLinks: item.imageLinks,
                    neighbourhood: urlInfo.neighbourhood, // Save neighbourhood value
                }));

                await Ad.insertMany(finalItems);
                console.log(`Scraped data from ${urlInfo.neighbourhood} has been saved to MongoDB collection "ads"`);
            } else {
                console.log(`No new ads to save from ${urlInfo.neighbourhood}`);
            }
        }
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}
app.listen(port, () => console.log(`O Servidor está rodando na porta ${port} !`));