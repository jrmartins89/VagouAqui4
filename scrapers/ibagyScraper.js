const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeIbagyAds() {
    try {
        // Make an HTTP GET request to the target URL
        const response = await axios.get('https://ibagy.com.br/aluguel/kitnet_conjugado/florianopolis/');

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Load the HTML content using Cheerio
            const $ = cheerio.load(response.data);

            // Find the element with id 'imovel-boxes'
            const adsPage = $('#imovel-boxes');

            // Find all <a> elements with target='_blank' and retrieve their 'href' attributes
            const adsLinks = adsPage.find('a[target="_blank"]').map((index, element) => {
                return $(element).attr('href');
            }).get();

            // Show the links in the console
            console.log(adsLinks);
        } else {
            console.error('Failed to fetch the page. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Call the scraper function
scrapeIbagyAds();
