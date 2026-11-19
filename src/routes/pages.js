const express = require("express");
const { getUserById } = require("../controller/UserController");

const router = express.Router();

router.get("/", async (request, response) => {
  const user = await getUserById(request.session.userId);
  response.render("pages/home/index", {
    title: "FreteUni | Sua solução de frete inteligente",
    user: user || null
  });
});

router.get("/termos", async (request, response) => {
  const user = await getUserById(request.session.userId);
  response.render("pages/terms/terms", {
    title: "FreteUni | Termos de Uso",
    user: user || null
  });
});
  
router.get("/easter-egg", async (request, response) => {
  const user = await getUserById(request.session.userId);

  response.render("pages/easter-egg/easter_egg", {
  title: "FreteUni | Easter egg",
  user: user || null
});
});

module.exports = router;