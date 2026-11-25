const express = require("express");
const { getConnection } = require("../database/database");
const router = express.Router();

router.post("/avaliacoes", async (request, response) => {
  let rating = request.body?.rating;
  if (typeof rating === "string" && /^(?:[0-9]|10)$/.test(rating)) {
    rating = Number(rating);
  }

  if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
    return response.status(400).json({
      status: "error",
      message: "Escolha uma nota de 0 a 10.",
    });
  }

  const connection = await getConnection();
  await connection("reviews").insert({ rating });
  return response.status(201).json({ status: "success" });
});

module.exports = router;
