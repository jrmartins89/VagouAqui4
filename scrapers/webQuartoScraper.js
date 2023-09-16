const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebQuartoads() {
    try {
        const response = await axios.get('https://www.webquarto.com.br/busca/quartos/florianopolis-sc');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = new Set();
            const adsPage = $('.col-xs-12');

            // Use Cheerio to select the elements you want to scrape
            adsPage.find('a[target="_blank"]').each((index, element) => {
                const link = $(element).attr('href');
                if (link) {
                    ads.add(link); // Add the link to the Set
                }
            })
            const adsList = Array.from(ads);
            console.log('Scraped titles:', adsList);
        } else {
            console.error('Failed to fetch the page. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    scrapeWebQuartoads
};

scrapeWebQuartoads(); // Call the function to start scraping
