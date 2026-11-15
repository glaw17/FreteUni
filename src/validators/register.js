const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const cnhCategories = ["A", "B", "C", "D", "E"];
const vehicleTypes = ["CAR", "VAN", "TRUCK"];

function registrationError(errtype, message) {
  return { isValid: false, errtype, message };
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1000-01-01") {
    return false;
  }
  const date = new Date(value + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toISOString().slice(0, 10) === value;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function validateRegisterData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return registrationError("invalid_request", "Envie os dados do cadastro no campo data.");
  }

  if (typeof data.name !== "string") {
    return registrationError("invalid_name", "Informe seu nome completo.");
  }
  const fullName = data.name.trim().replace(/\s+/g, " ");
  if (fullName.length < 2 || fullName.length > 100) {
    return registrationError("invalid_name", "Informe seu nome completo, com até 100 caracteres.");
  }

  if (typeof data.birthDate !== "string") {
    return registrationError("invalid_birth_date", "Informe sua data de nascimento.");
  }
  const birthDate = data.birthDate.trim();
  if (!isValidDate(birthDate) || birthDate > getTodayDate()) {
    return registrationError("invalid_birth_date", "Informe uma data de nascimento válida e que não seja futura.");
  }

  if (typeof data.email !== "string") {
    return registrationError("invalid_email", "Informe seu email.");
  }
  const email = data.email.trim().toLowerCase();
  if (!regexEmail.test(email) || email.length > 150) {
    return registrationError("invalid_email", "Informe um email válido, com até 150 caracteres.");
  }

  if (typeof data.phone !== "string") {
    return registrationError("invalid_phone", "Informe o telefone com DDD.");
  }
  const phone = data.phone.replace(/[\s()+.\-]/g, "");
  if (!/^\d{10,11}$/.test(phone)) {
    return registrationError("invalid_phone", "Informe o telefone com DDD, com 10 ou 11 dígitos.");
  }

  if (data.profileType !== "BUYER" && data.profileType !== "DRIVER") {
    return registrationError("invalid_profile_type", "Escolha uma conta de cliente ou motorista.");
  }
  if (typeof data.password !== "string" || data.password.length < 8) {
    return registrationError("invalid_password", "A senha deve ter pelo menos 8 caracteres.");
  }
  if (Buffer.byteLength(data.password, "utf8") > 72) {
    return registrationError("invalid_password", "A senha é muito longa. Reduza a quantidade de caracteres.");
  }
  if (data.acceptedTerms !== true) {
    return registrationError("terms_not_accepted", "Você precisa aceitar os Termos de Uso para concluir o cadastro.");
  }

  const firstName = fullName.split(" ")[0].slice(0, 50);
  // Só os campos escolhidos aqui serão salvos; id e nickname não vêm do formulário.
  const userData = {
    name: firstName,
    full_name: fullName,
    nickname: firstName,
    birth_date: birthDate,
    email,
    password: data.password,
    phone,
    user_type: data.profileType,
    accepted_terms: true,
    terms_accepted_at: new Date().toISOString(),
    cpf: null,
    cnpj: null,
    company_name: null,
    cnh_number: null,
    cnh_category: null,
    cnh_expiration: null,
    vehicle_type: null,
    plate: null,
    brand: null,
    model: null,
    year: null,
    color: null,
    load_capacity: null,
    interstate: false
  };

  let personType = "PF";
  if (data.profileType === "BUYER") {
    if (data.personType !== "PF" && data.personType !== "PJ") {
      return registrationError("invalid_person_type", "Escolha pessoa física ou empresa.");
    }
    personType = data.personType;
  }

  if (personType === "PF") {
    if (typeof data.cpf !== "string") {
      return registrationError("invalid_cpf", "Informe seu CPF.");
    }
    const cpf = data.cpf.replace(/[.\-\s]/g, "");
    if (!/^\d{11}$/.test(cpf)) {
      return registrationError("invalid_cpf", "Informe os 11 dígitos do CPF.");
    }
    userData.cpf = cpf;
  } else {
    if (typeof data.cnpj !== "string") {
      return registrationError("invalid_cnpj", "Informe o CNPJ da empresa.");
    }
    const cnpj = data.cnpj.toUpperCase().replace(/[./\-\s]/g, "");
    if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
      return registrationError("invalid_cnpj", "Informe um CNPJ com 14 caracteres e as duas últimas posições numéricas.");
    }
    if (typeof data.companyName !== "string") {
      return registrationError("invalid_company_name", "Informe o nome da empresa.");
    }
    const companyName = data.companyName.trim();
    if (companyName.length < 2 || companyName.length > 100) {
      return registrationError("invalid_company_name", "Informe o nome da empresa, com até 100 caracteres.");
    }
    userData.cnpj = cnpj;
    userData.company_name = companyName;
  }

  if (data.profileType === "DRIVER") {
    if (typeof data.cnhNumber !== "string") {
      return registrationError("invalid_cnh_number", "Informe o número da CNH.");
    }
    const cnhNumber = data.cnhNumber.replace(/[.\-\s]/g, "");
    if (!/^\d{11}$/.test(cnhNumber)) {
      return registrationError("invalid_cnh_number", "Informe os 11 dígitos do número da CNH.");
    }
    if (typeof data.cnhCategory !== "string" || !cnhCategories.includes(data.cnhCategory)) {
      return registrationError("invalid_cnh_category", "Selecione uma categoria de CNH válida.");
    }
    if (typeof data.cnhExpiration !== "string" || !isValidDate(data.cnhExpiration.trim())) {
      return registrationError("invalid_cnh_expiration", "Informe uma data de validade da CNH válida.");
    }
    if (typeof data.vehicleType !== "string" || !vehicleTypes.includes(data.vehicleType)) {
      return registrationError("invalid_vehicle_type", "Selecione um tipo de veículo válido.");
    }
    if (typeof data.plate !== "string") {
      return registrationError("invalid_plate", "Informe a placa do veículo.");
    }
    const plate = data.plate.toUpperCase().replace(/[-\s]/g, "");
    if (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(plate)) {
      return registrationError("invalid_plate", "Informe uma placa válida, como ABC1234 ou ABC1D23.");
    }
    if (typeof data.brand !== "string" || data.brand.trim() === "" || data.brand.trim().length > 50) {
      return registrationError("invalid_brand", "Informe a marca do veículo, com até 50 caracteres.");
    }
    if (typeof data.model !== "string" || data.model.trim() === "" || data.model.trim().length > 50) {
      return registrationError("invalid_model", "Informe o modelo do veículo, com até 50 caracteres.");
    }

    if (typeof data.year !== "number" && typeof data.year !== "string") {
      return registrationError("invalid_year", "Informe um ano entre 1901 e 2155.");
    }
    if (typeof data.year === "string" && !/^\d{4}$/.test(data.year.trim())) {
      return registrationError("invalid_year", "Informe um ano entre 1901 e 2155.");
    }
    const year = Number(data.year);
    if (!Number.isInteger(year) || year < 1901 || year > 2155) {
      return registrationError("invalid_year", "Informe um ano entre 1901 e 2155.");
    }

    let color = null;
    if (data.color !== undefined && data.color !== null) {
      if (typeof data.color !== "string" || data.color.trim().length > 30) {
        return registrationError("invalid_color", "A cor deve ter até 30 caracteres.");
      }
      if (data.color.trim() !== "") {
        color = data.color.trim();
      }
    }

    if (typeof data.maxLoadKg !== "number" && typeof data.maxLoadKg !== "string") {
      return registrationError("invalid_capacity", "Informe a carga máxima do veículo em kg.");
    }
    if (typeof data.maxLoadKg === "string" && !/^\d+$/.test(data.maxLoadKg.trim())) {
      return registrationError("invalid_capacity", "Informe uma carga máxima inteira, entre 1 e 99.999.999 kg.");
    }
    const maxLoadKg = Number(data.maxLoadKg);
    if (!Number.isInteger(maxLoadKg) || maxLoadKg < 1 || maxLoadKg > 99999999) {
      return registrationError("invalid_capacity", "Informe uma carga máxima inteira, entre 1 e 99.999.999 kg.");
    }
    if (data.interstate !== undefined && typeof data.interstate !== "boolean") {
      return registrationError("invalid_interstate", "Informe se você também faz fretes entre estados.");
    }

    userData.cnh_number = cnhNumber;
    userData.cnh_category = data.cnhCategory;
    userData.cnh_expiration = data.cnhExpiration.trim();
    userData.vehicle_type = data.vehicleType;
    userData.plate = plate;
    userData.brand = data.brand.trim();
    userData.model = data.model.trim();
    userData.year = year;
    userData.color = color;
    userData.load_capacity = maxLoadKg;
    userData.interstate = data.interstate === true;
  }

  return { isValid: true, data: userData };
}

module.exports = { validateRegisterData };
