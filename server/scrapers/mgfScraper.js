const axios = require('axios');
const cheerio = require('cheerio');
const { extractContactInfoFromDescription } = require("./contactInfoScraper");

// Função para fazer scraping e exibir valores de href da página de anúncios do MGF
async function extractMgfHrefValues() {
    try {
        const baseUrl = 'https://www.mgfimoveis.com.br/aluguel/kitnet/sc-florianopolis?page=';
        const adLinks = new Set(); // Usa um Set para armazenar URLs únicos

        const getPageLinks = async (pageNumber) => {
            const url = `${baseUrl}${pageNumber}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adList = $('#slist > div');

                adList.children().each((index, element) => {
                    const adLink = $(element).find('a.h-100.d-flex.flex-column').attr('href');
                    if (adLink) {
                        adLinks.add(adLink); // Adiciona a URL ao Set para garantir unicidade
                    }
                });
            }
        };

        const pagePromises = [];
        for (let pageNumber = 1; pageNumber <= 30; pageNumber++) {
            pagePromises.push(getPageLinks(pageNumber));
        }

        await Promise.all(pagePromises);

        const adLinksArray = Array.from(adLinks); // Converte Set para um array
        const adDetails = await extractMgfAdDetails(adLinksArray);

        return adDetails;
    } catch (error) {
        console.error('Erro durante o scraping do valor de href para os anúncios:', error.message);
    }
}

async function extractMgfAdDetails(adLinks) {
    const adDetailPromises = adLinks.map(async (adLink) => {
        try {
            const response = await axios.get(adLink);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adTitle = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h1').text().trim();
                const FullAdDescription = $('#dbox > p').text().trim();
                const adDescription = FullAdDescription.replace(/CONTINUE LENDO/g, '');
                const contactInfoContent = extractContactInfoFromDescription(adDescription);
                const contactInfo = contactInfoContent.length === 0 ? adLink : contactInfoContent
                const adPrice = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > div:nth-child(2) > div > div.card.border-secondary.rounded-4.shadow.mb-4.p-3 > h3').text().trim();
                const neighborhoodContent = $('body > main > div.row.justify-content-center > article > div:nth-child(2) > header > h2 > a.lead.link-dark.align-middle').text();
                // Divide a string de entrada com base na vírgula
                const parts = neighborhoodContent.split(',');
                let neighborhood;
                // Extrai o bairro (assumindo que seja a primeira parte)
                if (parts.length >= 1) {
                    neighborhood = parts[0].trim();
                }

                // Encontra e salva o carrossel de imagens
                const imageCarrousel = [];
                $('.carousel-item').each((index, element) => {
                    const source = $(element).find('source');
                    const dataSrcset = source.attr('data-srcset');
                    if (dataSrcset) {
                        imageCarrousel.push(dataSrcset);
                    }
                });

                // Itera através do imageCarrousel e extrai links de imagem
                const imageLinks = [];
                imageCarrousel.forEach((srcset) => {
                    const regex = /([^\s,]+)/g;
                    const matches = srcset.match(regex);
                    if (matches && matches.length > 0) {
                        imageLinks.push(matches[0]);
                    }
                });

                const adDetail = {
                    title: adTitle,
                    description: adDescription,
                    price: adPrice,
                    link: adLink,
                    neighborhood: neighborhood,
                    imageLinks: imageLinks,
                    contactInfo: contactInfo.length === 0 ? adLink : contactInfo
                };

                return adDetail;
            }
        } catch (error) {
            console.error('Erro durante o scraping de detalhes do anúncio:', error.message);
        }
    });

    const adDetails = await Promise.all(adDetailPromises);

    return adDetails.filter(Boolean);
}

module.exports = {
    extractMgfHrefValues
}
