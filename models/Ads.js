const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String,
    price: String,
    thumbnail: String
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
