const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebQuartoads() {
    try {
        const response = await axios.get('https://www.webquarto.com.br/busca/quartos/florianopolis-sc');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];
            const adsPage = $('body > script:nth-child(12)');
            const scriptHtml = adsPage.html();
            const jsonString = scriptHtml.substring(scriptHtml.indexOf('{'));
            const targetString = 'window.search.city_name = \'Florianópolis - SC\';';
            const startIndex = jsonString.indexOf(targetString);
            const truncatedHtml = jsonString.substring(0, startIndex);
            const secondIndex = truncatedHtml.indexOf(';\n' +'        ');
            const finalJson = JSON.parse(truncatedHtml.substring(0, secondIndex));

            for (let i = 0; i < finalJson.ads.length; i++) {
                const ad = finalJson.ads[i];
                const imageLinks = ad.photos.map(photo => photo.url);

                ads.push({
                    title: ad.title,
                    link: ad.url,
                    description: ad.description,
                    price: ad.rent_price,
                    imageLinks: imageLinks,
                    neighborhood: ad.district
                });
            }

            return ads;
        } else {
            console.error('Failed to fetch the json data. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    scrapeWebQuartoads
};

scrapeWebQuartoads(); // Call the function to start scraping
