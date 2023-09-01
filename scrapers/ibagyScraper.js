const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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
            await scrapeIbagyAdsDetails(uniqueAdsLinks);
        } else {
            console.error('Failed to fetch the page. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function scrapeIbagyAdsDetails(adLinks) {
    try {
        for (const link of adLinks) {
            const response = await axios.get(link);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const description = $('#clb-descricao').html();

                const titleMatch = description.match(/<h2>(.*?)<\/h2>/);
                const title = titleMatch ? titleMatch[1] : 'Title not found';

                const adDescriptionMatch = description.match(/clb-descricao > div > div > div:nth-child(3) > p/);
                const adDescription = adDescriptionMatch ? $(adDescriptionMatch[0]).text() : 'Description not found';

                console.log('Title:', title);
                console.log('Ad Description:', adDescription);
            } else {
                console.error('Failed to fetch ad details from:', link);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

scrapeIbagyAds();