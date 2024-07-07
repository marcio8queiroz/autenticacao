const express = require('express');
const router = express.Router();
const db = require("../db");
const sendMail = require("../mail");

/* GET home page. */

router.get('/new', (request, response) => {
    response.render("newUser", { title: "Cadastro de Usuário", user: {} });
});

router.get('/edit/:userId', (request, response) => {
    const id = request.params.userId;
    db.findUser(id)
        .then(user => response.render("newUser", { title: "Edição de Usuário", user })) //user é model
        .catch(error => {
            console.log(error)
            response.render("error", { message: "Não foi possível retornar os dados do usuário", error })
        });
});

router.get('/delete/:userId', (request, response) => {
    const id = request.params.userId;
    db.deleteUser(id)
        .then(result => response.redirect("/users"))
        .catch(error => {
            console.log(error)
            response.render("error", { message: "Não foi possível excluir o usuario", error })
        });
})

router.post('/new', async(request, response) => {
    const id = request.body.id;

    if (!id && !request.body.name) {
        return response.redirect("/users/new?error=O campo nome é obrigatório");
    }

    if (!request.body.password)
        return response.redirect("/users/new?error=O campo senha é obrigatório");

    const name = request.body.name;
    const email = request.body.email;
    const user = { name, email };

    if (request.body.password)
        user.password = request.body.password;

    try {
        if (id) {
            await db.updateUser(id, user);
        } else {
            await db.insertUser(user);
        }

        await sendMail(user.email, "Usuário criado com sucesso", `
        Olá ${user.name}!
        Seu usuário foi criado com sucesso!

        Use sua senha para se autenticar em http://localhost:3000/

        Att.

        Admin
    `);

        response.redirect("/");
    } catch (error) {
        console.error(error);
        response.redirect("/users/new?error=" + error.message);
    }
})

router.get('/:page?', async(req, res, next) => {
    const page = parseInt(req.params.page) || 1;

    try {
        const qty = await db.countUsers();
        const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
        const users = await db.findUsers(page);
        res.render('users', { title: 'Usuários', users, qty, pagesQty, page });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Não foi possível listar os usuários", error })
    }
});


module.exports = router;