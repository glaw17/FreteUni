process.loadEnvFile();

const express = require("express");
const session = require("express-session");
const path = require("path");
const pagesRoutes = require("./src/routes/pages");
const authRoutes = require("./src/routes/auth");
const fretesRoutes = require("./src/routes/fretes");
const { getConnection, createTables } = require("./src/database/database");

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
  response.render("pages/pag404", {
    title: "Pagina404"
  });

});

async function startServer() {
  //const connection = await getConnection();

  try {
    //await createTables();
    app.listen(port, () => {
      console.log(`Front disponível em: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Não foi possível preparar o banco de dados:", error.message);
    //await connection.destroy();
    process.exitCode = 1;
  }
}

startServer().catch((error) => {
  console.error("Não foi possível iniciar o servidor:", error.message);
  process.exitCode = 1;
});
