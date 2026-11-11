const users = [
  {
    id: 1,
    email: "teste@example.com",
    password: "teste12345",
    name: "User",
    full_name: "Teste User"
  },
];

function getAllUsers() {
  return users;
}

function getUserBy(field, value) {
  return users.find((user) => user[field] === value) || null;
}

function getUserById(id) {
  return getUserBy("id", id);
}

function getUserByEmail(email) {
  return getUserBy("email", email);
}

function existsEmail(email) {
  return getUserByEmail(email) !== null;
}

module.exports = { getAllUsers, getUserBy, getUserById, getUserByEmail, existsEmail };