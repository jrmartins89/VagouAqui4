const https = require('https');
const cheerio = require('cheerio');

const url = 'https://classificados.inf.ufsc.br/detail.php?id=208568&show_still=1';

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

        const adImages = images.filter(image => image.includes('images') && image.includes('_tmb1.jpg'));

        console.log('Ad Images:');
        console.log(adImages);
    });
});
