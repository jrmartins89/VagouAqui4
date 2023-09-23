const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape Roomgo ad details
async function getVivaRealAdLinks() {
    try {
        const response = await axios.get('https://www.vivareal.com.br/aluguel/santa-catarina/florianopolis/kitnet_residencial/');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad
            const adList = $('#js-site-main > div.results__container > div.results__content > section > div.results-main__panel.js-list > div.results-list.js-results-list');

            // Create a JSON object with ad details
            const adDetails = {
                title: adTitle,
                description: adDescription,
                link: adLink,
                price: adPrice,
                neighborhood: neighborhood
            };

            return adDetails;
        } else {
            console.error(`Failed to fetch ad details from ${adLink}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping ad details from ${adLink}:`, error.message);
    }
}
