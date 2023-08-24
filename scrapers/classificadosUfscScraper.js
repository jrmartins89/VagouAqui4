const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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
        const errorMessage = `Error fetching ad list: ${error}`;
        writeToErrorLog(errorMessage);
        console.error(errorMessage);
        return []; // Return an empty array to indicate failure
    }
}

function isValidLink(link) {
    const linkPattern = /^https:\/\/classificados\.inf\.ufsc\.br\/detail/;
    return linkPattern.test(link);
}

function writeToErrorLog(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile('error_log.txt', logMessage, (err) => {
        if (err) {
            console.error('Error writing to error log:', err);
        }
    });
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
                    description: description,
                });
            } else {
                const errorMessage = `Error fetching ad details for ${item.link}: Status ${response.status}`;
                writeToErrorLog(errorMessage);
                console.error(errorMessage);
            }

        } catch (error) {
            const errorMessage = `Error fetching ad details for ${item.link}: ${error}`;
            writeToErrorLog(errorMessage);
            console.error(errorMessage);
        }
    }

    return itemsWithDetails;
}

module.exports = {
    getAdLinks,
    getAdDetails
};
