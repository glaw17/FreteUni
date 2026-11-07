const express = require("express");

const router = express.Router();

router.get("/fretes/novo", (request, response) => {
  // TODO: mostrar o formulário de contratação.
  response.status(501).send("Página de contratação de frete em desenvolvimento.");
});

router.post("/fretes/simular", (request, response) => {
  // TODO: calcular a estimativa antes de confirmar a contratação.
  response.status(501).send("Simulação de frete ainda não implementada.");
});

router.post("/fretes", (request, response) => {
  // TODO: salvar a contratação e redirecionar para /fretes/:id.
  response.status(501).send("Contratação de frete ainda não implementada.");
});

router.get("/fretes/:id", (request, response) => {
  // TODO: buscar o frete usando request.params.id e mostrar os detalhes.
  response.status(501).send("Página de detalhes do frete em desenvolvimento.");
});

router.get("/rastrear", (request, response) => {
  // TODO: consultar o código recebido em request.query.id.
  response.status(501).send("Rastreamento ainda não implementado.");
});

module.exports = router;
