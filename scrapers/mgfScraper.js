const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape and display href values from VivaReal ad page
async function extractMgfHrefValues() {
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
                }
            });

            // Call extractMgfAdDetails with adLinks
            const adDetails = await extractMgfAdDetails(adLinks);
            console.log(JSON.stringify(adDetails, null, 2));
        }
    } catch (error) {
        console.error('Error while scraping href values for ads:', error.message);
    }
}

// Function to extract ad details
async function extractMgfAdDetails(adLinks) {
    const adDetails = [];

    for (const adLink of adLinks) {
        try {
            const response = await axios.get(adLink);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adTitle = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h1').text().trim();
                const adDescription = $('#dbox > p').text().trim();
                const adPrice = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > div:nth-child(2) > div > div.card.border-secondary.rounded-4.shadow.mb-4.p-3 > h3').text().trim();

                // Create an object to store ad details
                const adDetail = {
                    adTitle,
                    adDescription,
                    adPrice,
                    adLink
                };

                adDetails.push(adDetail);
            }
        } catch (error) {
            console.error('Error while scraping ad details:', error.message);
        }
    }

    return adDetails;
}

module.exports = {
    extractMgfHrefValues
}

// Call the function to start scraping and displaying href values
extractMgfHrefValues();
