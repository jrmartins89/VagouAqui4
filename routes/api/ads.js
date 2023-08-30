const express = require("express");
const router = express.Router();
const Ad = require("../../models/Ads");

// @route GET api/ads
// @desc Retrieve all ads
// @access Public
router.get("/", (req, res) => {
    Ad.find()
        .then(ads => res.json(ads))
        .catch(err => res.status(500).json({ error: "Error retrieving ads" }));
});

module.exports = router;
