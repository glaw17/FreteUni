const bcrypt = require("bcrypt");
const { getConnection } = require("../database/database");

async function getAllUsers() {
  const connection = await getConnection();

  return connection("users").select(
    "users.*",
    "users.id_user as id",
    "users.nickname as name",
    "users.cpf as cpf",
    "users.cnpj as cnpj",
  );
}

async function getUserBy(field, value) {
  const connection = await getConnection();

  const user = await connection("users")
    .select(
      "users.*",
      "users.id_user as id",
      "users.nickname as name",
      "users.cpf as cpf",
      "users.cnpj as cnpj",
    )
    .where(field, value)
    .first();

  if (!user) {
    return null;
  }

  return user;
}

function normalizeId(id) {
  if (typeof id !== "number" && typeof id !== "string") {
    return null;
  }
  if (typeof id === "string" && !/^\d+$/.test(id.trim())) {
    return null;
  }

  const normalizedId = Number(id);
  if (!Number.isSafeInteger(normalizedId) || normalizedId < 1) {
    return null;
  }

  return normalizedId;
}

async function getUserById(id) {
  const normalizedId = normalizeId(id);
  if (normalizedId === null) {
    return null;
  }

  return getUserBy("id_user", normalizedId);
}

async function getUserByBuyerId(id) {
  const normalizedId = normalizeId(id);
  if (normalizedId === null) {
    return null;
  }

  const connection = await getConnection();
  const user = await connection("users")
    .join("buyers", "buyers.id_buyer", "users.id_user")
    .select(
      "users.*",
      "users.id_user as id",
      "users.nickname as name",
      "users.cpf as cpf",
      "users.cnpj as cnpj",
      "buyers.id_buyer",
    )
    .where("buyers.id_buyer", normalizedId)
    .where("users.user_type", "BUYER")
    .first();

  if (!user) {
    return null;
  }

  return user;
}

async function getUserByDriverId(id) {
  const normalizedId = normalizeId(id);
  if (normalizedId === null) {
    return null;
  }

  const connection = await getConnection();
  const user = await connection("users")
    .join("drivers", "drivers.id_driver", "users.id_user")
    .select(
      "users.*",
      "users.id_user as id",
      "users.nickname as name",
      "users.cpf as cpf",
      "users.cnpj as cnpj",
      "drivers.id_driver",
      "drivers.cnh_number",
      "drivers.cnh_type",
      "drivers.cnh_expiration",
      "drivers.interstate",
    )
    .where("drivers.id_driver", normalizedId)
    .where("users.user_type", "DRIVER")
    .first();

  if (!user) {
    return null;
  }

  return user;
}

async function getUserByEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  return getUserBy("email", normalizedEmail);
}

async function existsEmail(email) {
  const user = await getUserByEmail(email);

  return user != null;
}

function createUserError(status, errtype, message) {
  const error = new Error(message);

  error.status = status;
  error.errtype = errtype;

  return error;
}

async function createUser(userData) {
  if (
    !userData ||
    typeof userData.email !== "string" ||
    !userData.email.trim()
  ) {
    throw createUserError(400, "invalid_email", "Informe o email do usuário.");
  }

  if (
    typeof userData.password !== "string" ||
    userData.password.length < 8 ||
    Buffer.byteLength(userData.password, "utf8") > 72
  ) {
    throw createUserError(
      400,
      "invalid_password",
      "Informe uma senha com pelo menos 8 caracteres e no máximo 72 bytes.",
    );
  }

  const email = userData.email.trim().toLowerCase();

  const cpf =
    typeof userData.cpf === "string" ? userData.cpf.trim() || null : null;

  const cnpj =
    typeof userData.cnpj === "string" ? userData.cnpj.trim() || null : null;

  const companyName =
    typeof userData.company_name === "string"
      ? userData.company_name.trim() || null
      : null;

  const userType = userData.user_type;

  if (!["BUYER", "DRIVER"].includes(userType)) {
    throw createUserError(
      400,
      "invalid_user_type",
      "Tipo de usuário inválido.",
    );
  }

  if (!((cpf && !cnpj && !companyName) || (!cpf && cnpj && companyName))) {
    throw createUserError(
      400,
      "invalid_document",
      "Informe CPF ou CNPJ acompanhado da razão social.",
    );
  }

  if (userType === "DRIVER") {
    if (
      !userData.cnh_number ||
      !["A", "B", "C", "D", "E"].includes(userData.cnh_category) ||
      !userData.cnh_expiration
    ) {
      throw createUserError(
        400,
        "invalid_cnh",
        "Informe os dados obrigatórios da CNH.",
      );
    }
  }

  const vehicleFields = [
    "plate",
    "vehicle_type",
    "brand",
    "model",
    "year",
    "color",
    "load_capacity",
  ];

  const hasVehicle = vehicleFields.some(
    (field) =>
      userData[field] !== undefined &&
      userData[field] !== null &&
      userData[field] !== "",
  );

  if (hasVehicle) {
    if (userType !== "DRIVER") {
      throw createUserError(
        400,
        "invalid_vehicle",
        "Apenas motoristas podem cadastrar veículos.",
      );
    }

    const validTypes = ["CAR", "VAN", "TRUCK"];

    if (
      !userData.plate ||
      !validTypes.includes(userData.vehicle_type) ||
      !userData.brand ||
      !userData.model ||
      !userData.year
    ) {
      throw createUserError(
        400,
        "invalid_vehicle",
        "Informe os dados obrigatórios do veículo.",
      );
    }
  }
  const password = await bcrypt.hash(userData.password, 10);

  const connection = await getConnection();

  try {
    return await connection.transaction(async (trx) => {
      const existingEmail = await trx("users").where("email", email).first();

      if (existingEmail) {
        throw createUserError(
          409,
          "already_registered",
          "O email já está registrado.",
        );
      }

      if (cpf) {
        const existingCpf = await trx("users").where("cpf", cpf).first();

        if (existingCpf) {
          throw createUserError(
            409,
            "cpf_already_registered",
            "O CPF já está registrado.",
          );
        }
      }

      if (cnpj) {
        const existingCnpj = await trx("users").where("cnpj", cnpj).first();

        if (existingCnpj) {
          throw createUserError(
            409,
            "cnpj_already_registered",
            "O CNPJ já está registrado.",
          );
        }
      }

      if (userType === "DRIVER") {
        const existingCnh = await trx("drivers")
          .where("cnh_number", userData.cnh_number)
          .first();

        if (existingCnh) {
          throw createUserError(
            409,
            "cnh_already_registered",
            "O número da CNH já está registrado.",
          );
        }

        if (hasVehicle) {
          const existingPlate = await trx("cars")
            .where("plate", userData.plate)
            .first();

          if (existingPlate) {
            throw createUserError(
              409,
              "plate_already_registered",
              "A placa já está registrada.",
            );
          }
        }
      }

      let termsAcceptedAt = null;
      if (userData.accepted_terms === true) {
        termsAcceptedAt = new Date();
      }

      const [id_user] = await trx("users").insert({
        full_name: userData.full_name,
        birth_date: userData.birth_date,
        nickname: userData.nickname,
        phone: userData.phone,
        email,
        password,
        cpf,
        cnpj,
        company_name: companyName,
        user_type: userType,
        accepted_terms: userData.accepted_terms === true,
        terms_accepted_at: termsAcceptedAt,
      });

      if (userType === "BUYER") {
        await trx("buyers").insert({
          id_buyer: id_user,
        });
      }

      if (userType === "DRIVER") {
        await trx("drivers").insert({
          id_driver: id_user,
          cnh_number: userData.cnh_number,
          cnh_type: userData.cnh_category,
          cnh_expiration: userData.cnh_expiration,
          interstate: userData.interstate === true,
        });

        if (hasVehicle) {
          await trx("cars").insert({
            id_driver: id_user,
            vehicle_type: userData.vehicle_type,
            plate: userData.plate,
            brand: userData.brand,
            model: userData.model,
            year: userData.year,
            color: userData.color || null,
            load_capacity: userData.load_capacity ?? null,
          });
        }
      }

      return {
        id_user,
        id: id_user,
        name: userData.nickname,
        nickname: userData.nickname,
        full_name: userData.full_name,
        email,
        cpf,
        cnpj,
        company_name: companyName,
        user_type: userType,
      };
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      throw createUserError(
        409,
        "already_registered",
        "Um dos dados informados já está registrado.",
      );
    }

    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserBy,
  getUserById,
  getUserByBuyerId,
  getUserByDriverId,
  getUserByEmail,
  existsEmail,
  createUser,
};
