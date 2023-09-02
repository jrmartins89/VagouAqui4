const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const scraperUfsc = require("./scrapers/classificadosUfscScraper");
const Ad = require("./models/Ads");
const urls = require("./urls.json"); // Load URLs from the JSON file
const ads = require("./routes/api/ads");
const {scrapeIbagyAds} = require("./scrapers/ibagyScraper");
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

app.use("/api/ads", ads);

// Start scraping function
async function startScraping() {
    try {
        for (const urlInfo of urls) {
            const adItemsFromClassificadosUfsc = await scraperUfsc.getAdLinks(urlInfo.url);
            const existingAds = await Ad.find({}, "link");

            const newAdItemsFromClassificadosUfsc = adItemsFromClassificadosUfsc.filter(
                (item) => !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItemsFromClassificadosUfsc.length > 0) {
                const itemsWithDetailsClassificadosUfsc = await scraperUfsc.getAdDetails(newAdItemsFromClassificadosUfsc);
                console.log('urlInfo>>>>>>>>>>>>>>',urlInfo);
                const finalItemsClassificadosUfsc = itemsWithDetailsClassificadosUfsc.map((item) => ({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    price: item.price,
                    imageLinks: item.imageLinks,
                    neighborhood: urlInfo.neighborhood, // Save neighborhood value
                }));

                await Ad.insertMany(finalItemsClassificadosUfsc);
                console.log(`Scraped data from ${urlInfo.neighborhood} has been saved to MongoDB collection "ads"`);
            } else {
                console.log(`No new ads to save from ${urlInfo.neighborhood}`);
            }
        }
    } catch (error) {
        console.error("Error during scraping:", error);
    }

    try {
       const ibagyAds = await scrapeIbagyAds();
        const finalAdsIbagy = ibagyAds.map((item) => ({
            title: item.title,
            link: item.link || '',
            description: item.adDescription || '',
            price: item.price || '',
            imageLinks: item.imageLinks || '',
            neighborhood: '', // Save neighborhood value
        }));
       await Ad.insertMany(finalAdsIbagy);
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}
app.listen(port, () => console.log(`O Servidor está rodando na porta ${port} !`));