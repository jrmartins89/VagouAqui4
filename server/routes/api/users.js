const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const User = require("../../models/User");// Load User model
const validateRegisterInput = require("../../validation/register");// Load input validation
const validateLoginInput = require("../../validation/login");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
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
                }
            });

            // Hash password before saving in database
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

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation

    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "O email não foi encontrado" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
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


// @route PUT api/users/preferences
// @desc Update user preferences
// @access Private (requires authentication)
router.put("/preferences", passport.authenticate("jwt", { session: false }), (req, res) => {
    // User is authenticated, proceed with preference update
    const updatedPreferences = req.body;

    // Update the user's preferences in the database
    User.findOneAndUpdate(
        { _id: req.user.id }, // User ID from the JWT payload
        { $set: { "preferences": updatedPreferences } }, // Specify "preferences" field
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ userNotFound: "Usuário não encontrado" });
            }
            res.json(updatedUser.preferences); // Respond with the updated preferences
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

// @route GET api/users/preferences
// @desc Get user preferences
// @access Private (requires authentication)
router.get("/preferences", passport.authenticate("jwt", { session: false }), (req, res) => {
    // User is authenticated, retrieve their preferences
    User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ userNotFound: "Usuário não encontrado" });
            }
            res.json(user.preferences); // Respond with the user's preferences
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Erro do Servidor" });
        });
});

module.exports = router;
