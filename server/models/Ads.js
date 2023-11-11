const mongoose = require('mongoose');

// Definição do esquema para anúncios
const adSchema = new mongoose.Schema({
    title: String, // Título do anúncio
    link: String, // Link relacionado ao anúncio
    description: String, // Descrição do anúncio
    price: String, // Preço do anúncio
    imageLinks: Array, // Array de links para imagens relacionadas ao anúncio
    neighborhood: String, // Bairro do anúncio
    contactInfo: Array, // Array de informações de contato relacionadas ao anúncio
    source: String // Fonte do anúncio
});

// Modelo para a coleção de anúncios
const Ad = mongoose.model('Ad', adSchema);

// Exporta o modelo de anúncio
module.exports = Ad;
