const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const scraper = require("./scrapers/classificadosUfscScraper");
const Ad = require("./models/Ads");
require("dotenv").config();
require("./config/passport")(passport);
const urls = [
    "https://classificados.inf.ufsc.br/index.php?catid=88", // carvoeira
    "https://classificados.inf.ufsc.br/index.php?catid=91", // corrego grande
    "https://classificados.inf.ufsc.br/index.php?catid=89", // serrinha
    "https://classificados.inf.ufsc.br/index.php?catid=94", // outros bairros
    "https://classificados.inf.ufsc.br/index.php?catid=197", // centro
    "https://classificados.inf.ufsc.br/index.php?catid=90", // itacorubi
    "https://classificados.inf.ufsc.br/index.php?catid=96", // saco dos limoes
    "https://classificados.inf.ufsc.br/index.php?catid=86" // trindade
];
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado com sucesso ao MongoDB');
        startScraping(); // Start scraping after successful MongoDB connection
    })
    .catch(error => {
        console.error('Erro de conexão com o banco de dados:', error);
    });


// Passport middleware
app.use(passport.initialize());
// Routes
app.use("/api/users", users);

// Start scraping function
async function startScraping() {
    try {
        for (const url of urls) {
            const adItems = await scraper.getAdLinks(url);
            const existingAds = await Ad.find({}, "link");

            const newAdItems = adItems.filter(
                (item) => !existingAds.some((existingAd) => existingAd.link === item.link)
            );

            if (newAdItems.length > 0) {
                const itemsWithDetails = await scraper.getAdDetails(newAdItems);

                const finalItems = itemsWithDetails.map((item) => ({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    price: item.price,
                    imageLinks: item.imageLinks,
                }));

                await Ad.insertMany(finalItems);
                console.log(`Scraped data from ${url} has been saved to MongoDB collection "ads"`);
            } else {
                console.log(`No new ads to save from ${url}`);
            }
        }
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}
app.listen(port, () => console.log(`O Servidor está rodando na porta ${port} !`));