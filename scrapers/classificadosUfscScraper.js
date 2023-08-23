const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Ad = require('../models/Ads');

require('dotenv').config(); // Load environment variables from .env file

const url = 'https://classificados.inf.ufsc.br/index.php?catid=88';

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });

async function scrape() {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const items = [];

        $('table tr').each((index, element) => {
            const titleColumn = $(element).find('td:nth-child(2)');
            const linkElement = titleColumn.find('a');
            const link = 'https://classificados.inf.ufsc.br/' + linkElement.attr('href');
            const title = linkElement.text().trim();

            if (link && title) {
                items.push({ title, link });
            }
        });

        // Call getAdDetails after scraping is done
        const itemsWithDetails = await getAdDetails(items);

        // Assign sequential ids to the items and reorder properties
        const finalItems = itemsWithDetails.map((item, index) => ({
            title: item.title,
            link: item.link,
            description: item.description
        }));

        // Save the final items to MongoDB collection 'ads'
        await Ad.insertMany(finalItems);
        console.log('Scraped data has been saved to MongoDB collection "ads"');

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAdDetails(items) {
    const itemsWithDetails = [];

    for (const item of items) {
        try {
            const response = await axios.get(item.link);

            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);

                const box = $('.box');

                const title = box.find('h1').text().trim();
                let description = box.find('[colspan="2"]').text().trim();

                // Extract description using regex between 'Descrição:' and 'Detalhes Gerais:'
                const regexMatch = description.match(/Descrição:(.*?)Detalhes Gerais:/s);
                if (regexMatch && regexMatch[1]) {
                    description = regexMatch[1].trim();
                }

                itemsWithDetails.push({
                    title: title,
                    link: item.link,
                    description: description
                });
            } else {
                console.error(`Error fetching ad details for ${item.link}: Status ${response.status}`);
            }

        } catch (error) {
            console.error(`Error fetching ad details for ${item.link}:`, error);
        }
    }

    return itemsWithDetails;
}

scrape();
