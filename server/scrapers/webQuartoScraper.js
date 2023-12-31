const axios = require('axios');
const cheerio = require('cheerio');
const { extractContactInfoFromDescription } = require('./contactInfoScraper');
const axiosRateLimit = require('axios-rate-limit');

// Cria uma instância do axios com limitação de taxa
const axiosInstance = axiosRateLimit(axios.create(), {
    maxRequests: 1, // Número de requisições por segundo
    perMilliseconds: 1000, // Milissegundos por requisição (neste caso, 1 requisição por segundo)
});

// Define uma função para fazer scraping de uma única página do WebQuarto
async function scrapeWebQuartoadsPage(pageNumber) {
    try {
        const url = `https://www.webquarto.com.br/busca/quartos/florianopolis-sc?page=${pageNumber}`;
        const response = await axiosInstance.get(url); // Usa a instância do axios com limitação de taxa

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const ads = [];
            const adsPage = $('body > script:nth-child(12)');
            const scriptHtml = adsPage.html();
            const jsonString = scriptHtml.substring(scriptHtml.indexOf('{'));
            const targetString = 'window.search.city_name = \'Florianópolis - SC\';';
            const startIndex = jsonString.indexOf(targetString);
            const truncatedHtml = jsonString.substring(0, startIndex);
            const secondIndex = truncatedHtml.indexOf(';\n' + '        ');
            const finalJson = JSON.parse(truncatedHtml.substring(0, secondIndex));

            for (let i = 0; i < finalJson.ads.length; i++) {
                const ad = finalJson.ads[i];
                const contactInfo = extractContactInfoFromDescription(ad.description);
                const imageLinks = ad.photos.map(photo => photo.url);

                ads.push({
                    title: ad.title,
                    link: ad.url,
                    description: ad.description,
                    price: ad.rent_price,
                    imageLinks: imageLinks,
                    neighborhood: ad.district,
                    contactInfo: contactInfo.length === 0 ? ad.url : contactInfo
                });
            }

            return ads;
        } else {
            console.error(`Erro ao listar o json de dados para a página ${pageNumber}. Código do status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Erro durante o scraping da página ${pageNumber}:`, error.message);
    }
}

// Define uma função para fazer scraping de todas as páginas de 1 a 8
async function scrapeWebQuartoads() {
    const allAds = [];
    for (let pageNumber = 1; pageNumber <= 8; pageNumber++) {
        const ads = await scrapeWebQuartoadsPage(pageNumber);
        if (ads) {
            allAds.push(...ads);
        }
    }
    return allAds;
}

module.exports = {
    scrapeWebQuartoads
};
