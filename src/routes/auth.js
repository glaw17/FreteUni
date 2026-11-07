const express = require("express");

const router = express.Router();

router.get("/login", (request, response) => {
  // TODO: mostrar login.ejs.
  response.status(501).send("Página de login em desenvolvimento.");
});

router.post("/login", (request, response) => {
  // TODO: conferir os dados e iniciar a sessão.
  response.status(501).send("Login ainda não implementado.");
});

router.get("/register", (request, response) => {
  // TODO: mostrar register.ejs com os campos de cliente ou motorista.
  response.status(501).send("Página de cadastro em desenvolvimento.");
});

router.post("/register", (request, response) => {
  // TODO: validar e salvar o cadastro conforme o tipo de conta.
  response.status(501).send("Cadastro ainda não implementado.");
});

router.post("/logout", (request, response) => {
  // TODO: encerrar a sessão e redirecionar para o início.
  response.status(501).send("Saída da conta ainda não implementada.");
});

module.exports = router;
