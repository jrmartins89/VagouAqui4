const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const passport = require("passport");
const usersRouter = require("./routes/api/users");
const app = express();
const scraperUfsc = require("./scrapers/classificadosUfscScraper");
const Ad = require("./models/Ads");
const urls = require("./urls.json");
const adsRouter = require("./routes/api/ads");
const { scrapeIbagyAds } = require("./scrapers/ibagyScraper");
const { scrapeWebQuartoads } = require("./scrapers/webQuartoScraper");
const { getVivaRealAdLinks } = require("./scrapers/vivaRealScraper");
const { extractMgfHrefValues } = require("./scrapers/mgfScraper");
const recommendationsRouter = require("./routes/api/recommendation"); // Import the recommendations router
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
app.use("/api/users", usersRouter);
app.use("/api/ads", adsRouter);
app.use("/api/recommendations", recommendationsRouter);


// Start scraping function
async function startScraping() {
    try {
        console.log("Scraping process started.");

        await scrapeAndSaveNewAds(
            scraperUfsc,
            "Classificados UFSC",
            urls,
            scraperUfsc.getAdLinks,
            scraperUfsc.getAdDetails
        );
        console.log("Scraping process for Classificados UFSC finished.");

        await scrapeAndSaveNewAds(
            null,
            "Ibagy",
            null,
            scrapeIbagyAds,
            null
        );
        console.log("Scraping process for Ibagy finished.");

        await scrapeAndSaveNewAds(
            null,
            "WebQuarto",
            null,
            scrapeWebQuartoads,
            null
        );
        console.log("Scraping process for WebQuarto finished.");

        await scrapeAndSaveNewAds(
            null,
            "vivaReal",
            null,
            getVivaRealAdLinks,
            null
        );
        console.log("Scraping process for vivaReal finished.");

        await scrapeAndSaveNewAds(
            null,
            "MGF",
            null,
            extractMgfHrefValues,
            null
        );
        console.log("Scraping process for MGF finished.");

        console.log("All scraping processes have finished.");
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
