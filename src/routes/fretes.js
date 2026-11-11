const express = require("express");
const ceputils = require('ceputils');
const router = express.Router();

router.get("/fretes/novo", (request, response) => {
  // TODO: mostrar o formulário de contratação.
  response.status(501).send("Página de contratação de frete em desenvolvimento.");
});

router.post("/fretes/simular", async (request, response) => {
  // TODO: calcular a estimativa antes de confirmar a contratação.
  const { cepOrigem, cepDestino } = request.body;

  if (!cepOrigem || !cepDestino) {
    return response.status(400).send("Cep de origem e destino são obrigatórios.");
  }
  if (cepOrigem.length !== 8 || cepDestino.length !== 8) {
    return response.status(400).send("Cep de origem e destino devem ter 8 dígitos.");
  }

  try {
    const distancia = await ceputils.calculateDistance(cepOrigem, cepDestino);
    
    valorFrete = distancia * 4;
    return response.status(200).json({
      valorFrete: valorFrete.tofixed(2),
      distancia: distancia.tofixed(2)
    })
  } catch (error) {
    console.error("Erro ao calcular a distância:", error);
    return response.status(500).send("Erro ao calcular a distância.");
  }

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