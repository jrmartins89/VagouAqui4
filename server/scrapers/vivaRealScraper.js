const axios = require('axios');
const cheerio = require('cheerio');
const axiosRateLimit = require('axios-rate-limit');
const {extractContactInfoFromDescription} = require("./contactInfoScraper");

// Create an instance of axios with rate limiting (1 request per second)
const axiosInstance = axiosRateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 1000, // 1 request per second
});

// Function to scrape image links from VivaReal ad page
async function extractVivaRealImageLinks(adLink) {
    try {
        const response = await axiosInstance.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad page
            const imageElements = $('.carousel__image');

            // Extract image links from the src attribute
            const imageLinks = imageElements.map((index, element) => $(element).attr('src')).get();

            return imageLinks;
        } else {
            console.error(`Erro ao realizar o scraping dos links de imagem do anúncio: ${adLink}. Código do status: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`Erro ao realizar o scraping dos links de imagem do anúncio: ${adLink}`, error.message);
        return [];
    }
}

// Function to scrape VivaReal ad details
async function getVivaRealAdLinks() {
    try {
        const response = await axios.get('https://www.vivareal.com.br/aluguel/santa-catarina/florianopolis/kitnet_residencial/');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad
            const adList = $('.js-card-selector');

            // Create an array to store promises for ad details and image links
            const adDetailsPromises = adList.map(async (index, element) => {
                const adTitleElement = $(element).find('a.property-card__content-link.js-card-title');
                const adTitle = adTitleElement.text().trim();
                const adLink = 'https://www.vivareal.com.br' + adTitleElement.attr('href');
                const adPrice = $(element).find('.property-card__price').text().trim();
                const address = $(element).find('.property-card__address').text().trim();

                // Use await to resolve the description promise
                const adDescription = await extractDescription(adLink);
                const contactInfo = extractContactInfoFromDescription(adDescription);
                // Extract neighborhood using the extractNeighborhood function
                const neighborhood = extractNeighborhood(address);

                // Fetch image links and ad details in parallel
                const [imageLinks, adDetails] = await Promise.all([
                    extractVivaRealImageLinks(adLink),
                    Promise.resolve({
                        title: adTitle,
                        description: adDescription,
                        link: adLink,
                        price: adPrice,
                        neighborhood: neighborhood,
                        contactInfo: contactInfo.length === 0 ? adLink : contactInfo
                    }),
                ]);

                return { ...adDetails, imageLinks };
            }).get();

            // Wait for all ad details promises to resolve
            const adDetailsArray = await Promise.all(adDetailsPromises);
            return adDetailsArray;
        } else {
            console.error(`Erro ao buscar detalhes de anúncios. Código do status: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro durante o scraping de informações sobre um anúncio:', error.message);
    }
}

async function extractDescription(adLink) {
    try {
        const response = await axios.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adDescription = $('#js-site-main > div.main-container > div.main-features-container > div.details-container > div.description > div > div > p').text().trim();
            return adDescription;
        }
    } catch (error) {
        console.error('Erro ao realizar o scraping da descrição do anúncio:', error.message);
    }
}

// Function to extract neighborhood from address
function extractNeighborhood(address) {
    // Split the address by commas and dashes
    const parts = address.split(/,|-/);

    // Find the first non-empty part that represents the neighborhood
    for (let i = 0; i < parts.length; i++) {
        const trimmedPart = parts[i].trim();

        // Check if the part contains only letters or spaces (potential neighborhood)
        if (/^[A-Za-z\s]+$/.test(trimmedPart)) {
            return trimmedPart;
        }
    }

    // If no neighborhood is found, return null
    return null;
}

module.exports = {
    getVivaRealAdLinks,
};
