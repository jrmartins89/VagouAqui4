const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const scraperUfsc = require("./scrapers/classificadosUfscScraper");
const Ad = require("./models/Ads");
const urls = require("./urls.json");
const ads = require("./routes/api/ads");
const { scrapeIbagyAds } = require("./scrapers/ibagyScraper");
const { scrapeWebQuartoads } = require("./scrapers/webQuartoScraper");
const {scrapeRoomgoAdsPage} = require("./scrapers/roomgoScraper");
require("dotenv").config();
require("./config/passport")(passport);

app.use(cors()); // Add CORS middleware to allow all origins
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conectado com sucesso ao MongoDB");
        startScraping();
    })
    .catch((error) => {
        console.error("Erro de conexão com o banco de dados:", error);
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
            // Fetch ads from scraperUfsc for each URL
            const adItemsFromClassificadosUfsc = await scraperUfsc.getAdLinks(
                urlInfo.url
            );

            // Fetch existing ads from the database
            const existingAds = await Ad.find({}, "link");

            // Filter new ads
            const newAdItemsFromClassificadosUfsc = adItemsFromClassificadosUfsc.filter(
                (item) =>
                    !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItemsFromClassificadosUfsc.length > 0) {
                // Fetch ad details
                const itemsWithDetailsClassificadosUfsc = await scraperUfsc.getAdDetails(
                    newAdItemsFromClassificadosUfsc
                );

                // Map and save new ads
                const finalItemsClassificadosUfsc = itemsWithDetailsClassificadosUfsc.map(
                    (item) => ({
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        price: item.price,
                        imageLinks: item.imageLinks,
                        neighborhood: item.neighborhood,
                        contactInfo: item.contactInfo,
                    })
                );

                await saveNewAds(finalItemsClassificadosUfsc, "Classificados UFSC");
            } else {
                console.log('No new Classificados UFSC ads to save');
            }
        }

        // Continue with scraping other sources and saving new ads as before
        const ibagyAds = await scrapeIbagyAds();
        await saveNewAds(ibagyAds, "Ibagy");

        const webQuartoAds = await scrapeWebQuartoads();
        await saveNewAds(webQuartoAds, "WebQuarto");

        const roomgoAds = await scrapeRoomgoAdsPage();
        await saveNewAds(roomgoAds, "roomgo");
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

// Function to save new ads to the database, avoiding duplicates
async function saveNewAds(newAds, source) {
    try {
        const existingAds = await Ad.find({}, "link");
        const newAdsToInsert = newAds.filter(
            (newAd) => !existingAds.some((existingAd) => existingAd.link === newAd.link)
        );

        if (newAdsToInsert.length > 0) {
            const finalAds = newAdsToInsert.map((item) => ({
                title: item.title,
                link: item.link || "",
                description: item.description || "",
                price: item.price || "",
                imageLinks: item.imageLinks || "",
                neighborhood: item.neighborhood,
                contactInfo: item.contactInfo,
                source: source
            }));

            await Ad.insertMany(finalAds);
            console.log(`Finished scraping ${source} ads`);
        } else {
            console.log(`No new ads to save from ${source}`);
        }
    } catch (error) {
        console.error(`Error during scraping ${source} ads:`, error);
    }
}

app.listen(port, () =>
    console.log(`O Servidor está rodando na porta ${port}!`)
);
