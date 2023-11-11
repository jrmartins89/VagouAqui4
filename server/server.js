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
app.use(passport.initialize()); // Middleware do Passport
app.use("/api/users", usersRouter); // Rota de Usuários
app.use("/api/ads", adsRouter); // Rota de Anúncios
app.use("/api/recommendation", recommendationsRouter); // Rota de Recomendações

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conexão bem sucedida com o MongoDB");
        // Inicia o servidor Express
        app.listen(port, () => {
            console.log(`O servidor está rodando na porta: ${port}!`);
            // Após o servidor ser iniciado, realiza outras ações
            initializeServerActions();
        });
    })
    .catch((error) => {
        console.error("Erro de conexão com o banco de dados:", error);
    });

// Agenda a tarefa para ser executada todo domingo às 23:00 (horário de Brasília)
function scheduleScrapingTask() {
    schedule.scheduleJob("0 23 * * 0", async function () {
        try {
            // Remove anúncios existentes da coleção 'ads'
            await Ad.deleteMany({});
            console.log("Base atual de anúncios foi excluída com sucesso.");

            // Inicia o processo de scraping
            await adsController.startScraping();
        } catch (error) {
            console.error("Erro durante o processo de scraping:", error);
        }
    });
}

// Função para realizar outras ações após o servidor ser iniciado
async function initializeServerActions() {
    try {
        // Verifica se existem anúncios salvos no banco de dados
        const existingAdsCount = await Ad.countDocuments();

        if (+existingAdsCount === 0) {
            // Se não houver anúncios salvos, inicia o processo inicial de scraping
            console.log("Nenhum anúncio encontrado no banco de dados. Iniciando o processo inicial de scraping.");
            await adsController.startScraping();
        } else {
            // Se existirem anúncios no banco de dados, segue a tarefa agendada de scraping
            console.log("Foram encontrados anúncios no banco de dados. Seguindo a programação do processo de scraping.");
            scheduleScrapingTask();
        }
    } catch (error) {
        console.error("Erro durante a verificação de anúncios existentes:", error);
    }
}
