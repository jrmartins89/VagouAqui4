const Ad = require('../models/Ads');

// Função para buscar anúncios no banco de dados e gerar recomendações
async function generateRecommendations(userPreferences) {
    try {
        // Busca todos os anúncios no banco de dados
        const ads = await Ad.find({});
        let sampleSize; // Tamanho padrão da amostra

        const totalAds = ads.length;

        // Ajusta o tamanho da amostra com base em vários fatores
        if (totalAds <= 50) {
            sampleSize = totalAds; // Usa todos os anúncios se houver muito poucos.
        } else if (totalAds <= 500) {
            sampleSize = 100; // Limita o tamanho da amostra se houver entre 6 e 10 anúncios.
        } else if (totalAds <= 1000) {
            sampleSize = 250; // Um tamanho de amostra maior para conteúdo mais diversificado.
        } else {
            sampleSize = 300; // Para bancos de dados maiores, um tamanho de amostra razoável.
        }
        // Inicializa uma matriz para armazenar anúncios recomendados
        const recommendations = [];

        // Analisa a preferência de orçamento do usuário
        const userBudget = parseFloat(userPreferences.budget);

        // Percorre os anúncios e calcula uma pontuação para cada anúncio com base nas preferências do usuário
        ads.forEach((ad) => {
            // Extrai informações de orçamento da descrição do anúncio e converte para um valor numérico
            const adBudgetMatch = ad.description.match(/\bR\$\s?\d{3,}(?:,\d{1,2})?|\$\s?\d{3,}(?:,\d{1,2})?|\d{3,}(?:,\d{1,2})?\b/);
            const adBudget = adBudgetMatch ? parseFloat(adBudgetMatch[0].replace(/[^\d.]/g, '')) : null;

            if (adBudget === null || adBudget <= userBudget) {
                // Extrai outras características do anúncio
                const adFeatures = {
                    houseOrApartment: ad.description.match(/casa|apartamento/i),
                    genderPreference: ad.description.match(/homem|mulher|masculino|feminino|masculina|feminina/i),
                    acceptsPets: ad.description.match(/aceita pets|pets permitidos/i),
                    location: ad.neighborhood,
                    roommates: ad.description.match(/alugo quarto|aluga-se quarto|quarto disponível|quarto compartilhado/i),
                    leaseLength: ad.description.match(/aluguel anual|aluguel mensal|alugo mensal|alugo anual|aluguel temporada/i),
                    wheelchairAccessible: ad.description.match(/acessível a cadeirantes|acesso à cadeirantes|acesso à cadeira de rodas/i),
                    noiseLevel: ad.description.match(/tranquilo|barulhento|local tranquilo|local perto do centro/i),
                    acceptSmoker: ad.description.match(/aceita fumante|fumante permitido/i),
                    hasFurniture: ad.description.match(/mobiliado|tem mobilia|possui móveis|possui moveis|tem algumas mobilias|mobilia inclusa/i)
                };

                // Calcula uma pontuação para o anúncio com base nas preferências do usuário
                let score = 0;

                for (const feature in adFeatures) {
                    if (userPreferences[feature] && adFeatures[feature]) {
                        score++;
                    }
                }

                // Adiciona o anúncio e sua pontuação às recomendações
                recommendations.push({
                    ad,
                    score,
                });
            }
        });

        // Ordena as recomendações por pontuação em ordem decrescente
        recommendations.sort((a, b) => b.score - a.score);

        // Retorna os anúncios recomendados como um objeto JSON
        return recommendations.slice(0, sampleSize);
    } catch (error) {
        console.error('Erro ao listar anúncios ou gerar recomendações:', error);
        return [];
    }
}

module.exports = generateRecommendations;
