const express = require("express");
const { getUserById } = require("../controller/UserController");
const { route } = require("./auth");

const router = express.Router();

router.get("/", (request, response) => {
  const user = getUserById(request.session.userId);
  response.render("pages/home/index", {
    title: "FreteUni | Sua solução de frete inteligente",
    user: user || null
  });
});

router.get("/termos", (request, response) => {
  response.render("pages/terms/index", {
    title: "FreteUni | Termos de Uso"
  });
});

router.get("/contract", (request, response) => {
  const user = getUserById(request.session.userId);
  response.render("pages/contract/index", {
    title: "Frete Uni | Contrate Seu Frete",
    user: user || null
  });
});

module.exports = router;
  