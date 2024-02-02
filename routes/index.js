const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const customers = await db.findCustomers();
    //console.log(customers);
    res.render('index', {title: 'Express', customers});
  } catch (error) {
    console.error(error);
    res.render("error", {message: "Não foi possível listar os clientes", error})
    //res.status(500).send('Erro ao buscar clientes', error);
  }
  });

  router.get('/new', (request, response) => {
  response.render("customer", {title: "Cadastro de Clientes", customer: {}});
  });

  router.get('/edit/:customerId', (request, response) => {
      const id = request.params.customerId;
      db.findCustomer(id)
      .then(customer => response.render("customer", {title: "Edição de Cadastros", customer}))
      .catch(error => {
        console.log(error)
        res.render("error", {message: "Não foi possível retornar os dados dos clientes", error})
      });
  });

  router.get('/delete/:customerId', (request, response) => {
      const id = request.params.customerId;
      db.deleteCustomer(id)
      .then(result => response.redirect("/"))
      .catch(error => {
        console.log(error)
        res.render("error", {message: "Não foi possível excluir o cliente", error})
      });
  })
  
  router.post('/new', (request, response) => {
    if (!request.body.nome) {
        return response.redirect("/new?error=O campo nome é obrigatório");
    }

    if (request.body.idade !== undefined && (isNaN(request.body.idade) || request.body.idade.trim() === "")) {
        return response.redirect("/new?error=O campo idade deve ser numérico");
    }

    const id = request.body.id;
    const nome = request.body.nome;
    const idade = request.body.idade !== undefined ? parseInt(request.body.idade) : null;
    const cidade = request.body.cidade;
    const uf = request.body.uf && request.body.uf.length > 2 ? '' : request.body.uf;

    const customer = { nome, idade, cidade, uf };
    const promise = id ? db.updateCustomer(id, customer)
                      : db.insertCustomer(customer);

   promise
        .then(_result => {
            response.redirect("/");
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


// router.post('/new', (request, response) => {
  //   if(!request.body.nome) 
  //   return response.redirect("/new?error=O campo nome é obrigatório")
    
  //   if(request.body.idade && /[0-9]+/.test(request.body.idade))
  //   return response.redirect("/new?error=O campo idade é numérico")

  //   const nome = request.body.nome;
  //   const idade = parseInt(request.body.idade);
  //   const cidade = request.body.cidade;

  //   const uf = request.body.uf.length > 2 ? '' : request.body.uf;
    
  //   db.insertCustomer({ nome, idade, cidade, uf })
  //   .then(_result => {
  //     response.redirect("/")
  //   })
  //   .catch(error => {
  //     return console.log(error);
  //   });
  // });

