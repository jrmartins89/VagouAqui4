const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape image links from VivaReal ad page
async function extractVivaRealImageLinks() {
    try {
        const response = await axios.get('https://www.mgfimoveis.com.br/aluguel/kitnet/sc-florianopolis?page=1');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adList = $('#slist > div');

        }
    } catch (error) {
        console.error('Error while scraping image links for ad' , error.message);
        return [];
    }
}

module.exports = {
    extractVivaRealImageLinks
};
extractVivaRealImageLinks();