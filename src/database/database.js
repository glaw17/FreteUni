const knex = require("knex");
const connection = knex({
  client: process.env.DATABASE_TYPE,
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});

async function getConnection() {
  return connection;
}

async function renameOldColumn(connection, tableName, oldName, newName) {
  const hasOldColumn = await connection.schema.hasColumn(tableName, oldName);
  const hasNewColumn = await connection.schema.hasColumn(tableName, newName);

  if (hasOldColumn && hasNewColumn) {
    throw new Error(
      `A tabela ${tableName} tem as colunas ${oldName} e ${newName}. Confira os dados antes de continuar.`,
    );
  }
  if (!hasOldColumn && !hasNewColumn) {
    throw new Error(`A coluna ${tableName}.${newName} não foi encontrada.`);
  }
  if (hasOldColumn) {
    await connection.schema.alterTable(tableName, (table) => {
      table.renameColumn(oldName, newName);
    });
  }
}

async function isUnsignedId(connection, tableName, columnName) {
  const column = await connection("information_schema.columns")
    .select("COLUMN_TYPE")
    .whereRaw("TABLE_SCHEMA = DATABASE()")
    .where("TABLE_NAME", tableName)
    .where("COLUMN_NAME", columnName)
    .first();

  if (!column) {
    throw new Error(`A coluna ${tableName}.${columnName} não foi encontrada.`);
  }
  return column.COLUMN_TYPE.toLowerCase().includes("unsigned");
}

async function updateUsersTable(connection) {
  const columns = await connection("users").columnInfo();
  const documents = [
    { name: "cpf", length: 11 },
    { name: "cnpj", length: 14 },
    { name: "company_name", length: 100 },
  ];

  // Ajusta o banco antigo sem apagar os cadastros.
  for (const document of documents) {
    const columnName = Object.keys(columns).find(
      (name) => name.toLowerCase() === document.name,
    );
    if (!columnName) {
      throw new Error(`A coluna users.${document.name} não foi encontrada.`);
    }
    if (!columns[columnName].nullable) {
      await connection.schema.alterTable("users", (table) => {
        table.string(columnName, document.length).nullable().alter();
      });
    }
  }

  if (!columns.accepted_terms) {
    await connection.schema.alterTable("users", (table) => {
      table.boolean("accepted_terms").notNullable().defaultTo(false);
    });
  }
  if (!columns.terms_accepted_at) {
    await connection.schema.alterTable("users", (table) => {
      table.dateTime("terms_accepted_at").nullable();
    });
  }

  const indexes = await connection("information_schema.statistics")
    .select("INDEX_NAME", "COLUMN_NAME")
    .whereRaw("TABLE_SCHEMA = DATABASE()")
    .where("TABLE_NAME", "users")
    .where("NON_UNIQUE", 0);

  for (const index of indexes) {
    const indexColumns = indexes.filter(
      (item) => item.INDEX_NAME === index.INDEX_NAME,
    );
    if (
      index.INDEX_NAME !== "PRIMARY" &&
      indexColumns.length === 1 &&
      index.COLUMN_NAME.toLowerCase() === "nickname"
    ) {
      // Pessoas com o mesmo primeiro nome podem ter contas diferentes.
      await connection.schema.alterTable("users", (table) => {
        table.dropUnique(["nickname"], index.INDEX_NAME);
      });
    }
  }
}

async function createTables() {
  const connection = await getConnection();
  const tableUsersExist = await connection.schema.hasTable("users");
  if (!tableUsersExist) {
    await connection.schema.createTable("users", (table) => {
      table.increments("id_user").primary();
      table.string("full_name", 100).notNullable();
      table.date("birth_date").notNullable();
      table.string("email", 150).unique().notNullable();
      table.string("password", 255).notNullable();
      table.string("nickname", 50).notNullable();
      table.string("phone", 15).notNullable();
      table.string("cpf", 11).unique().nullable();
      table.string("cnpj", 14).unique().nullable();
      table.string("company_name", 100).nullable();
      table.enu("user_type", ["BUYER", "DRIVER"]).notNullable();
      table.boolean("accepted_terms").notNullable().defaultTo(false);
      table.dateTime("terms_accepted_at").nullable();
      table.check(
        `
          (cpf IS NOT NULL AND cnpj IS NULL AND company_name IS NULL)
          OR
          (cpf IS NULL AND cnpj IS NOT NULL AND company_name IS NOT NULL)
        `,
        [],
        "check_user_document",
      );
    });
  }
  await updateUsersTable(connection);
  const userIdUnsigned = await isUnsignedId(connection, "users", "id_user");

  const tableBuyersExist = await connection.schema.hasTable("buyers");
  if (!tableBuyersExist) {
    await connection.schema.createTable("buyers", (table) => {
      const buyerId = table.integer("id_buyer").primary();
      if (userIdUnsigned) {
        buyerId.unsigned();
      }
      table
        .foreign("id_buyer")
        .references("id_user")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  } else {
    await renameOldColumn(connection, "buyers", "id_user", "id_buyer");
  }

  const tableDriversExist = await connection.schema.hasTable("drivers");
  if (!tableDriversExist) {
    await connection.schema.createTable("drivers", (table) => {
      const driverId = table.integer("id_driver").primary();
      if (userIdUnsigned) {
        driverId.unsigned();
      }
      table.string("cnh_number", 11).unique().notNullable();
      table.enu("cnh_type", ["A", "B", "C", "D", "E"]).notNullable();
      table.date("cnh_expiration").notNullable();
      table.boolean("interstate").notNullable().defaultTo(false);
      table
        .foreign("id_driver")
        .references("id_user")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  } else {
    await renameOldColumn(connection, "drivers", "id_user", "id_driver");
    await renameOldColumn(connection, "drivers", "cnh_category", "cnh_type");
    const hasInterstate = await connection.schema.hasColumn("drivers", "interstate");
    if (!hasInterstate) {
      await connection.schema.alterTable("drivers", (table) => {
        table.boolean("interstate").notNullable().defaultTo(false);
      });
    }
  }
  const driverIdUnsigned = await isUnsignedId(connection, "drivers", "id_driver");

  const tableCarsExist = await connection.schema.hasTable("cars");
  if (!tableCarsExist) {
    await connection.schema.createTable("cars", (table) => {
      table.increments("id_car").primary();
      const driverId = table.integer("id_driver").notNullable();
      if (driverIdUnsigned) {
        driverId.unsigned();
      }
      table.enu("vehicle_type", ["CAR", "VAN", "TRUCK"]).notNullable();
      table.string("plate", 7).unique().notNullable();
      table.string("brand", 50).notNullable();
      table.string("model", 50).notNullable();
      table.integer("year").notNullable();
      table.string("color", 30).nullable();
      table.decimal("load_capacity", 10, 2).nullable();
      table
        .foreign("id_driver")
        .references("id_driver")
        .inTable("drivers")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  } else {
    await renameOldColumn(connection, "cars", "driver_id", "id_driver");
  }
}

module.exports = { getConnection, createTables };
