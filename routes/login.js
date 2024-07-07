const express = require('express');
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const sendMail = require("../mail");

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

    try {
        await db.updateUser(user._id.toString(), user);
        await sendMail(user.email, "Senha alterada com sucesso", `
        Olá ${user.name}!
        Sua senha foi alterada com sucesso para ${newPassword}

        Use-a para se autenticar novamente em http://localhost:3000/

        Att.

        Admin
    `);

        res.render("login", { title: "Login", message: "Verifique sua caixa de email para pegar a nova senha." });
    } catch (err) {
        res.render("forgot", { title: "Recuperação de Senha", message: err.message });
    }
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