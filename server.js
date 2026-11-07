const express = require("express");
const path = require("path");
const pagesRoutes = require("./src/routes/pages");
const authRoutes = require("./src/routes/auth");
const fretesRoutes = require("./src/routes/fretes");

const app = express();
const port = process.env.PORT || 3000;

const sourceDirectory = path.join(__dirname, "src");
const publicDirectory = path.join(__dirname, "public");
const viewsDirectory = path.join(sourceDirectory, "views");

app.set("view engine", "ejs");
app.set("views", viewsDirectory);

app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));

app.use(pagesRoutes);
app.use(authRoutes);
app.use(fretesRoutes);

app.use((request, response) => {
  response.status(404).send("Página não encontrada");
});

app.listen(port, () => {
  console.log(`Front disponível em http://localhost:${port}`);
});
