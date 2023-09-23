const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape Roomgo ad details
async function getRoomgoAdDetails(adLink) {
    try {
        const response = await axios.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad
            const adContent = $('#roomDetail > div.page.page-room-detail > div.grid-wrapper.grid-12 > div.grid-box.span-7 > div.main-content');

            // Find the description text inside adContent
            const adDescription = adContent.find('div.content-block.description-text p').text();

            // Display the ad description in the console
            console.log("Ad Description:");
            console.log(adDescription);

            return adDescription;
        } else {
            console.error(`Failed to fetch ad details from ${adLink}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping ad details from ${adLink}:`, error.message);
    }
}

// Function to scrape Roomgo ad links
async function scrapeRoomgoAdsPage(pageNumber) {
    try {
        const url = `https://www.roomgo.com.br/santa-catarina/florianopolis-companheiros-de-quarto?page=${pageNumber}#room-ads-area`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adLinks = [];

            // Extract data-url values from elements with the listing_item class
            $('.listing_item').each((index, element) => {
                const dataUrl = $(element).attr('data-url');
                if (dataUrl) {
                    adLinks.push('https://www.roomgo.com.br/santa-catarina' + dataUrl);
                }
            });

            // Display ad links on the console
            console.log("Ad Links:");
            console.log(adLinks);

            // You can continue with the rest of your scraping logic here
            return adLinks;
        } else {
            console.error(`Failed to fetch the HTML data for page ${pageNumber}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping page ${pageNumber}:`, error.message);
    }
}

module.exports = {
    scrapeRoomgoAdsPage,
    getRoomgoAdDetails
};

// Example usage:
scrapeRoomgoAdsPage(1)
   .then((adLinks) => {
       // Now you can iterate through adLinks and call getRoomgoAdDetails for each ad
       adLinks.forEach((adLink) => {
           getRoomgoAdDetails(adLink);
       });
   })
   .catch((error) => {
       console.error(error);
   });
