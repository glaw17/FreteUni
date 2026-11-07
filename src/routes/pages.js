const express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
  response.render("index", {
    title: "FreteUni | Sua solução de frete inteligente"
  });
});

module.exports = router;
