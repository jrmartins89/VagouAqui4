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
            const adHeader = $('#roomDetail > div.page.page-room-detail > div.grid-wrapper.grid-12 > div.grid-box.span-7');
            const adPriceContent = $('#roomDetail > div.page.page-room-detail > div.grid-wrapper.grid-12 > div.grid-box.span-7 > div:nth-child(4)');
            // Find the description text inside adContent
            const adDescription = adContent.find('div.content-block.description-text p').text();
            const adTitle = adHeader.find('div.content-block.header-block h1').text();
            const adPrice = adPriceContent. find('h4.cost-detail span').text();
            // Create a JSON object with ad details
            const adDetails = {
                title: adTitle,
                description: adDescription,
                link: adLink,
                price: adPrice
            };

            return adDetails;
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

            return adLinks;
        } else {
            console.error(`Failed to fetch the HTML data for page ${pageNumber}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error while scraping page ${pageNumber}:`, error.message);
    }
}

// Example usage:
const numberOfPages = 2;

(async () => {
    const adLinksArray = [];

    for (let i = 1; i <= numberOfPages; i++) {
        const adLinks = await scrapeRoomgoAdsPage(i);
        adLinksArray.push(...adLinks); // Collect all ad links
    }

    // Wait for all ad links to be collected, then scrape ad details
    const adDetailsArray = await Promise.all(adLinksArray.map(getRoomgoAdDetails));

    // Do something with the ad details, which is an array of JSON objects
    console.log(adDetailsArray);
})();
