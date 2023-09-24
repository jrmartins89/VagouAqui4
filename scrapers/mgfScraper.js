const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape and display href values from MGF ad page
async function extractMgfHrefValues() {
    try {
        const baseUrl = 'https://www.mgfimoveis.com.br/aluguel/kitnet/sc-florianopolis?page=';
        const adLinks = [];

        const getPageLinks = async (pageNumber) => {
            const url = `${baseUrl}${pageNumber}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adList = $('#slist > div');

                adList.children().each((index, element) => {
                    const adLink = $(element).find('a.h-100.d-flex.flex-column').attr('href');
                    if (adLink) {
                        adLinks.push(adLink);
                    }
                });
            }
        };

        const pagePromises = [];
        for (let pageNumber = 1; pageNumber <= 40; pageNumber++) {
            pagePromises.push(getPageLinks(pageNumber));
        }

        await Promise.all(pagePromises);

        const adDetails = await extractMgfAdDetails(adLinks);
        JSON.stringify(adDetails, null, 2);

        console.log('Scraping has finished.');
        return adDetails;
    } catch (error) {
        console.error('Error while scraping href values for ads:', error.message);
    }
}

async function extractMgfAdDetails(adLinks) {
    const adDetailPromises = adLinks.map(async (adLink) => {
        try {
            const response = await axios.get(adLink);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                // Find and save the image carrousel
                const imageCarrousel = [];
                $('#imgs > div').each((index, element) => {
                    const source = $(element).find('source');
                    const dataSrcset = source.attr('data-srcset');
                    if (dataSrcset) {
                        imageCarrousel.push(dataSrcset);
                    }
                });

                // Iterate through imageCarrousel and extract image links
                const imageLinks = [];
                imageCarrousel.forEach((srcset) => {
                    const regex = /([^\s,]+)/g;
                    const matches = srcset.match(regex);
                    if (matches && matches.length > 0) {
                        imageLinks.push(matches[0]);
                    }
                });

                // Extract other ad details
                const adTitle = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h1').text().trim();
                const adDescription = $('#dbox > p').text().trim();
                const adPrice = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > div:nth-child(2) > div > div.card.border-secondary.rounded-4.shadow.mb-4.p-3 > h3').text().trim();

                const adDetail = {
                    adTitle,
                    adDescription,
                    adPrice,
                    adLink,
                    imageLinks // Include the extracted image links
                };

                return adDetail;
            }
        } catch (error) {
            console.error('Error while scraping ad details:', error.message);
        }
    });

    const adDetails = await Promise.all(adDetailPromises);

    return adDetails.filter(Boolean);
}


module.exports = {
    extractMgfHrefValues
}

extractMgfHrefValues();
