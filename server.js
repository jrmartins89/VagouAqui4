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
            const adItemsFromClassificadosUfsc = await scraperUfsc.getAdLinks(
                urlInfo.url
            );
            const existingAds = await Ad.find({}, "link");

            const newAdItemsFromClassificadosUfsc = adItemsFromClassificadosUfsc.filter(
                (item) => !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItemsFromClassificadosUfsc.length > 0) {
                const itemsWithDetailsClassificadosUfsc = await scraperUfsc.getAdDetails(
                    newAdItemsFromClassificadosUfsc
                );

                const finalItemsClassificadosUfsc = itemsWithDetailsClassificadosUfsc.map(
                    (item) => ({
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        price: item.price,
                        imageLinks: item.imageLinks,
                        neighborhood: urlInfo.neighborhood,
                    })
                );

                await Ad.insertMany(finalItemsClassificadosUfsc);
                console.log(
                    `Scraped data from ${urlInfo.neighborhood} has been saved to MongoDB collection "ads"`
                );
            } else {
                console.log(`No new ads to save from ${urlInfo.neighborhood}`);
            }
        }
        console.log("Finished scraping Classificados UFSC ads");

        const ibagyAds = await scrapeIbagyAds();
        await saveNewAds(ibagyAds, "Ibagy");
        console.log("Finished scraping Ibagy ads");

        const webQuartoAds = await scrapeWebQuartoads();
        await saveNewAds(webQuartoAds, "WebQuarto");
        console.log("Finished scraping WebQuarto ads");
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