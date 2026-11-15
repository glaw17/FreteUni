const express = require("express");
const session = require("express-session");
const path = require("path");
const pagesRoutes = require("./src/routes/pages");
const authRoutes = require("./src/routes/auth");
const fretesRoutes = require("./src/routes/fretes");
const { createTables } = require("./src/database/scheminha");

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

const sourceDirectory = path.join(__dirname, "src");
const publicDirectory = path.join(__dirname, "public");
const viewsDirectory = path.join(sourceDirectory, "views");

app.set("view engine", "ejs");
app.set("views", viewsDirectory);

app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  name: "freteuni.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000 // Uma hora.
  }
}));

app.use(pagesRoutes);
app.use(authRoutes);
app.use(fretesRoutes);

app.use((error, request, response, next) => {
  if (!request.path.startsWith("/auth/")) {
    return next(error);
  }
  if (error.status === 400 || error.status === 413 || error.status === 415) {
    return response.status(error.status).json({
      status: "error",
      errtype: "invalid_request",
      message: "Não foi possível ler os dados enviados. Confira o formulário e tente novamente.",
    });
  }
  return response.status(500).json({
    status: "error",
    errtype: "server_error",
    message: "Não foi possível processar a solicitação. Tente novamente em instantes.",
  });
});

app.use((request, response) => {
  response.status(404).send("Página não encontrada");
});

createTables();

app.listen(port, () => {
  console.log(`Front disponível em http://localhost:${port}`);
});
