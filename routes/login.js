const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render("login", { title: "Login!" })
});

module.exports = router;