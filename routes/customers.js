const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */

router.get('/new', (request, response) => {
    response.render("newCustomer", { title: "Cadastro de Clientes", customer: {} });
});

router.get('/edit/:customerId', (request, response) => {
    const id = request.params.customerId;
    db.findCustomer(id)
        .then(customer => response.render("newCustomer", { title: "Edição de Cadastros", customer })) //customer é model
        .catch(error => {
            console.log(error)
            response.render("error", { message: "Não foi possível retornar os dados dos clientes", error })
        });
});

router.get('/delete/:customerId', (request, response) => {
    const id = request.params.customerId;
    db.deleteCustomer(id)
        .then(result => response.redirect("/customers"))
        .catch(error => {
            console.log(error)
            response.render("error", { message: "Não foi possível excluir o cliente", error })
        });
})

router.post('/new', async(request, response) => {
    if (!request.body.name) {
        return response.redirect("/customers/new?error=O campo nome é obrigatório");
    }

    if (request.body.cpf && !/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(request.body.cpf)) {
        return response.redirect("/customers/new?error=O campo CPF deve ser numérico no formato xxx.xxx.xxx-xx");
    }
    // if (request.body.cpf && !/[0-9\.\-]+/.test(request.body.cpf))
    //  if (request.body.cpf !== undefined && (isNaN(request.body.cpf) || request.body.cpf.trim() === "")) {
    //     return response.redirect("/customers/new?error=O campo cpf deve ser numérico");


    const id = request.body.id;
    const name = request.body.name;
    const cpf = request.body.cpf; //!== undefined ? parseInt(request.body.cpf) : null;
    const cidade = request.body.cidade;
    const uf = request.body.uf && request.body.uf.length === 2 ? request.body.uf : '';
    // const uf = request.body.uf && request.body.uf.length > 2 ? '' : request.body.uf;

    const customer = { name, cpf, cidade, uf };

    try {
        if (id) {
            await db.updateCustomer(id, customer);
        } else {
            await db.insertCustomer(customer);
        }
        response.redirect("/customers");
    } catch (error) {
        console.log(error);
        response.redirect("/customers/new?error=Erro ao salvar cliente");
    }
});
// const customer = { name, cpf, cidade, uf };
// const promise = id ? db.updateCustomer(id, customer) :
//     db.insertCustomer(customer);

// promise
//     .then(_result => {
//         response.redirect("/customers");
//     })
//     .catch(error => {
//         console.log(error);
//         response.redirect("/new?error=Erro ao inserir cliente");

//     });

router.get('/:page?', async(req, res, next) => {
    const page = parseInt(req.params.page) || 1;

    try {
        const qty = await db.countCustomers();
        const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
        const customers = await db.findCustomers(page);
        res.render('customers', { title: 'Clientes', customers, qty, pagesQty, page });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Não foi possível listar os clientes", error })
            //res.status(500).send('Erro ao buscar clientes', error);
    }
});


module.exports = router;