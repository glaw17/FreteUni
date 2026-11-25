const express = require("express");
const { getDistance } = require("geolib");
const router = express.Router();

router.get("/fretes/novo", (request, response) => {
  // TODO: mostrar o formulário de contratação.
  response
    .status(501)
    .send("Página de contratação de frete em desenvolvimento.");
});

const CEP_REGEX = /^\d{8}$/;
const BRASIL_API_TIMEOUT = 5000;

function erroSimulacao(status, errtype, message) {
  const error = new Error(message);
  error.status = status;
  error.errtype = errtype;
  return error;
}

function coordenadaValida(valor, limite) {
  if (typeof valor !== "number" && typeof valor !== "string") {
    return false;
  }
  if (typeof valor === "string" && valor.trim() === "") {
    return false;
  }
  const numero = Number(valor);
  return Number.isFinite(numero) && Math.abs(numero) <= limite;
}

async function buscarCoordenadas(cep, tipo) {
  try {
    const resposta = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`, {
      signal: AbortSignal.timeout(BRASIL_API_TIMEOUT),
    });

    if (resposta.status === 404) {
      throw erroSimulacao(
        400,
        "cep_not_found",
        `CEP de ${tipo} não encontrado.`,
      );
    }
    if (!resposta.ok) {
      throw erroSimulacao(
        502,
        "cep_provider_error",
        "Não foi possível consultar os CEPs no momento.",
      );
    }

    const dados = await resposta.json();
    const coordenadas = dados?.location?.coordinates;
    if (
      !coordenadaValida(coordenadas?.latitude, 90) ||
      !coordenadaValida(coordenadas?.longitude, 180)
    ) {
      throw erroSimulacao(
        422,
        "coordinates_unavailable",
        `Coordenadas indisponíveis para o CEP de ${tipo}.`,
      );
    }

    return {
      latitude: Number(coordenadas.latitude),
      longitude: Number(coordenadas.longitude),
    };
  } catch (error) {
    if (error.errtype) {
      throw error;
    }
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw erroSimulacao(
        504,
        "cep_timeout",
        "A consulta de CEP demorou demais. Tente novamente.",
      );
    }
    throw erroSimulacao(
      502,
      "cep_provider_error",
      "Não foi possível consultar os CEPs no momento.",
    );
  }
}

router.post("/fretes/simular", async (request, response) => {
  const body = request.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_request",
      message: "Informe os CEPs de origem e destino.",
    });
  }

  const { cepOrigem, cepDestino, ajudantes = 0 } = body;
  if (
    typeof cepOrigem !== "string" ||
    cepOrigem.length !== 8 ||
    !CEP_REGEX.test(cepOrigem) ||
    typeof cepDestino !== "string" ||
    cepDestino.length !== 8 ||
    !CEP_REGEX.test(cepDestino)
  ) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_cep",
      message: "Os CEPs de origem e destino devem ter exatamente 8 dígitos.",
    });
  }
  if (!Number.isInteger(ajudantes) || ajudantes < 0 || ajudantes > 2) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_helpers",
      message: "Selecione de 0 a 2 ajudantes.",
    });
  }

  try {
    // A segunda consulta só é feita se a primeira tiver sido bem-sucedida.
    const coordenadasOrigem = await buscarCoordenadas(cepOrigem, "origem");
    const coordenadasDestino = await buscarCoordenadas(cepDestino, "destino");

    // Distância geográfica em quilômetros, não distância por rodovia.
    const distancia = getDistance(coordenadasOrigem, coordenadasDestino) / 1000;
    if (!Number.isFinite(distancia) || distancia < 0) {
      throw new Error("Distância inválida");
    }

    const preco = (180 + distancia * 4.5 + ajudantes * 60).toFixed(2);
    return response.json({ distancia, preco });
  } catch (error) {
    const status = error.status || 500;
    const errtype = error.errtype || "simulation_failed";
    if (status >= 500) {
      console.error("[simulador]", errtype);
    }
    return response.status(status).json({
      status: "error",
      errtype,
      message: error.errtype
        ? error.message
        : "Não foi possível calcular o frete. Tente novamente.",
    });
  }
});

module.exports = router;
