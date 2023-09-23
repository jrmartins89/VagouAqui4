const axios = require('axios');
const cheerio = require('cheerio');
const { extractContactInfoFromDescription } = require("./contactInfoScrapper");

async function scrapeRoomgoAdsPage(pageNumber) {
    try {
        const url = `https://www.roomgo.com.br/santa-catarina/florianopolis-companheiros-de-quarto?page=1#room-ads-area`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];

            const adLinks = []; // Variable to store ad links

            // Extract data-url values from elements with the listing_item class
            $('.listing_item').each((index, element) => {
                const dataUrl = $(element).attr('data-url');
                if (dataUrl) {
                    adLinks.push(dataUrl);
                }
            });

            // Display ad links on the console
            console.log("Ad Links:");
            console.log(adLinks);

            // You can continue with the rest of your scraping logic here

            return ads;
        } else {
            console.error(`Failed to fetch the HTML data for page ${pageNumber}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping page ${pageNumber}:`, error.message);
    }
}

module.exports = {
    scrapeRoomgoAdsPage
};

scrapeRoomgoAdsPage();


// Example usage:
// scrapeRoomgoAdsPage(1)
//   .then((ads) => {
//       console.log(ads);
//   })
//   .catch((error) => {
//       console.error(error);
//   });
