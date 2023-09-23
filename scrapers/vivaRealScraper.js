const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape VivaReal ad details
async function getVivaRealAdLinks() {
    try {
        const response = await axios.get('https://www.vivareal.com.br/aluguel/santa-catarina/florianopolis/kitnet_residencial/');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the main content of the ad
            const adList = $('.js-card-selector');

            // Create an array to store ad details
            const adDetailsArray = [];

            // Iterate through each ad
            adList.each((index, element) => {
                const adTitle = $(element).find('.property-card__title').text().trim();
                const adDescription = $(element).find('.property-card__description').text().trim();
                const adLink = $(element).find('a.property-card__link').attr('href');
                const adPrice = $(element).find('.property-card__price').text().trim();
                const neighborhood = $(element).find('.property-card__address').text().trim();


                // Create a JSON object with ad details for each ad and push it to the array
                const adDetails = {
                    title: adTitle,
                    description: adDescription,
                    link: adLink,
                    price: adPrice,
                    neighborhood: neighborhood,
                };

                adDetailsArray.push(adDetails);
            });

            return adDetailsArray;
        } else {
            console.error(`Failed to fetch ad details. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error while scraping ad details:', error.message);
    }
}

// Call the function and handle the returned data
getVivaRealAdLinks()
    .then((adDetailsArray) => {
        // Do something with the adDetailsArray, e.g., log it or process it further
        console.log(adDetailsArray);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
