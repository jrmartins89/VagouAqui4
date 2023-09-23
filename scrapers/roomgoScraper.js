const axios = require('axios');
const cheerio = require('cheerio');
const {extractContactInfoFromDescription} = require("./contactInfoScrapper");

async function scrapeRooomgoAdsPage(pageNumber) {
    try {
        const url = `https://www.roomgo.com.br/santa-catarina/florianopolis-companheiros-de-quarto?page=${pageNumber}#room-ads-area`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];
            const adsPage = $('#room-ads-area > div.listing_area_content');
                ads.push({
                    title: ad.title,
                    link: ad.url,
                    description: ad.description,
                    price: ad.rent_price,
                    imageLinks: imageLinks,
                    neighborhood: ad.district
                });
            return ads;
        } else {
            console.error(`Failed to fetch the json data for page ${pageNumber}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping page ${pageNumber}:`, error.message);
    }
}