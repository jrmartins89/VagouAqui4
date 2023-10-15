const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
    houseOrApartment: {
        type: String,
        enum: ["casa", "apartamento"],
        default: "apartamento"
    },
    genderPreference: {
        type: String,
        enum: ["masculino", "feminino", "tanto faz","ambos"],
        default: "ambos"
    },
    acceptsPets: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        default: ""
    },
    roommates: {
        type: String,
        enum: ["sozinho", "compartilhado"],
        default: "sozinho"
    },
    leaseLength: {
        type: String,
        enum: ["aluguel anual", "aluguel mensal"],
    },
    budget: {
        type: String,
        default: ""
    },
    wheelchairAccessible: {
        type: Boolean,
        default: false
    },
    noiseLevel: {
        type: String,
        enum: ["tranquilo", "barulhento"],
        default: "tranquilo"
    },
    acceptSmoker: {
        type: Boolean,
        default: false
    },
    // Add more preference fields as needed
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