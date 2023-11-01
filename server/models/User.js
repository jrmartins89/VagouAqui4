const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
    houseOrApartment: {
        type: String,
        enum: ["casa", "apartamento"]
    },
    genderPreference: {
        type: String,
        enum: ["masculino", "feminino", "tanto faz","ambos"]
    },
    acceptsPets: {
        type: Boolean
    },
    location: {
        type: String
    },
    roommates: {
        type: String,
        enum: ["sozinho", "compartilhado"]
    },
    leaseLength: {
        type: String,
        enum: ["aluguel anual", "aluguel temporada"]
    },
    budget: {
        type: String
    },
    wheelchairAccessible: {
        type: Boolean
    },
    noiseLevel: {
        type: String,
        enum: ["tranquilo", "barulhento"]
    },
    acceptSmoker: {
        type: Boolean
    },
    hasFurniture: {
        type: Boolean
    },
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    preferences: PreferencesSchema // Embed the preferences schema
});

module.exports = User = mongoose.model("users", UserSchema);