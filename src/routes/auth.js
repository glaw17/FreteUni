const express = require("express");
const { getUserById, getUserByEmail, existsEmail } = require("../controller/UserController");

const router = express.Router();
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

router.get("/login", (request, response) => {
  const user = getUserById(request.session.userId);

  if (user) {
    return response.redirect("/");
  }

  response.render("pages/auth/login", {
    title: "FreteUni | Entre na sua conta",
    user: null
  });
});

router.post("/auth/login", (request, response, next) => {
  const { email, password } = request.body;

  // Simple validation (replace with actual authentication logic)
  if (!email || !password) {
    return response.status(400).json({
      status: "error",
      errtype: "missing_fields",
      message: "Email e senha são obrigatórios.",
    });
  }

  if (!regexEmail.test(email)) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_email",
      message: "Por favor, insira um email válido.",
    });
  }

  if (existsEmail(email)) {
    return response.status(400).json({
      status: "error",
      errtype: "already_registered",
      message: "O email já está registrado.",
    });
  }

  if (password.length < 8) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_password",
      message: "A senha deve ter pelo menos 8 caracteres.",
    });
  }

  const user = getUserByEmail(email);

  if (!user || password !== user.password) {
    return response.status(401).json({
      status: "error",
      errtype: "invalid_credentials",
      message: "Credenciais inválidas.",
    });
  }

  // user é o usuário encontrado no banco, com a senha já conferida.
  request.session.regenerate((error) => {
    if (error) {
      return next(error);
    }

    request.session.userId = user.id;

    request.session.save((error) => {
      if (error) {
        return next(error);
      }

      response.status(200).json({ status: "success" });
    });
  });
});

router.get("/register", (request, response) => {
  const user = getUserById(request.session.userId);

  if (user) {
    return response.redirect("/");
  }
  response.render("pages/auth/register", {
    title: "FreteUni | Crie sua conta",
    user: null
  });
});

router.post("/auth/register", (request, response) => {
  const { name, email, password } = request.body;

  response.status(200).json({ name, email, password });
});

router.post("/auth/logout", (request, response, next) => {
  request.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    response.clearCookie("freteuni.sid");
    response.status(200).json({ status: "success" });
  });
});

module.exports = router;
