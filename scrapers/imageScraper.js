const https = require('https');
const cheerio = require('cheerio');

async function scrapeImagesClassificadosUfsc(imageUrls) {
    return new Promise((resolve, reject) => {
        https.get(imageUrls, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const $ = cheerio.load(data);

                const images = new Set(); // Use a Set to store unique image URLs

                $('img').each((index, element) => {
                    const imageUrl = $(element).attr('src');
                    if (imageUrl && imageUrlPattern.test(imageUrl)) {
                        images.add(imageUrl);
                    }
                });

                // Transform the Set back to an array and filter the image URLs if needed
                const adImages = Array.from(images)
                    .map(image => image.replace('_tmb1.jpg', '.jpg'));

                resolve(adImages);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function scrapeImagesIbagy(url) {
    const imageUrlPattern = /https:\/\/cdn\.vistahost\.com\.br\/ibagyimo\/vista\.imobi\/fotos\//;
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const $ = cheerio.load(data);

                const images = new Set(); // Use a Set to store unique image URLs

                $('img').each((index, element) => {
                    const imageUrl = $(element).attr('src');
                    if (imageUrl && imageUrlPattern.test(imageUrl)) {
                        images.add(imageUrl);
                    }
                });

                // Transform the Set back to an array
                const uniqueImages = Array.from(images);
                console.log(uniqueImages)
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
