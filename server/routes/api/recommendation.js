const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User"); // Carrega o modelo User
const generateRecommendations = require('../../recommendations/adRecommendation'); // Importa a função para gerar recomendações com base nas preferências do usuário

// Rota para obter recomendações baseadas em conteúdo para um usuário
router.get('/all', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        // Busca as preferências do usuário
        const user = await User.findById(userId);
        const userPreferences = user.preferences;
        // Gera recomendações com base nas preferências do usuário
        const recommendations = await generateRecommendations(userPreferences);

        res.json(recommendations);
    } catch (error) {
        console.error("Erro ao gerar os anúncios recomendados baseados em conteúdo:", error);
        res.status(500).json({ message: 'Erro ao listar as recomendações', error: error.message });
    }
});

module.exports = router;
