const axios = require('axios');
const cheerio = require('cheerio');
const axiosRateLimit = require('axios-rate-limit');
const { extractContactInfoFromDescription } = require("./contactInfoScraper");

// Cria uma instância do axios com limitação de taxa (1 requisição por segundo)
const axiosInstance = axiosRateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 1000, // 1 requisição por segundo
});

// Função para fazer scraping dos links de imagem da página de anúncio do VivaReal
async function extractVivaRealImageLinks(adLink) {
    try {
        const response = await axiosInstance.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Encontra o conteúdo principal da página de anúncio
            const imageElements = $('.carousel__image');

            // Extrai os links de imagem do atributo src
            const imageLinks = imageElements.map((index, element) => $(element).attr('src')).get();

            return imageLinks;
        } else {
            console.error(`Erro ao realizar o scraping dos links de imagem do anúncio: ${adLink}. Código do status: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`Erro ao realizar o scraping dos links de imagem do anúncio: ${adLink}`, error.message);
        return [];
    }
}

// Função para fazer scraping dos detalhes de anúncios no VivaReal
async function getVivaRealAdLinks() {
    try {
        const response = await axios.get('https://www.vivareal.com.br/aluguel/santa-catarina/florianopolis/kitnet_residencial/');

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Encontra o conteúdo principal do anúncio
            const adList = $('.js-card-selector');

            // Cria um array para armazenar promessas para detalhes e links de imagem do anúncio
            const adDetailsPromises = adList.map(async (index, element) => {
                const adTitleElement = $(element).find('a.property-card__content-link.js-card-title');
                const adTitle = adTitleElement.text().trim();
                const adLink = 'https://www.vivareal.com.br' + adTitleElement.attr('href');
                const adPrice = $(element).find('.property-card__price').text().trim();
                const address = $(element).find('.property-card__address').text().trim();

                // Usa await para resolver a promessa da descrição
                const adDescription = await extractDescription(adLink);
                const contactInfo = extractContactInfoFromDescription(adDescription);
                // Extrai o bairro usando a função extractNeighborhood
                const neighborhood = extractNeighborhood(address);

                // Busca links de imagem e detalhes do anúncio em paralelo
                const [imageLinks, adDetails] = await Promise.all([
                    extractVivaRealImageLinks(adLink),
                    Promise.resolve({
                        title: adTitle,
                        description: adDescription,
                        link: adLink,
                        price: adPrice,
                        neighborhood: neighborhood,
                        contactInfo: contactInfo.length === 0 ? adLink : contactInfo
                    }),
                ]);

                return { ...adDetails, imageLinks };
            }).get();

            // Aguarda a resolução de todas as promessas de detalhes do anúncio
            const adDetailsArray = await Promise.all(adDetailsPromises);
            return adDetailsArray;
        } else {
            console.error(`Erro ao buscar detalhes de anúncios. Código do status: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro durante o scraping de informações sobre um anúncio:', error.message);
    }
}

async function extractDescription(adLink) {
    try {
        const response = await axios.get(adLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const adDescription = $('#js-site-main > div.main-container > div.main-features-container > div.details-container > div.description > div > div > p').text().trim();
            return adDescription;
        }
    } catch (error) {
        console.error('Erro ao realizar o scraping da descrição do anúncio:', error.message);
    }
}

// Função para extrair o bairro do endereço
function extractNeighborhood(address) {
    // Divide o endereço por vírgulas e hifens
    const parts = address.split(/,|-/);

    // Encontra a primeira parte não vazia que representa o bairro
    for (let i = 0; i < parts.length; i++) {
        const trimmedPart = parts[i].trim();

        // Verifica se a parte contém apenas letras ou espaços (potencial bairro)
        if (/^[A-Za-z\s]+$/.test(trimmedPart)) {
            return trimmedPart;
        }
    }

    // Se nenhum bairro for encontrado, retorna null
    return null;
}

module.exports = {
    getVivaRealAdLinks,
};
