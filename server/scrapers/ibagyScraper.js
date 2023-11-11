const axios = require('axios');
const axiosRateLimit = require('axios-rate-limit');
const cheerio = require('cheerio');
const { scrapeImagesIbagy } = require('./imageScraper');
const { extractIdfromAdLink, extractPhoneFromWhatsAppLink } = require('./contactInfoScraper');

const rateLimitedAxios = axiosRateLimit(axios.create(), {
    maxRequests: 2, // Ajuste esse valor com base na política de limitação de requisições do site
    perMilliseconds: 1000, // Ajuste esse valor com base na política de limitação de requisições do site
});

// Função para fazer scraping dos anúncios do Ibagy
async function scrapeIbagyAds() {
    const pages = [
        'https://ibagy.com.br/aluguel/residencial/florianopolis/',
        'https://ibagy.com.br/aluguel/kitnet_conjugado/florianopolis'
    ];

    try {
        const pagePromises = pages.map(async (page) => {
            try {
                const response = await rateLimitedAxios.get(page);

                if (response.status === 200) {
                    const $ = cheerio.load(response.data);
                    const adsPage = $('#imovel-boxes');
                    const adsLinks = new Set();

                    adsPage.find('a[target="_blank"]').each((index, element) => {
                        const link = $(element).attr('href');
                        if (link) {
                            adsLinks.add(link);
                        }
                    });

                    const uniqueAdsLinks = Array.from(adsLinks);
                    return uniqueAdsLinks;
                } else {
                    console.error('Erro ao realizar a busca da página. Código do status:', response.status);
                    return [];
                }
            } catch (error) {
                console.error('Erro ao fazer o scraping de informações da página:', error.message);
                return [];
            }
        });

        const allPageLinks = await Promise.all(pagePromises);
        const adLinks = [].concat(...allPageLinks);

        const adItems = await scrapeIbagyAdsDetails(adLinks);
        return adItems;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Função para fazer scraping dos detalhes dos anúncios do Ibagy
async function scrapeIbagyAdsDetails(adLinks) {
    try {
        const adDetailsArray = [];

        const adPromises = adLinks.map(async (link) => {
            const response = await axios.get(link);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const adDescriptionMatch = $('#clb-descricao > div > div > div:nth-child(3) > p').text();
                const titleMatch = $('#clb-descricao h2').text();
                const title = titleMatch || 'Title not found';
                const price = $('#clb-imovel-topo > div > div:nth-child(1) > div:nth-child(2) > div.property-thumb-info-label > span > span.thumb-price').text() + ' + taxas';
                const address = $('#section-map > div > div > div > div > p > span').text();
                const neighborhood = extractNeighborhood(address);
                const adIdNumber = extractIdfromAdLink(link);
                const contactLinkObject = $(`#imovelView_asyncSubmit > div.mauticform-innerform > div > div.propertyform-bottom > a.clb-gtm-site-whatsapp.clb-gtm-imovel-form-whatsapp.clb-gtm-imovel-${adIdNumber}.clb-interesse-aluguel`);
                let contactInfo = extractPhoneFromWhatsAppLink(contactLinkObject["0"].attribs.href);
                contactInfo = contactInfo.length === 0 ? link : contactInfo;
                const imageLinks = await scrapeImagesIbagy(link);
                const adDetails = {
                    title,
                    adDescription: adDescriptionMatch,
                    imageLinks,
                    link,
                    price,
                    neighborhood,
                    contactInfo
                };
                adDetailsArray.push(adDetails);
            } else {
                console.error('Erro ao buscar detalhes de anúncios de:', link);
            }
        });

        await Promise.all(adPromises);
        return adDetailsArray;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Função para extrair o bairro do endereço
function extractNeighborhood(address) {
    const neighborhoodMatch = /(\d+,\s*)(.*?)\s*-\s*Florianópolis\/Sc/i.exec(address);
    if (neighborhoodMatch) {
        return neighborhoodMatch[2].trim();
    } else {
        return 'Bairro não encontrado';
    }
}

module.exports = {
    scrapeIbagyAds
};
