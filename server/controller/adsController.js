const Ad = require("../models/Ads");
const scraperUfsc = require("../scrapers/classificadosUfscScraper");
const { scrapeIbagyAds } = require("../scrapers/ibagyScraper");
const { scrapeWebQuartoads } = require("../scrapers/webQuartoScraper");
const { getVivaRealAdLinks } = require("../scrapers/vivaRealScraper");
const { extractMgfHrefValues } = require("../scrapers/mgfScraper");
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
];
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

// Function to start the scraping process
async function startScraping() {
    try {
        console.log("O processo de Scraping começou.");

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
        console.log("O processo de Scraping para VivaReal foi finalizado.");

        await scrapeAndSaveNewAds(
            null,
            "MGF",
            null,
            extractMgfHrefValues,
            null
        );
        console.log("O processo de Scraping para MGF foi finalizado.");

        console.log("Todos os processos de scraping foram finalizados.");
        const now = new Date();
        process.env.LAST_SCRAPING_DATE = now.toISOString();
        console.log(now.toISOString());
        console.log("LAST_SCRAPING_DATE foi atualizado:", process.env.LAST_SCRAPING_DATE);
    } catch (error) {
        console.error("Erro durante o scraping:", error);
    }
}

module.exports = {
    startScraping,
};
