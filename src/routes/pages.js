const express = require("express");
const { getUserById } = require("../controller/UserController");

const router = express.Router();

router.get("/", (request, response) => {
  const user = getUserById(request.session.userId);
  response.render("pages/home/index", {
    title: "FreteUni | Sua solução de frete inteligente",
    user: user || null
  });
});

module.exports = router;
  