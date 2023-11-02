const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const schedule = require("node-schedule");
const adsRouter = require("./routes/api/ads");
const recommendationsRouter = require("./routes/api/recommendation");
const adsController = require("./controller/adsController");
const usersRouter = require("./routes/api/users");
const Ad = require("./models/Ads");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
require("./config/passport")(passport);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize()); // Passport middleware
app.use("/api/users", usersRouter); // User route
app.use("/api/ads", adsRouter); // Ad route
app.use("/api/recommendation", recommendationsRouter); // Recommendation route

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conexão bem sucedida com o MongoDB");
        // Start the Express server
        app.listen(port, () => {
            console.log(`O servidor está rodando na porta: ${port}!`);
            // After the server is started, perform other actions
            initializeServerActions();
        });
    })
    .catch((error) => {
        console.error("Erro de conexão com o banco de dados:", error);
    });

// Schedule the task to run every Sunday at 11:00 p.m. (Brasilia time)
function scheduleScrapingTask() {
    schedule.scheduleJob("0 23 * * 0", async function () {
        try {
            // Remove existing ads from the 'ads' collection
            await Ad.deleteMany({});
            console.log("Base atual de anúncios foi excluída com sucesso.");

            // Start the scraping process
            await adsController.startScraping();
        } catch (error) {
            console.error("Erro durante o processo de scraping:", error);
        }
    });
}

// Function to perform other actions after the server is started
async function initializeServerActions() {
    try {
        // Check if there are any ads saved in the database
        const existingAdsCount = await Ad.countDocuments();

        if (+existingAdsCount === 0) {
            // If no ads are saved, start the initial scraping process
            console.log("Nenhum anúncio encontrado no banco de dados. Iniciando o processo inicial de scraping.");
            await adsController.startScraping();
        } else {
            // If there are ads in the database, follow the scheduled scraping task
            console.log("Foram encontrados anúncios no banco de dados. Seguindo a programação do processo de scraping.");
            scheduleScrapingTask();
        }
    } catch (error) {
        console.error("Erro durante a verificação de anúncios existentes:", error);
    }
}
