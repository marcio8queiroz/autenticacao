const express = require('express');
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const auth = require("../auth");


/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render("login", { title: "Login", message: "" });
});

router.get('/forgot', function(req, res, next) {
    res.render("forgot", { title: "Recuperação de Senha", message: "" });
});

router.post('/forgot', async(req, res, next) => {
    const email = req.body.email;
    if (!email)
        return res.render("forgot", { title: "Recuperação de Senha", message: "O email é obrigatório" });

    const user = await auth.findUserByEmail(email);
    if (!user)
        return res.render("forgot", { title: "Recuperação de Senha", message: "O email não está cadastrado" });

    const newPassword = auth.generatePassword();
    user.password = newPassword;

    await db.updateUser(user._id.toString(), user);

    res.render("forgot", { title: "Recuperação de Senha", message: newPassword });
});

router.post("/login", async(req, res, next) => {
    const name = req.body.name;
    const user = await auth.findUserByName(name);
    if (!user) return res.render("login", { title: "Login", message: "Usuário ou senha inválidos" });

    const password = req.body.password;
    if (!bcrypt.compareSync(password, user.password)) return res.render("login", { title: "Login", message: "Usuário ou senha inválidos" });

    res.redirect("/index");
})

module.exports = router;