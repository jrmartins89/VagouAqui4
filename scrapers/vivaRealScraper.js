const axios = require('axios');
const cheerio = require('cheerio');

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

// Function to scrape image links from VivaReal ad page
async function extractVivaRealImageLinks(adLink) {
    try {
        const response = await axios.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad page
            const imageElements = $('.carousel__image');

            // Extract image links from the src attribute
            const imageLinks = imageElements.map((index, element) => $(element).attr('src')).get();

            return imageLinks;
        } else {
            console.error(`Failed to fetch image links for ad: ${adLink}. Status code: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`Error while scraping image links for ad: ${adLink}`, error.message);
        return [];
    }
}

// Function to scrape VivaReal ad details
async function getVivaRealAdLinks() {
    const baseUrl = 'https://www.vivareal.com.br/aluguel/santa-catarina/florianopolis/kitnet_residencial/?pagina=';

    try {
        const adDetailsPromises = [];

        for (let page = 1; page <= 2; page++) {
            const url = `${baseUrl}${page}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                // Find the main content of the ad
                const adList = $('.js-card-selector');

                // Iterate through each ad on the page
                adList.each((index, element) => {
                    const adTitleElement = $(element).find('a.property-card__content-link.js-card-title');
                    const adTitle = adTitleElement.text().trim();
                    const adDescription = $(element).find('.property-card__description').text().trim();
                    const adLink = 'https://www.vivareal.com.br' + adTitleElement.attr('href');
                    const adPrice = $(element).find('.property-card__price').text().trim();
                    const address = $(element).find('.property-card__address').text().trim();

                    // Extract neighborhood using the extractNeighborhood function
                    const neighborhood = extractNeighborhood(address);

                    // Call extractVivaRealImageLinks to get image links and push the promise into the array
                    const imageLinksPromise = extractVivaRealImageLinks(adLink);

                    // Create a promise for this ad's details
                    const adDetailsPromise = imageLinksPromise.then(imageLinks => {
                        return {
                            title: adTitle,
                            description: adDescription,
                            link: adLink,
                            price: adPrice,
                            neighborhood: neighborhood,
                            imageLinks: imageLinks,
                        };
                    });

                    adDetailsPromises.push(adDetailsPromise);
                });
            } else {
                console.error(`Failed to fetch ad details for page ${page}. Status code: ${response.status}`);
            }
        }

        // Wait for all ad details promises to resolve
        const adDetailsArray = await Promise.all(adDetailsPromises);

        return adDetailsArray;
    } catch (error) {
        console.error('Error while scraping ad details:', error.message);
    }
}

module.exports = {
    getVivaRealAdLinks
};

getVivaRealAdLinks()