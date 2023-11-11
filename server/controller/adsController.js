const Ad = require("../models/Ads");
const scraperUfsc = require("../scrapers/classificadosUfscScraper");
const { scrapeIbagyAds } = require("../scrapers/ibagyScraper");
const { scrapeWebQuartoads } = require("../scrapers/webQuartoScraper");
const { getVivaRealAdLinks } = require("../scrapers/vivaRealScraper");
const { extractMgfHrefValues } = require("../scrapers/mgfScraper");
const moment = require('moment-timezone');

// Define um array de URLs
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

// Função para raspar e salvar novos anúncios, evitando duplicatas
async function scrapeAndSaveNewAds(scraper, source, urls, scrapeFunction, getDetailsFunction) {
    try {
        if (urls) {
            for (const urlInfo of urls) {
                // Busca anúncios usando a função de raspagem fornecida
                const adItems = await scrapeFunction(urlInfo.url);

                // Busca anúncios existentes no banco de dados
                const existingAds = await Ad.find({}, "link");

                // Filtra novos anúncios
                const newAdItems = adItems.filter(
                    (item) =>
                        !existingAds.some((existingAd) => existingAd.link === item.link)
                );

                if (newAdItems.length > 0) {
                    // Busca detalhes do anúncio usando a função getDetailsFunction, se disponível
                    const itemsWithDetails = getDetailsFunction
                        ? await getDetailsFunction(newAdItems)
                        : newAdItems;

                    // Mapeia e salva novos anúncios
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
            // Busca anúncios usando a função de raspagem fornecida
            const adItems = await scrapeFunction();

            // Busca anúncios existentes no banco de dados
            const existingAds = await Ad.find({}, "link");

            // Filtra novos anúncios
            const newAdItems = adItems.filter(
                (item) =>
                    !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItems.length > 0) {
                // Mapeia e salva novos anúncios
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

// Função para salvar novos anúncios no banco de dados, evitando duplicatas
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

// Função para iniciar o processo de raspagem
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
        const now = moment().tz("America/Sao_Paulo").format(); // Obtém a data atual no formato UTC-03:00
        process.env.LAST_SCRAPING_DATE = now;
        console.log(now);
        console.log("LAST_SCRAPING_DATE foi atualizado:", process.env.LAST_SCRAPING_DATE);
    } catch (error) {
        console.error("Erro durante o scraping:", error);
    }
}

// Função para buscar todos os anúncios
const getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar anúncios', error: error.message });
    }
};

// Função para buscar a LAST_SCRAPING_DATE
const getLastScrapingDate = (req, res) => {
    try {
        const lastScrapingDate = process.env.LAST_SCRAPING_DATE;
        if (lastScrapingDate) {
            res.json({ lastScrapingDate });
        } else {
            res.status(404).json({ message: 'LAST_SCRAPING_DATE não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar LAST_SCRAPING_DATE', error: error.message });
    }
};

module.exports = {
    startScraping,
    getAllAds,
    getLastScrapingDate,
};
