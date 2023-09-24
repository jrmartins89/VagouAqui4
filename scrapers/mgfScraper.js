const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape and display href values from VivaReal ad page
async function extractMgfAdLinkValues() {
    try {
        const response = await axios.get('https://www.mgfimoveis.com.br/aluguel/kitnet/sc-florianopolis?page=1');
        const adLinks = [];
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adList = $('#slist > div');

            // Parse through all children elements of 'adList'
            adList.children().each((index, element) => {
                const adLink = $(element).find('a.h-100.d-flex.flex-column').attr('href');
                if (adLink) {
                    adLinks.push(adLink);
                    console.log('Ad Link:', adLink);
                }
            });
        }
        return adLinks;
    } catch (error) {
        console.error('Error while scraping href values for ads:', error.message);
    }
}

module.exports = {
    extractMgfAdLinkValues
}

// Call the function to start scraping and displaying href values
extractMgfAdLinkValues();
