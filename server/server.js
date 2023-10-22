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
const adsRouter = require("./routes/api/ads");
const { scrapeIbagyAds } = require("./scrapers/ibagyScraper");
const { scrapeWebQuartoads } = require("./scrapers/webQuartoScraper");
const { getVivaRealAdLinks } = require("./scrapers/vivaRealScraper");
const { extractMgfHrefValues } = require("./scrapers/mgfScraper");
const recommendationsRouter = require("./routes/api/recommendation");
const schedule = require("node-schedule");
// Define an array of URLs
const urls = [
    {
        "url": "https://classificados.ufsc.br/index.php?catid=88"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=91"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=89"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=94"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=197"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=90"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=96"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=86"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=72"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=73"
    },
    {
        "url": "https://classificados.ufsc.br/index.php?catid=74"
    }
]

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
        console.log("Conexão bem sucedida com o MongoDB");
        // Start the Express server
        app.listen(port, () => {
            console.log(`O servidor está rodando na porta: ${port}!`);
            // After the server is started, perform other actions
            initializeServerActions();
        });
    })
    .catch((error) => {
        console.error("Erro de conexão com o banco de dados:", error);
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
                    console.log(`Sem novos anúncios de ${source} para salvar.`);
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
                console.log(`Sem novos anúncios de ${source} para salvar.`);
            }
        }
    } catch (error) {
        console.error(`Erro durante o scraping de anúncios de ${source}:`, error);
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
            console.log(`Sem novos anúncios de ${source} para salvar.`);
        }
    } catch (error) {
        console.error(`Erro durante o scraping de anúncios de ${source}:`, error);
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
        console.log("O processo de Scraping começou.");

        // Call the scraping functions for each source
        await scrapeAndSaveNewAds(
            scraperUfsc,
            "Classificados UFSC",
            urls,
            scraperUfsc.getAdLinks,
            scraperUfsc.getAdDetails
        );
        console.log("O processo de Scraping para Classificados UFSC foi finalizado.");

        await scrapeAndSaveNewAds(
            null,
            "Ibagy",
            null,
            scrapeIbagyAds,
            null
        );
        console.log("O processo de Scraping para Ibagy foi finalizado.");

        await scrapeAndSaveNewAds(
            null,
            "WebQuarto",
            null,
            scrapeWebQuartoads,
            null
        );
        console.log("O processo de Scraping para WebQuarto foi finalizado.");

        await scrapeAndSaveNewAds(
            null,
            "vivaReal",
            null,
            getVivaRealAdLinks,
            null
        );
        console.log("O processo de Scraping para vivaReal foi finalizado.");

        await scrapeAndSaveNewAds(
            null,
            "MGF",
            null,
            extractMgfHrefValues,
            null
        );
        console.log("O processo de Scraping para MGF foi finalizado.");

        console.log("Todos os processos de scraping foram finalizados.");
    } catch (error) {
        console.error("Erro durante o scraping:", error);
    }
}

// Function to perform other actions after the server is started
async function initializeServerActions() {
    try {
        // Check if there are any ads saved in the database
        const existingAdsCount = await Ad.countDocuments();

        if (+existingAdsCount === 0) {
            // If no ads are saved, start the initial scraping process
            console.log("Nenhum anúncio encontrado no banco de dados. Iniciando o processo inicial de scraping.");
            await startScraping();
        } else {
            // If there are ads in the database, follow the scheduled scraping task
            console.log("Foram encontrados anúncios no banco de dados. Seguindo a programação do processo de scraping.");
            scheduleScrapingTask();
        }
    } catch (error) {
        console.error("Erro durante a verificação de anúncios existentes:", error);
    }
}
