const https = require('https');
const cheerio = require('cheerio');
const imageUrlPattern = /https:\/\/cdn\.vistahost\.com\.br\/ibagyimo\/vista\.imobi\/fotos\//;

// Função para fazer scraping de imagens do Classificados UFSC
async function scrapeImagesClassificadosUfsc(imageUrls) {
    return new Promise((resolve, reject) => {
        https.get(imageUrls, (response) => {
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

                resolve(adImages);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Função para fazer scraping de imagens do Ibagy
async function scrapeImagesIbagy(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const $ = cheerio.load(data);

                const images = new Set(); // Usa um Set para armazenar URLs de imagens únicas

                $('img').each((index, element) => {
                    const imageUrl = $(element).attr('src');
                    if (imageUrl && imageUrlPattern.test(imageUrl)) {
                        images.add(imageUrl);
                    }
                });

                // Converte o Set de volta para um array
                const uniqueImages = Array.from(images);
                resolve(uniqueImages);
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
    });
}

module.exports = {
    scrapeImagesClassificadosUfsc,
    scrapeImagesIbagy
};
