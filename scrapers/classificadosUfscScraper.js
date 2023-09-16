const { scrapeImagesClassificadosUfsc }  = require('./imageScraper');
const axios = require('axios');
const cheerio = require('cheerio');

async function getAdLinks(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const items = [];

        $('table tr').each((index, element) => {
            const titleColumn = $(element).find('td:nth-child(2)');
            const linkElement = titleColumn.find('a');
            const link = 'https://classificados.inf.ufsc.br/' + linkElement.attr('href');
            if (isValidLink(link)) {
                items.push({ link });
            }
        });

        return items;
    } catch (error) {
        console.error('Error fetching ad list:', error);
        return [];
    }
}

function isValidLink(link) {
    const linkPattern = /^https:\/\/classificados\.inf\.ufsc\.br\/detail/;
    return linkPattern.test(link);
}

async function getAdDetails(items) {
    const itemsWithDetails = [];

    for (const item of items) {
        try {
            const response = await axios.get(item.link);

            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);

                const table = $('#container > div:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(1) > form > table');
                const priceRow = table.find('tr:has(td[valign="top"]:contains("Preço"))');

                const priceCell = priceRow.find('td[valign="top"]:contains("Preço") + td');
                const price = priceCell.text().trim();

                const box = $('.box');
                const title = box.find('h1').text().trim();
                let description = box.find('[colspan="2"]').text().trim();

                const regexMatch = description.match(/Descrição:(.*?)Detalhes Gerais:/s);
                if (regexMatch && regexMatch[1]) {
                    description = regexMatch[1].trim();
                }
                const imageUrls = item.link + '&show_still=1';

                const adImages = await scrapeImagesClassificadosUfsc(imageUrls);

                itemsWithDetails.push({
                    title: title,
                    link: item.link,
                    description: description,
                    price: price,
                    imageLinks: adImages
                });
            } else {
                console.error(`Error fetching ad details for ${item.link}: Status ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching ad details for ${item.link}: ${error}`);
        }
    }

    return itemsWithDetails;
}

module.exports = {
    getAdLinks,
    getAdDetails
};
