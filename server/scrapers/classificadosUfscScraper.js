const axios = require('axios');
const cheerio = require('cheerio');
const axiosRetry = require('axios-retry');
const axiosRateLimit = require('axios-rate-limit');
const { scrapeImagesClassificadosUfsc } = require('./imageScraper');
const { extractContactInfoFromDescription } = require('./contactInfoScraper');

// Cria uma instância Axios com limite de taxa e tentativas de repetição
const axiosInstance = axiosRateLimit(axios.create(), {
    maxRequests: 2, // Número de requisições por segundo
    perMilliseconds: 1000, // Milissegundos por requisição (neste caso, 1 requisição por segundo)
});

axiosRetry(axiosInstance, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Função para obter os links dos anúncios a partir de uma URL
async function getAdLinks(url) {
    try {
        const response = await axiosInstance.get(url);
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
        console.error('Erro ao pegar a lista de anúncios:', error);
        return [];
    }
}

// Função para verificar se um link é válido
function isValidLink(link) {
    const linkPattern = /^https:\/\/classificados\.inf\.ufsc\.br\/detail/;
    return linkPattern.test(link);
}

// Função para obter detalhes dos anúncios a partir dos links
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
                const genderRow = table.find('tr:has(td[valign="top"]:contains("Gênero"))');
                const genderCell = genderRow.find('td[valign="top"]:contains("Gênero") + td');
                const gender = genderCell.text().trim();
                const neighborhoodRow = table.find('tr:has(td[valign="top"]:contains("Bairro"))');
                const neighborhoodCell = neighborhoodRow.find('td[valign="top"]:contains("Bairro") + td');
                const neighborhood = neighborhoodCell.text().trim();

                // Verifica se algum dos valores críticos está vazio
                if (!price || !gender || !neighborhood) {
                    console.warn(`Faltaram informações para o anúncio: ${item.link}. Ele será ignorado`);
                    continue; // Pula este anúncio e passa para o próximo
                }

                const box = $('.box');
                const title = box.find('h1').text().trim();
                let description = box.find('[colspan="2"]').text().trim();

                const regexMatch = description.match(/Descrição:(.*?)Detalhes Gerais:/s);
                if (regexMatch && regexMatch[1]) {
                    description = regexMatch[1].trim();
                }
                const imageUrls = item.link + '&show_still=1';

                const adImages = await scrapeImagesClassificadosUfsc(imageUrls);
                // Extrai informações de contato da descrição
                let contactInfo = extractContactInfoFromDescription(description);
                contactInfo = contactInfo.length === 0 ? item.link : contactInfo;
                itemsWithDetails.push({
                    title: title,
                    link: item.link,
                    description: description,
                    price: price,
                    imageLinks: adImages,
                    contactInfo: contactInfo,
                    neighborhood: neighborhood
                });
            } else {
                console.error(`Erro ao pegar detalhes de anúncio em ${item.link}: Status ${response.status}`);
            }
        } catch (error) {
            console.error(`Erro ao pegar detalhes de anúncio em ${item.link}: ${error}`);
        }
    }
    return itemsWithDetails;
}

module.exports = {
    getAdLinks,
    getAdDetails
};
