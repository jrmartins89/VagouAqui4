const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definição do esquema de preferências do usuário
const PreferencesSchema = new Schema({
    houseOrApartment: {
        type: String,
        enum: ["casa", "apartamento"] // Opções válidas: casa ou apartamento
    },
    genderPreference: {
        type: String,
        enum: ["masculino", "feminino", "tanto faz", "ambos"] // Opções válidas: masculino, feminino, tanto faz, ambos
    },
    acceptsPets: {
        type: Boolean // Aceita animais de estimação (true/false)
    },
    location: {
        type: String // Localização preferida
    },
    roommates: {
        type: String,
        enum: ["sozinho", "compartilhado"] // Opções válidas: sozinho ou compartilhado
    },
    leaseLength: {
        type: String,
        enum: ["aluguel anual", "aluguel temporada"] // Opções válidas: aluguel anual ou aluguel temporada
    },
    budget: {
        type: String // Orçamento desejado
    },
    wheelchairAccessible: {
        type: Boolean // Acessível a cadeirantes (true/false)
    },
    noiseLevel: {
        type: String,
        enum: ["tranquilo", "barulhento"] // Opções válidas: tranquilo ou barulhento
    },
    acceptSmoker: {
        type: Boolean // Aceita fumante (true/false)
    },
    hasFurniture: {
        type: Boolean // Possui mobília (true/false)
    },
});

// Definição do esquema de usuário, que inclui as preferências
const UserSchema = new Schema({
    name: {
        type: String,
        required: true // Nome do usuário (obrigatório)
    },
    email: {
        type: String,
        required: true // Endereço de e-mail do usuário (obrigatório)
    },
    password: {
        type: String,
        required: true // Senha do usuário (obrigatório)
    },
    date: {
        type: Date,
        default: Date.now // Data de criação do usuário (padrão: data atual)
    },
    preferences: PreferencesSchema // Incorpora o esquema de preferências ao esquema de usuário
});

// Exporta o modelo de usuário
module.exports = User = mongoose.model("users", UserSchema);
