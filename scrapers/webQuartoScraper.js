const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebQuartoads() {
    try {
        const response = await axios.get('https://www.webquarto.com.br/busca/quartos/florianopolis-sc');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];

            // Use Cheerio to select the elements you want to scrape
            $('.row').each((index, element) => {
                const title = $(element).text();
                ads.push(title);
            });

            console.log('Scraped titles:', ads);
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
