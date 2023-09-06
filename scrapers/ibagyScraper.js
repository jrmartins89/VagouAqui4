const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { scrapeImagesIbagy } = require('./imageScraper');
let adItems;
async function scrapeIbagyAds() {
    try {
        const response = await axios.get('https://ibagy.com.br/aluguel/kitnet_conjugado/florianopolis/');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adsPage = $('#imovel-boxes');

            const adsLinks = new Set(); // Use a Set to store unique links

            adsPage.find('a[target="_blank"]').each((index, element) => {
                const link = $(element).attr('href');
                if (link) {
                    adsLinks.add(link); // Add the link to the Set
                }
            });

            const uniqueAdsLinks = Array.from(adsLinks); // Convert the Set back to an array

            const adsData = { links: uniqueAdsLinks };

            fs.writeFileSync('adsLinks.json', JSON.stringify(adsData, null, 2));

            console.log('Unique ads links saved to adsLinks.json');

            // Call the function to scrape ad details
          adItems  = await scrapeIbagyAdsDetails(uniqueAdsLinks);
        } else {
            console.error('Failed to fetch the page. Status code:', response.status);
        }
        return adItems;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function scrapeIbagyAdsDetails(adLinks) {
    try {
        const adDetailsArray = []; // Create an array to store ad details JSON objects

        for (const link of adLinks) {
            const response = await axios.get(link);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adDescriptionMatch = $('#clb-descricao > div > div > div:nth-child(3) > p').text();
                const titleMatch = $('#clb-descricao h2').text();
                const title = titleMatch || 'Title not found';
                const price = $('#clb-imovel-topo > div > div:nth-child(1) > div:nth-child(2) > div.property-thumb-info-label > span > span.thumb-price').text()+ ' + taxas';
                const address = $('#section-map > div > div > div > div > p > span').text();
                console.log('bairro >>>>>>>>>>>>>>>>>', address);
                // Call scrapeImagesIbagy to get image links
                const imageLinks = await scrapeImagesIbagy(link);
                // Create an adDetails object for this ad
                const adDetails = {
                    title,
                    adDescription: adDescriptionMatch || 'Description not found',
                    imageLinks,
                    link,
                    price
                };

                // Push the adDetails object to the array
                adDetailsArray.push(adDetails);
            } else {
                console.error('Failed to fetch ad details from:', link);
            }
        }
        // Return the array of ad details objects
        return adDetailsArray;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    scrapeIbagyAds
};