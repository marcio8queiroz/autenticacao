const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render("index", { title: "Bem vindo!" })
});

module.exports = router;