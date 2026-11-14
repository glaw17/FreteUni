const express = require("express");
const bcrypt = require("bcrypt");
const { getUserById, getUserByEmail, createUser } = require("../controller/UserController");
const { validateRegisterData } = require("../validators/register");

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

router.post("/auth/login", async (request, response, next) => {
  const { email, password, rememberMe } = request.body || {};

  if (!email || !password) {
    return response.status(400).json({
      status: "error",
      errtype: "missing_fields",
      message: "Email e senha são obrigatórios.",
    });
  }

  if (typeof email !== "string" || !regexEmail.test(email.trim()) || email.trim().length > 150) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_email",
      message: "Por favor, insira um email válido.",
    });
  }

  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_password",
      message: "Informe uma senha com pelo menos 8 caracteres e que não seja muito longa.",
    });
  }

  if (rememberMe !== undefined && typeof rememberMe !== "boolean") {
    return response.status(400).json({
      status: "error",
      errtype: "invalid_remember_me",
      message: "O campo lembrar de mim deve ser verdadeiro ou falso.",
    });
  }

  let user;
  try {
    user = getUserByEmail(email);
    if (!user) {
      return response.status(400).json({
        status: "error",
        errtype: "not_registered",
        message: "O email não está registrado.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return response.status(401).json({
        status: "error",
        errtype: "invalid_credentials",
        message: "Credenciais inválidas.",
      });
    }
  } catch (error) {
    return response.status(500).json({
      status: "error",
      errtype: "login_failed",
      message: "Não foi possível concluir o login. Tente novamente em instantes.",
    });
  }

  request.session.regenerate((error) => {
    if (error) {
      return next(error);
    }

    request.session.userId = user.id;
    request.session.cookie.maxAge = 60 * 60 * 1000;

    if (rememberMe) {
      request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

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

router.post("/auth/register", async (request, response) => {
  const { data } = request.body || {};
  const registerTest = validateRegisterData(data);
  if (!registerTest.isValid) {
    return response.status(400).json({
      status: "error",
      errtype: registerTest.errtype,
      message: registerTest.message,
    });
  }

  try {
    const user = await createUser(registerTest.data);
    return response.status(201).json({
      status: "success",
      user: { id: user.id, name: user.name },
    });
  } catch (error) {
    if ((error.status === 400 || error.status === 409) && error.errtype) {
      return response.status(error.status).json({
        status: "error",
        errtype: error.errtype,
        message: error.message,
      });
    }
    return response.status(500).json({
      status: "error",
      errtype: "registration_failed",
      message: "Não foi possível concluir o cadastro. Tente novamente em instantes.",
    });
  }
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
