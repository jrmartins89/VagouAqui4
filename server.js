const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
require('dotenv').config(); // Load environment variables from .env file

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado com sucesso ao MongoDB');
    })
    .catch(error => {
        console.error('Erro de conexão com o banco de dados:', error);
    });


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

app.listen(port, () => console.log(`O Servidor está rodando na porta ${port} !`));