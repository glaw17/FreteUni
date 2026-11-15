const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const usersFile = path.join(__dirname, "../database/users.json");

function getAllUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    try {
      fs.writeFileSync(usersFile, "[]\n", { encoding: "utf8", flag: "wx" });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }
  const content = fs.readFileSync(usersFile, "utf8");
  const users = JSON.parse(content.replace(/^\uFEFF/, ""));
  if (!Array.isArray(users)) {
    throw new Error("O arquivo users.json precisa conter uma lista de usuários.");
  }
  if (users.some((user) => !user || !Number.isSafeInteger(user.id) || user.id < 1 || typeof user.email !== "string" || typeof user.password !== "string")) {
    throw new Error("Confira os dados dos usuários no arquivo users.json.");
  }
  return users;
}

function getUserBy(field, value) {
  const users = getAllUsers();
  return users.find((user) => user[field] === value) || null;
}

function getUserById(id) {
  return getUserBy("id", id);
}

function getUserByEmail(email) {
  if (typeof email !== "string") {
    return null;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find((user) => user.email.trim().toLowerCase() === normalizedEmail) || null;
}

function existsEmail(email) {
  return getUserByEmail(email) !== null;
}

function createUserError(status, errtype, message) {
  const error = new Error(message);
  error.status = status;
  error.errtype = errtype;
  return error;
}

async function createUser(userData) {
  if (!userData || typeof userData.email !== "string" || userData.email.trim() === "") {
    throw createUserError(400, "invalid_email", "Informe o email do usuário.");
  }
  if (typeof userData.password !== "string" || userData.password.length < 8 || Buffer.byteLength(userData.password, "utf8") > 72) {
    throw createUserError(400, "invalid_password", "Informe uma senha com pelo menos 8 caracteres e que não seja muito longa.");
  }

  const password = await bcrypt.hash(userData.password, 10);
  const users = getAllUsers();
  const email = userData.email.trim().toLowerCase();
  if (users.some((user) => user.email.trim().toLowerCase() === email)) {
    throw createUserError(409, "already_registered", "O email já está registrado.");
  }
  if (userData.cpf && users.some((user) => user.cpf === userData.cpf)) {
    throw createUserError(409, "cpf_already_registered", "O CPF já está registrado.");
  }
  if (userData.cnpj && users.some((user) => user.cnpj === userData.cnpj)) {
    throw createUserError(409, "cnpj_already_registered", "O CNPJ já está registrado.");
  }
  if (userData.cnh_number && users.some((user) => user.cnh_number === userData.cnh_number)) {
    throw createUserError(409, "cnh_already_registered", "O número da CNH já está registrado.");
  }
  if (userData.plate && users.some((user) => user.plate === userData.plate)) {
    throw createUserError(409, "plate_already_registered", "A placa já está registrada.");
  }

  let id = 1;
  if (users.length > 0) {
    id = Math.max(...users.map((user) => user.id)) + 1;
  }
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Confira os IDs dos usuários no arquivo users.json.");
  }

  const newUser = {
    ...userData,
    id,
    email,
    password
  };
  users.push(newUser);

  const temporaryFile = usersFile + ".tmp";
  fs.writeFileSync(temporaryFile, JSON.stringify(users, null, 2) + "\n", "utf8");
  fs.renameSync(temporaryFile, usersFile);

  return newUser;
}

module.exports = { getAllUsers, getUserBy, getUserById, getUserByEmail, existsEmail, createUser };
