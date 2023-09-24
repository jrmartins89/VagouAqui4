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
const { getVivaRealAdLinks } = require("./scrapers/vivaRealScraper");
const {extractMgfHrefValues} = require("./scrapers/mgfScraper");
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
        await scrapeAndSaveNewAds(
            scraperUfsc,
            "Classificados UFSC",
            urls,
            scraperUfsc.getAdLinks,
            scraperUfsc.getAdDetails
        );

        await scrapeAndSaveNewAds(
            null, // Pass null for source because it's handled in each scraper function
            "Ibagy",
            null, // Pass null for URLs because it's handled within scrapeIbagyAds
            scrapeIbagyAds,
            null // Pass null for getAdDetails because it's not used in scrapeIbagyAds
        );

        await scrapeAndSaveNewAds(
            null, // Pass null for source because it's handled in each scraper function
            "WebQuarto",
            null, // Pass null for URLs because it's handled within scrapeWebQuartoads
            scrapeWebQuartoads,
            null // Pass null for getAdDetails because it's not used in scrapeWebQuartoads
        );

        await scrapeAndSaveNewAds(
            null, // Pass null for source because it's handled in each scraper function
            "vivaReal",
            null, // Pass null for URLs because it's handled within getVivaRealAdLinks
            getVivaRealAdLinks,
            null // Pass null for getAdDetails because it's not used in getVivaRealAdLinks
        );

        await scrapeAndSaveNewAds(
            null, // Pass null for source because it's handled in each scraper function
            "MGF",
            null, // Pass null for URLs because it's handled within extractMgfHrefValues
            extractMgfHrefValues,
            null // Pass null for getAdDetails because it's not used in extractMgfHrefValues
        );
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

// Function to scrape and save new ads, avoiding duplicates
async function scrapeAndSaveNewAds(scraper, source, urls, scrapeFunction, getDetailsFunction) {
    try {
        if (urls) {
            for (const urlInfo of urls) {
                // Fetch ads using the provided scrapeFunction
                const adItems = await scrapeFunction(urlInfo.url);

                // Fetch existing ads from the database
                const existingAds = await Ad.find({}, "link");

                // Filter new ads
                const newAdItems = adItems.filter(
                    (item) =>
                        !existingAds.some((existingAd) => existingAd.link === item.link)
                );

                if (newAdItems.length > 0) {
                    // Fetch ad details using the provided getDetailsFunction if available
                    const itemsWithDetails = getDetailsFunction
                        ? await getDetailsFunction(newAdItems)
                        : newAdItems;

                    // Map and save new ads
                    const finalItems = itemsWithDetails.map((item) => ({
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        price: item.price,
                        imageLinks: item.imageLinks,
                        neighborhood: item.neighborhood,
                        contactInfo: item.contactInfo,
                    }));

                    await saveNewAds(finalItems, source);
                } else {
                    console.log(`No new ${source} ads to save`);
                }
            }
        } else {
            // Fetch ads using the provided scrapeFunction
            const adItems = await scrapeFunction();

            // Fetch existing ads from the database
            const existingAds = await Ad.find({}, "link");

            // Filter new ads
            const newAdItems = adItems.filter(
                (item) =>
                    !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItems.length > 0) {
                // Map and save new ads
                const finalItems = newAdItems.map((item) => ({
                    title: item.title,
                    link: item.link || "",
                    description: item.description || "",
                    price: item.price || "",
                    imageLinks: item.imageLinks || "",
                    neighborhood: item.neighborhood,
                    contactInfo: item.contactInfo,
                    source: source,
                }));

                await saveNewAds(finalItems, source);
            } else {
                console.log(`No new ${source} ads to save`);
            }
        }
    } catch (error) {
        console.error(`Error during scraping ${source} ads:`, error);
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
                source: source,
            }));

            await Ad.insertMany(finalAds);
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
