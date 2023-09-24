const axios = require('axios');
const cheerio = require('cheerio');
const {extractContactInfoFromDescription} = require("./contactInfoScraper");

// Define a function to scrape a single page
async function scrapeWebQuartoadsPage(pageNumber) {
    try {
        const url = `https://www.webquarto.com.br/busca/quartos/florianopolis-sc?page=${pageNumber}`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];
            const adsPage = $('body > script:nth-child(12)');
            const scriptHtml = adsPage.html();
            const jsonString = scriptHtml.substring(scriptHtml.indexOf('{'));
            const targetString = 'window.search.city_name = \'Florianópolis - SC\';';
            const startIndex = jsonString.indexOf(targetString);
            const truncatedHtml = jsonString.substring(0, startIndex);
            const secondIndex = truncatedHtml.indexOf(';\n' + '        ');
            const finalJson = JSON.parse(truncatedHtml.substring(0, secondIndex));

            for (let i = 0; i < finalJson.ads.length; i++) {
                const ad = finalJson.ads[i];
                const contactInfo = extractContactInfoFromDescription(ad.description);
                const imageLinks = ad.photos.map(photo => photo.url);

                ads.push({
                    title: ad.title,
                    link: ad.url,
                    description: ad.description,
                    price: ad.rent_price,
                    imageLinks: imageLinks,
                    neighborhood: ad.district,
                    contactInfo: contactInfo
                });
            }

            return ads;
        } else {
            console.error(`Failed to fetch the json data for page ${pageNumber}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping page ${pageNumber}:`, error.message);
    }
}

// Define a function to scrape all pages from 1 to 8
async function scrapeWebQuartoads() {
    const allAds = [];
    for (let pageNumber = 1; pageNumber <= 8; pageNumber++) {
        const ads = await scrapeWebQuartoadsPage(pageNumber);
        if (ads) {
            allAds.push(...ads);
        }
    }
    return allAds;
}

module.exports = {
    scrapeWebQuartoads
};
