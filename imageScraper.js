const https = require('https');
const cheerio = require('cheerio');

function scrapeImages(url, callback) {
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const $ = cheerio.load(data);

            const images = [];

            $('img').each((index, element) => {
                images.push($(element).attr('src'));
            });

            const adImages = images.filter(image => image.includes('images') && image.includes('_tmb1.jpg'))
                .map(image => image.replace('images/', 'https://classificados.inf.ufsc.br/images/')
                    .replace('_tmb1.jpg', '.jpg'));

            callback(null, adImages);
        });
    }).on('error', (error) => {
        callback(error, null);
    });
}

module.exports = {
    scrapeImages
};
