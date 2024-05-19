const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const customers = await db.findCustomers();
        //console.log(customers);
        res.render('customers', { title: 'Clientes', customers, qty: customers.length });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Não foi possível listar os clientes", error })
            //res.status(500).send('Erro ao buscar clientes', error);
    }
});

router.get('/new', (request, response) => {
    response.render("newCustomer", { title: "Cadastro de Clientes", customer: {} });
});

router.get('/edit/:customerId', (request, response) => {
    const id = request.params.customerId;
    db.findCustomer(id)
        .then(customer => response.render("newCustomer", { title: "Edição de Cadastros", customer })) //customer é model
        .catch(error => {
            console.log(error)
            res.render("error", { message: "Não foi possível retornar os dados dos clientes", error })
        });
});

router.get('/delete/:customerId', (request, response) => {
    const id = request.params.customerId;
    db.deleteCustomer(id)
        .then(result => response.redirect("/customers"))
        .catch(error => {
            console.log(error)
            res.render("error", { message: "Não foi possível excluir o cliente", error })
        });
})

router.post('/new', (request, response) => {
    if (!request.body.name) {
        return response.redirect("/customers/new?error=O campo nome é obrigatório");
    }

    if (request.body.cpf !== undefined && (isNaN(request.body.cpf) || request.body.cpf.trim() === "")) {
        return response.redirect("/customers/new?error=O campo cpf deve ser numérico");
    }

    const id = request.body.id;
    const name = request.body.name;
    const cpf = request.body.cpf !== undefined ? parseInt(request.body.cpf) : null;
    const cidade = request.body.cidade;
    const uf = request.body.uf && request.body.uf.length > 2 ? '' : request.body.uf;

    const customer = { name, cpf, cidade, uf };
    const promise = id ? db.updateCustomer(id, customer) :
        db.insertCustomer(customer);

    promise
        .then(_result => {
            response.redirect("/customers");
        })
        .catch(error => {
            console.log(error);
            response.redirect("/new?error=Erro ao inserir cliente");
            // .catch(error => {
            //   console.log(error)
            //   res.render("error", {message: "Não foi possível salvar o cliente", error}) tolls
            // });
        });
});

module.exports = router;