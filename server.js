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
const recommendationsRouter = require("./routes/api/recommendation");
const schedule = require("node-schedule");
require("dotenv").config();
require("./config/passport")(passport);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected successfully to MongoDB");
        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}!`);
            // After the server is started, perform other actions
            initializeServerActions();
        });
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/ads", adsRouter);
app.use("/api/recommendation", recommendationsRouter);

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

// Schedule the scraping task to run every two weeks
function scheduleScrapingTask() {
    // Schedule the task to run every two weeks (on Sunday at midnight)
    schedule.scheduleJob({ hour: 23, minute: 0, dayOfWeek: 5 }, function () {
        startScraping();
    });
}

// Start scraping function
async function startScraping() {
    try {
        console.log("Scraping process started.");

        // Call the scraping functions for each source
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

// Function to perform other actions after the server is started
async function initializeServerActions() {
    try {
        // Check if there are any ads saved in the database
        const existingAdsCount = await Ad.countDocuments();

        if (+existingAdsCount === 0) {
            // If no ads are saved, start the initial scraping process
            console.log("No ads found in the database. Starting initial scraping...");
            await startScraping();
        } else {
            // If there are ads in the database, follow the scheduled scraping task
            console.log("Ads found in the database. Following the scheduled scraping task...");
            scheduleScrapingTask();
        }
    } catch (error) {
        console.error("Error while checking for existing ads:", error);
    }
}
