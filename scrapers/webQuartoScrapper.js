const axios = require('axios');
const cheerio = require('cheerio');


async function scrapeWebQuartoads() {
    try {
        const response = await axios.get('https://www.webquarto.com.br/busca/quartos/florianopolis-sc');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
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