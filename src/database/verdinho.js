const knex = require("knex");
const conection_database = knex ({
    client: process.env.DATABASE_TYPE || "mysql2",
    connection: {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "freteuni"

}
});

module.exports = conection_database ;
