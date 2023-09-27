const axios = require('axios');
const cheerio = require('cheerio');
const {extractContactInfoFromDescription} = require("./contactInfoScraper");

// Function to scrape and display href values from MGF ad page
async function extractMgfHrefValues() {
    try {
        const baseUrl = 'https://www.mgfimoveis.com.br/aluguel/kitnet/sc-florianopolis?page=';
        const adLinks = new Set(); // Use a Set to store unique URLs

        const getPageLinks = async (pageNumber) => {
            const url = `${baseUrl}${pageNumber}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adList = $('#slist > div');

                adList.children().each((index, element) => {
                    const adLink = $(element).find('a.h-100.d-flex.flex-column').attr('href');
                    if (adLink) {
                        adLinks.add(adLink); // Add the URL to the Set to ensure uniqueness
                    }
                });
            }
        };

        const pagePromises = [];
        for (let pageNumber = 1; pageNumber <= 30; pageNumber++) {
            pagePromises.push(getPageLinks(pageNumber));
        }

        await Promise.all(pagePromises);

        const adLinksArray = Array.from(adLinks); // Convert Set to an array
        const adDetails = await extractMgfAdDetails(adLinksArray);

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
                const adTitle = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h1').text().trim();
                const adDescription = $('#dbox > p').text().trim();
                const contactInfoContent = extractContactInfoFromDescription(adDescription);
                const contactInfo = contactInfoContent.length === 0 ? adLink : contactInfoContent
                const adPrice = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > div:nth-child(2) > div > div.card.border-secondary.rounded-4.shadow.mb-4.p-3 > h3').text().trim();
                const neighborhoodContent = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h2 > a.lead.link-dark.align-middle').text();
                // Split the input string based on the comma
                const parts = neighborhoodContent.split(',');
                let neighborhood;
                // Extract the neighborhood (assuming it's the first part)
                if (parts.length >= 1) {
                     neighborhood = parts[0].trim();
                }

                // Find and save the image carrousel
                const imageCarrousel = [];
                $('.carousel-item').each((index, element) => {
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



                const adDetail = {
                    title: adTitle,
                    description: adDescription,
                    price: adPrice,
                    link: adLink,
                    neighborhood: neighborhood,
                    imageLinks: imageLinks,
                    contactInfo: contactInfo
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
