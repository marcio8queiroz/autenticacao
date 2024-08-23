const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render("index", { title: "Bem vindo!", userProfile: parseInt(req.user.profile) })
});

module.exports = router;