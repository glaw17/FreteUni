const express = require("express");
const { getDistance } = require('geolib');
const router = express.Router();

router.get("/fretes/novo", (request, response) => {
  // TODO: mostrar o formulário de contratação.
  response.status(501).send("Página de contratação de frete em desenvolvimento.");
});

router.post("/fretes/simular", async (request, response) => {
  //Debug do Envio
  console.log("Envio Chegou na Rota");

  // Verificação da Entrada
  const { cepOrigem, cepDestino } = request.body;

  if (!cepOrigem || !cepDestino) {
    return alert("Cep de origem e destino são obrigatórios.");
  }
  if (cepOrigem.length !== 8 || cepDestino.length !== 8) {
   return response.status(400).send("Cep de origem e destino devem ter 8 dígitos.");
  }
  
  // Função para buscar coordenadas de um CEP usando a GeoLib
  const buscarCoordenadas = async (cep) => {
    const response = await fetch(
        `https://brasilapi.com.br/api/cep/v2/${cep}`
    );

    //Pegando todas as informações do cep dada pela API BrasilAPI e guardando na variável infoDoCep
    const infoDoCep = await response.json();
    console.log(`Informações do CEP ${cep}: ${JSON.stringify(infoDoCep)}`);

    //Pegando somente as coordenadas do cep e guardando na variável cords
    const cords = infoDoCep.location?.coordinates;

    //Vendo se alguma retornou uma valor nulo ou vazio, caso sim, lançando um erro
    if (cords?.latitude == null || cords?.longitude == null ||
    cords.latitude === '' || cords.longitude === '') {
      return console.error(`Coordenadas indisponíveis: ${cep}`);
    }

    return {
      latitude: Number(cords.latitude),
      longitude: Number(cords.longitude)
    };
  }
  
  const coordenadasOrigem = await buscarCoordenadas(cepOrigem);
  const coordenadasDestino = await buscarCoordenadas(cepDestino);

  console.log(`Coordenadas Origem: ${JSON.stringify(coordenadasOrigem)}`);
  console.log(`Coordenadas Destino: ${JSON.stringify(coordenadasDestino)}`);

  const distancia = getDistance(
    coordenadasOrigem,
    coordenadasDestino
  )/1000; // Convertendo de metros para quilômetros

  const preco = (180 + (distancia * 4.5)).toFixed(2);
  console.log(`Distância: ${distancia} km, Preço: R$ ${preco}`);

  //Retornando Valores
  return response.json({ distancia, preco });

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