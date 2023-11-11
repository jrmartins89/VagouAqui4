// Função para extrair informações de contato a partir da descrição do anúncio
function extractContactInfoFromDescription(description) {
    // Padrões de expressões regulares para números de telefone
    const phonePatterns = [
        /\+\d{2}\(\d{2}\)\d{5}-\d{4}/, // +xx(xx)xxxxx-xxxx
        /\+\d{2} \d{2} \d{9}/,           // +xx xx xxxxxxxxx
        /\+\d{2} \d{2} \d{4}-\d{4}/,     // +xx xx xxxx-xxxx
        /\(\+\d{2}\) \d{2} \d{9}/,       // (+xx) xx xxxxxxxxx
        /\(\d{2}\)\d{9}/,                // (xx)xxxxxxxxx
        /\(\d{2}\) \d{5}-\d{4}/,         // (xx) xxxxx-xxxx
        /\d{2} \d{5}-\d{4}/,             // xx xxxxx-xxxx
        /\d{2} \d{8}/,                   // xx xxxxxxxxx
        /\d{2}-\d{9}/,                   // xx-xxxxxxxxx
        /\d{2} \d \d{4} \d{4}/,          // xx x xxxx xxxx
        /\d{10}/,                        // xxxxxxxxxxx
        /\d{2}\.\d\.\d{4}\.\d{4}/,       // xx.x.xxxx.xxxx
        /\(\d{2}\) \d{9}/,               // (xx) xxxxxxxxx
        /\d{2} \d{3} \d{3} \d{3}/        // xx xxx xxx xxx
    ];

    const uniqueContactInfo = new Set(); // Use um Set para armazenar números de telefone únicos

    phonePatterns.forEach(pattern => {
        const matches = description.match(pattern);
        if (matches) {
            // Como queremos salvar apenas correspondências únicas, adicionamos a primeira correspondência encontrada
            uniqueContactInfo.add(matches[0]);
        }
    });

    // Converta o Set de volta para um array antes de retornar
    return Array.from(uniqueContactInfo);
}

// Função para extrair o ID do link do anúncio
function extractIdfromAdLink(adLink) {
    // Divida o adLink por "/" para extrair partes individuais
    const parts = adLink.split("/");

    // Percorra as partes para encontrar uma parte que se assemelhe a um ID
    for (const part of parts) {
        // Verifique se a parte é um ID numérico (assumindo que os IDs são numéricos)
        if (/^\d+$/.test(part)) {
            return part; // Retorna a primeira parte numérica encontrada como o ID
        }
    }

    // Se nenhum ID for encontrado, retorne null ou um valor apropriado
    return null;
}

// Função para extrair o número de telefone de um link do WhatsApp
function extractPhoneFromWhatsAppLink(link) {
    // Defina uma expressão regular para extrair o número de telefone de um link da API do WhatsApp
    const regex = /(?:\?|&)phone=(\d+)/;

    // Use a expressão regular para encontrar uma correspondência no link
    const match = link.match(regex);

    // Se houver uma correspondência, retorne o número de telefone extraído, caso contrário, retorne null
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

module.exports = {
    extractContactInfoFromDescription,
    extractIdfromAdLink,
    extractPhoneFromWhatsAppLink
};
