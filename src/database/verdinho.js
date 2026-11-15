const knex = require("knex");
const conection_database = knex ({
    client: "mysql2",
    connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password:"M.itsuo78@76" ,
    database:"freteuni"

}
});

module.exports = conection_database ;