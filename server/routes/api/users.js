const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const User = require("../../models/User"); // Carrega o modelo User
const validateRegisterInput = require("../../validation/register"); // Carrega a validação de entrada para registro
const validateLoginInput = require("../../validation/login");

// Rota POST para registro de usuário
router.post("/register", (req, res) => {
    // Validação do formulário
    const { errors, isValid } = validateRegisterInput(req.body);

    // Verifica a validação
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "O email já existe" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                preferences: {
                    houseOrApartment: req.body.preferences.houseOrApartment,
                    genderPreference: req.body.preferences.genderPreference,
                    acceptsPets: req.body.preferences.acceptsPets,
                    location: req.body.preferences.location,
                    roommates: req.body.preferences.roommates,
                    leaseLength: req.body.preferences.leaseLength,
                    budget: req.body.preferences.budget,
                    wheelchairAccessible: req.body.preferences.wheelchairAccessible,
                    noiseLevel: req.body.preferences.noiseLevel,
                    acceptSmoker: req.body.preferences.acceptSmoker,
                    hasFurniture: req.body.preferences.hasFurniture
                }
            });

            // Hash da senha antes de salvar no banco de dados
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// Rota POST para login de usuário e retorno do token JWT
router.post("/login", (req, res) => {
    // Validação do formulário
    const { errors, isValid } = validateLoginInput(req.body);

    // Verifica a validação
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Encontrar usuário por email
    User.findOne({ email }).then(user => {
        // Verifica se o usuário existe
        if (!user) {
            return res.status(404).json({ emailnotfound: "O email não foi encontrado" });
        }

        // Verifica a senha
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // Usuário correspondido
                // Criação do Payload JWT
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // Assina o token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 ano em segundos
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "A senha está incorreta" });
            }
        });
    });
});

// Rota PUT para atualizar as preferências do usuário
router.put("/preferences", passport.authenticate("jwt", { session: false }), (req, res) => {
    // O usuário está autenticado, prossegue com a atualização de preferências
    const updatedPreferences = req.body;

    // Atualiza as preferências do usuário no banco de dados
    User.findOneAndUpdate(
        { _id: req.user.id }, // ID do usuário proveniente do payload do JWT
        { $set: { "preferences": updatedPreferences } }, // Especifica o campo "preferences"
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ userNotFound: "Usuário não encontrado" });
            }
            res.json(updatedUser.preferences); // Responde com as preferências atualizadas
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

// Rota GET para obter as preferências do usuário
router.get("/preferences", passport.authenticate("jwt", { session: false }), (req, res) => {
    // O usuário está autenticado, recupera suas preferências
    User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ userNotFound: "Usuário não encontrado" });
            }
            res.json(user.preferences); // Responde com as preferências do usuário
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

// Rota GET para obter as informações do usuário atual
router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    // O usuário está autenticado, recupera suas informações
    User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ userNotFound: "Usuário não encontrado" });
            }
            res.json(user); // Responde com as informações do usuário
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

// Rota DELETE para excluir a conta do usuário
router.delete("/delete", passport.authenticate("jwt", { session: false }), (req, res) => {
    // O usuário está autenticado, prossegue com a exclusão da conta
    User.findByIdAndRemove(req.user.id)
        .then(() => {
            res.json({ success: true, message: "Conta de usuário excluída com sucesso" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

module.exports = router;
