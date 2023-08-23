const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAds(url) {
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

        return items;
    } catch (error) {
        throw new Error(`Error scraping ads: ${error.message}`);
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

module.exports = {
    scrapeAds,
    getAdDetails
};
