// adsSchema.js
const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;