const seda = require("./verdinho.js")

async function createTables(){
    const tableUsersExist = await seda.schema.hasTable("users");
    if (!tableUsersExist){
        await seda.schema.createTable("users", (table) => {
            table.increments("id_user").primary();
            table.string("full_name",100).notNullable();
            table.date("birth_date").notNullable();
            table.string("email",150).unique().notNullable();
            table.string("password",255).notNullable();
            table.string("nickname",50).notNullable();
            table.string("phone",15).notNullable();
            table.string("CPF",11).unique().notNullable();
            table.string("CNPJ",14).unique().notNullable();
            table.string("company_name",100).notNullable();
            table.enu("user_type",["BUYER","DRIVER"]).notNullable();
            table.check(`
                        
                        (cpf IS NOT NULL AND cnpj IS NULL AND company_name IS NULL)
                         OR
                        (cpf IS NULL AND cnpj IS NOT NULL AND company_name IS NOT NULL)
                        `,
                        [],
                         "check_user_document"

            );
        });
    }

    const tableBuyersExist = await seda.schema.hasTable("buyers");
    if (!tableBuyersExist){
        await seda.schema.createTable("buyers", (table) => {
            table.integer("id_buyer").unsigned().primary();
            table.foreign("id_buyer")
                 .references("id_user")
                 .inTable("users")
                 .onUpdate("CASCADE")
                 .onDelete("CASCADE");
        });
    }

     const tableDriversExist = await seda.schema.hasTable("drivers");
    if (!tableDriversExist){
        await seda.schema.createTable("drivers", (table) => {
            table.integer("id_driver").unsigned().primary();
            table.string("cnh_number",11).unique().notNullable();
            table.enu("cnh_type",['A', 'B', 'C', 'D', 'E']).notNullable();
            table.date("cnh_expiration").notNullable();
            table.foreign("id_driver")
                 .references("id_user")
                 .inTable("users")
                 .onUpdate("CASCADE")
                 .onDelete("CASCADE");
            
        });
    }

const tableCarsExist = await seda.schema.hasTable("cars");
    if (!tableCarsExist){
        await seda.schema.createTable("cars", (table) => {
            table.increments("id_car").primary();
            table.integer("id_driver").unsigned().notNullable();
            table.enu("vehicle_type",['CAR','VAN','TRUCK']).notNullable();
            table.string("plate",7).unique().notNullable();
            table.string("brand",50).notNullable();
            table.string("model",50).notNullable();
            table.integer("year").notNullable();
            table.string("color",30).nullable();
            table.decimal("load_capacity",10,2).nullable();
            table.foreign("id_driver")
                 .references("id_driver")
                 .inTable("drivers")
                 .onUpdate("CASCADE")
                 .onDelete("CASCADE");
            
        });
    }
}


module.exports = { createTables };