import { regexEmail, AUTH_REQUEST_TIMEOUT } from "./utils.js";

// Cada array é uma etapa. A ordem dos campos também é a ordem na tela.
const stepsByProfile = {
  BUYER: [
    ["name", "birthDate", "email", "phone"],
    ["personType", "cpf", "cnpj", "companyName"],
    ["password", "confirmPassword", "acceptedTerms"],
  ],
  DRIVER: [
    ["name", "birthDate", "email", "phone"],
    ["cpf", "cnhNumber", "cnhCategory", "cnhExpiration"],
    ["vehicleType", "plate", "brand", "model", "year", "color"],
    ["capacity", "interstate"],
    ["password", "confirmPassword", "acceptedTerms"],
  ]
};

// Os campos podem ser usados em mais de um perfil ou etapa.
const fields = {
  name: {
    label: "Nome completo",
    type: "text",
    placeholder: "Seu nome completo",
    icon: "fa-user",
    autocomplete: "name",
    minLength: 2,
    maxLength: 100,
    test: testName
  },
  birthDate: {
    label: "Data de nascimento",
    type: "date",
    icon: "fa-calendar-days",
    autocomplete: "bday",
    min: "1000-01-01",
    max: getTodayDate(),
    test: testBirthDate
  },
  email: {
    label: "Email",
    type: "email",
    placeholder: "voce@exemplo.com",
    icon: "fa-envelope",
    autocomplete: "email",
    maxLength: 150, // 150 devido ao limite do banco de dados, EU colocaria 254, porem ne....
    test: testEmail
  },
  phone: {
    label: "Telefone com DDD",
    type: "tel",
    placeholder: "(00) 00000-0000",
    icon: "fa-phone",
    autocomplete: "tel-national",
    maxLength: 15,
    test: testPhone,
    format: formatPhone
  },
  cep: {
    label: "CEP",
    type: "text",
    placeholder: "00000-000",
    icon: "fa-location-dot",
    autocomplete: "postal-code",
    inputMode: "numeric",
    maxLength: 9
  },
  personType: {
    label: "Cadastrar como",
    type: "radio",
    defaultValue: "PF",
    options: [
      { value: "PF", label: "Pessoa física" },
      { value: "PJ", label: "Empresa" },
    ],
    test: testPersonType
  },
  cpf: {
    label: "CPF",
    type: "text",
    placeholder: "000.000.000-00",
    icon: "fa-id-card",
    inputMode: "numeric",
    maxLength: 14,
    test: testCpf,
    format: formatCpf,
    showIf: showIndividualFields
  },
  cnhNumber: {
    label: "Número da CNH",
    type: "text",
    placeholder: "Informe os 11 dígitos",
    icon: "fa-id-card",
    inputMode: "numeric",
    autocomplete: "off",
    minLength: 11,
    maxLength: 11,
    test: testCnhNumber,
    format: formatCnhNumber
  },
  cnhCategory: {
    label: "Categoria da CNH",
    type: "select",
    icon: "fa-id-card",
    options: [
      { value: "", label: "Selecione a categoria" },
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" },
    ],
    test: testCnhCategory
  },
  cnhExpiration: {
    label: "Validade da CNH",
    type: "date",
    icon: "fa-calendar-days",
    min: "1000-01-01",
    max: "9999-12-31",
    test: testCnhExpiration
  },
  cnpj: {
    label: "CNPJ",
    type: "text",
    placeholder: "00.000.000/0000-00",
    icon: "fa-building",
    maxLength: 18,
    test: testCnpj,
    format: formatCnpj,
    showIf: showCompanyFields
  },
  companyName: {
    label: "Nome da empresa",
    type: "text",
    placeholder: "Informe o nome da empresa",
    icon: "fa-building",
    autocomplete: "organization",
    minLength: 2,
    maxLength: 100,
    test: testCompanyName,
    showIf: showCompanyFields
  },
  vehicleType: {
    label: "Tipo do veículo",
    type: "select",
    icon: "fa-truck",
    options: [
      { value: "", label: "Selecione o tipo" },
      { value: "CAR", label: "Carro" },
      { value: "VAN", label: "Van" },
      { value: "TRUCK", label: "Caminhão" }
    ],
    test: testVehicleType
  },
  plate: {
    label: "Placa",
    type: "text",
    placeholder: "Ex.: ABC1D23 ou ABC1234",
    icon: "fa-car",
    maxLength: 8,
    test: testPlate,
    format: formatPlate
  },
  brand: {
    label: "Marca",
    type: "text",
    placeholder: "Ex.: Mercedes-Benz",
    icon: "fa-truck",
    maxLength: 50,
    test: testBrand
  },
  model: {
    label: "Modelo",
    type: "text",
    placeholder: "Ex.: Accelo",
    icon: "fa-truck",
    maxLength: 50,
    test: testModel
  },
  year: {
    label: "Ano do veículo",
    type: "number",
    placeholder: "Ex.: 2024",
    icon: "fa-calendar-days",
    inputMode: "numeric",
    min: 1901,
    max: 2155,
    step: 1,
    test: testYear
  },
  color: {
    label: "Cor (opcional)",
    type: "text",
    placeholder: "Ex.: Branco",
    icon: "fa-palette",
    maxLength: 30,
    required: false,
    test: testColor
  },
  capacity: {
    label: "Carga máxima em kg",
    type: "number",
    placeholder: "Ex.: 3000",
    icon: "fa-weight-hanging",
    inputMode: "numeric",
    min: 1,
    max: 99999999,
    step: 1,
    requestName: "maxLoadKg",
    test: testCapacity
  },
  interstate: {
    label: "Também faço fretes entre estados.",
    type: "checkbox",
    required: false,
    test: testInterstate
  },
  password: {
    label: "Senha",
    type: "password",
    placeholder: "Crie uma senha",
    icon: "fa-lock",
    autocomplete: "new-password",
    minLength: 8,
    hint: "Use pelo menos 8 caracteres.",
    test: testPassword
  },
  confirmPassword: {
    id: "confirm-password",
    label: "Confirme a senha",
    type: "password",
    placeholder: "Repita sua senha",
    icon: "fa-lock",
    autocomplete: "new-password",
    minLength: 8,
    send: false,
    test: testConfirmPassword
  },
  acceptedTerms: {
    label: "Li e aceito os",
    type: "checkbox",
    defaultValue: false,
    required: true,
    link: { label: "Termos de Uso", href: "/termos" },
    test: testAcceptedTerms
  },
};

const authForm = document.getElementById("auth-form");
const formElements = document.getElementById("form-elements");
const registerError = document.getElementById("register-error");
const formScrollHint = document.getElementById("form-scroll-hint");
const accountType = authForm.querySelector(".account-type");
const profileInputs = authForm.querySelectorAll('input[name="profileType"]');

const backBtn = document.getElementById("back-step-btn");
const submitBtn = document.getElementById("submitBtn");

// Os valores continuam aqui quando os inputs são recriados.
const formValues = {};
const fieldErrors = {};

let profileType = "BUYER";
let registerSteps = [];
let currentStep = 0;
let isSubmitting = false;

function testName(value) {
  const name = value.trim();
  if (name.length < 2 || name.length > 100) {
    return { isValid: false, error: "Informe seu nome completo, com até 100 caracteres." };
  }
  return { isValid: true, error: null, value: name };
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function testBirthDate(value) {
  const birthDate = value.trim();
  if (birthDate === "") {
    return { isValid: false, error: "Informe sua data de nascimento." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return { isValid: false, error: "Informe uma data de nascimento válida." };
  }

  const date = new Date(birthDate + "T00:00:00Z");
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate) {
    return { isValid: false, error: "Informe uma data de nascimento válida." };
  }
  if (birthDate < "1000-01-01" || birthDate > getTodayDate()) {
    return { isValid: false, error: "A data de nascimento não pode ser futura e deve ter um ano com 4 dígitos." };
  }
  return { isValid: true, error: null, value: birthDate };
}

function testEmail(value) {
  const email = value.trim();
  if (email === "") {
    return { isValid: false, error: "O email é obrigatório." };
  }
  if (!regexEmail.test(email) || email.length > (fields?.email?.maxLength ?? 150)) {
    return { isValid: false, error: "Por favor, insira um email válido." };
  }
  return { isValid: true, error: null, value: email };
}

function testPhone(value) {
  const phone = value.replace(/\D/g, "");
  if (phone.length !== 10 && phone.length !== 11) {
    return { isValid: false, error: "Informe o telefone com DDD." };
  }
  return { isValid: true, error: null, value: phone };
}

function testCpf(value) {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11) {
    return { isValid: false, error: "Informe os 11 dígitos do CPF." };
  }
  return { isValid: true, error: null, value: cpf };
}

function testCnhNumber(value) {
  const cnhNumber = value.replace(/\D/g, "");
  if (cnhNumber.length !== 11) {
    return { isValid: false, error: "Informe os 11 dígitos do número da CNH." };
  }
  return { isValid: true, error: null, value: cnhNumber };
}

function testCnhCategory(value) {
  const cnhCategory = value.trim();
  if (cnhCategory === "") {
    return { isValid: false, error: "Selecione a categoria da CNH." };
  }
  if (!fields.cnhCategory.options.some((option) => option.value === cnhCategory)) {
    return { isValid: false, error: "Selecione uma categoria de CNH válida." };
  }
  return { isValid: true, error: null, value: cnhCategory };
}

function testCnhExpiration(value) {
  const cnhExpiration = value.trim();
  if (cnhExpiration === "") {
    return { isValid: false, error: "Informe a validade da CNH." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cnhExpiration)) {
    return { isValid: false, error: "Informe uma data de validade válida." };
  }

  const date = new Date(cnhExpiration + "T00:00:00Z");
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== cnhExpiration || cnhExpiration < "1000-01-01") {
    return { isValid: false, error: "Informe uma data de validade válida, com ano a partir de 1000." };
  }
  return { isValid: true, error: null, value: cnhExpiration };
}

function testPersonType(value) {
  if (value !== "PF" && value !== "PJ") {
    return { isValid: false, error: "Escolha pessoa física ou empresa." };
  }
  return { isValid: true, error: null, value };
}

function testCnpj(value) {
  const cnpj = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return { isValid: false, error: "Informe um CNPJ com 14 caracteres e as duas últimas posições numéricas." };
  }
  return { isValid: true, error: null, value: cnpj };
}

function testCompanyName(value) {
  const companyName = value.trim();
  if (companyName.length < 2 || companyName.length > 100) {
    return { isValid: false, error: "Informe o nome da empresa, com até 100 caracteres." };
  }
  return { isValid: true, error: null, value: companyName };
}

function testVehicleType(value) {
  const vehicleType = value.trim();
  if (vehicleType === "") {
    return { isValid: false, error: "Selecione o tipo do veículo." };
  }
  if (!fields.vehicleType.options.some((option) => option.value === vehicleType)) {
    return { isValid: false, error: "Selecione um tipo de veículo válido." };
  }
  return { isValid: true, error: null, value: vehicleType };
}

function testPlate(value) {
  const plate = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(plate)) {
    return { isValid: false, error: "Informe uma placa válida, como ABC1234 ou ABC1D23." };
  }
  return { isValid: true, error: null, value: plate };
}

function testBrand(value) {
  const brand = value.trim();
  if (brand === "" || brand.length > 50) {
    return { isValid: false, error: "Informe a marca do veículo, com até 50 caracteres." };
  }
  return { isValid: true, error: null, value: brand };
}

function testModel(value) {
  const model = value.trim();
  if (model === "" || model.length > 50) {
    return { isValid: false, error: "Informe o modelo do veículo, com até 50 caracteres." };
  }
  return { isValid: true, error: null, value: model };
}

function testYear(value) {
  const year = Number(value);
  if (!/^\d{4}$/.test(value) || !Number.isInteger(year) || year < 1901 || year > 2155) {
    return { isValid: false, error: "Informe um ano entre 1901 e 2155." };
  }
  return { isValid: true, error: null, value: year };
}

function testColor(value) {
  const color = value.trim();
  if (color === "") {
    return { isValid: true, error: null, value: null };
  }
  if (color.length > 30) {
    return { isValid: false, error: "A cor deve ter até 30 caracteres." };
  }
  return { isValid: true, error: null, value: color };
}

function testCapacity(value) {
  const maxLoadKg = Number(value);
  if (!Number.isInteger(maxLoadKg) || maxLoadKg < 1) {
    return { isValid: false, error: "Informe uma carga máxima de pelo menos 1 kg, sem casas decimais." };
  }
  if (maxLoadKg > 99999999) {
    return { isValid: false, error: "A carga máxima deve ser de até 99.999.999 kg." };
  }
  return { isValid: true, error: null, value: maxLoadKg };
}

function testInterstate(value) {
  return { isValid: true, error: null, value: value === true };
}

function testPassword(value) {
  if (value === "") {
    return { isValid: false, error: "A senha é obrigatória." };
  }
  if (value.length < 8) {
    return {
      isValid: false,
      error: "A senha deve ter pelo menos 8 caracteres.",
    };
  }
  if (new TextEncoder().encode(value).length > 72) {
    return {
      isValid: false,
      error: "A senha é muito longa. Reduza a quantidade de caracteres.",
    };
  }
  return { isValid: true, error: null, value };
}

function testConfirmPassword(value) {
  if (value === "") {
    return { isValid: false, error: "Confirme sua senha." };
  }
  if (value !== getFieldValue("password")) {
    return { isValid: false, error: "As senhas precisam ser iguais." };
  }
  return { isValid: true, error: null, value };
}

function testAcceptedTerms(value) {
  if (value !== true) {
    return { isValid: false, error: "Aceite os Termos de Uso para continuar." };
  }
  return { isValid: true, error: null, value };
}

function getFieldValue(fieldName) {
  if (formValues[fieldName] !== undefined) {
    return formValues[fieldName];
  }
  if (fields[fieldName] && fields[fieldName].defaultValue !== undefined) {
    return fields[fieldName].defaultValue;
  }
  if (fields[fieldName] && fields[fieldName].type === "checkbox") {
    return false;
  }
  return "";
}

function showCompanyFields() {
  return profileType === "BUYER" && getFieldValue("personType") === "PJ";
}

function showIndividualFields() {
  return !showCompanyFields();
}

function getStepFields(index) {
  return registerSteps[index].filter((fieldName) => {
    const field = fields[fieldName];
    if (field.showIf) {
      return field.showIf();
    }
    return true;
  });
}

function saveStepValues() {
  const inputs = formElements.querySelectorAll("input[data-field], select[data-field]");
  inputs.forEach((input) => {
    if (input.type === "radio" && !input.checked) {
      return;
    }
    if (input.type === "checkbox") {
      formValues[input.dataset.field] = input.checked;
    } else {
      formValues[input.dataset.field] = input.value;
    }
  });
}

function getFieldInput(fieldName) {
  const fieldId = fields[fieldName].id || fieldName;
  const input = document.getElementById(fieldId + "-input");
  if (input && fields[fieldName].type === "radio") {
    return input.querySelector("input:checked") || input.querySelector("input");
  }
  return input;
}

function updateChoiceClasses() {
  const inputs = authForm.querySelectorAll(".form-check-input-type");
  inputs.forEach((input) => {
    const label = authForm.querySelector('[for="' + input.id + '"]');

    if (input.checked) {
      label.classList.add("actived");

      const selector = input.closest(".account-type");
      const background = selector.querySelector(".selected-background");
      const options = selector.querySelectorAll(".form-check-input-type");
      if (input === options[1]) {
        background.classList.add("move");
      } else {
        background.classList.remove("move");
      }
    } else {
      label.classList.remove("actived");
    }

    if (input.matches(":focus-visible")) {
      label.classList.add("focused");
    } else {
      label.classList.remove("focused");
    }

    if (input.disabled) {
      label.classList.add("disabled");
    } else {
      label.classList.remove("disabled");
    }
  });
}

function createChoiceField(fieldName) {
  const field = fields[fieldName];
  const fieldId = field.id || fieldName;
  const fieldArea = document.createElement("fieldset");
  fieldArea.id = fieldId + "-input";
  fieldArea.className = "register-field register-choice-field";
  fieldArea.setAttribute("role", "radiogroup");
  fieldArea.setAttribute("aria-labelledby", fieldId + "-label");
  fieldArea.setAttribute("aria-describedby", fieldId + "-error");
  fieldArea.setAttribute("aria-required", String(field.required !== false));

  const legend = document.createElement("legend");
  legend.id = fieldId + "-label";
  legend.className = "form-choice-label";
  legend.textContent = field.label;
  fieldArea.appendChild(legend);

  const inputArea = document.createElement("div");
  inputArea.id = fieldId + "-input-area";
  inputArea.className = "account-type person-type";

  const background = document.createElement("span");
  background.className = "selected-background";
  background.setAttribute("aria-hidden", "true");
  inputArea.appendChild(background);

  const optionsArea = document.createElement("div");
  optionsArea.className = "account-options";

  field.options.forEach((option) => {
    const input = document.createElement("input");
    input.id = fieldId + "-input-" + option.value;
    input.name = field.requestName || fieldName;
    input.type = "radio";
    input.value = option.value;
    input.dataset.field = fieldName;
    input.checked = getFieldValue(fieldName) === option.value;
    input.required = field.required !== false;
    input.className = "form-check-input-type visually-hidden";
    input.setAttribute("aria-describedby", fieldId + "-error");

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.className = "form-check-label-type";
    label.textContent = option.label;

    optionsArea.appendChild(input);
    optionsArea.appendChild(label);
  });
  inputArea.appendChild(optionsArea);
  fieldArea.appendChild(inputArea);

  const errorElement = document.createElement("small");
  errorElement.id = fieldId + "-error";
  errorElement.className = "form-error text-danger d-none";
  errorElement.setAttribute("aria-live", "polite");
  if (fieldErrors[fieldName]) {
    fieldArea.setAttribute("aria-invalid", "true");
    inputArea.classList.add("border-danger");
    errorElement.textContent = fieldErrors[fieldName];
    errorElement.classList.remove("d-none");
  }
  fieldArea.appendChild(errorElement);

  return fieldArea;
}

function createField(fieldName) {
  const field = fields[fieldName];
  if (field.type === "radio") {
    return createChoiceField(fieldName);
  }
  const fieldId = field.id || fieldName;
  const fieldArea = document.createElement("div");
  fieldArea.className = "register-field";

  const label = document.createElement("label");
  label.className = "form-input-label";
  label.htmlFor = fieldId + "-input";

  let input;
  if (field.type === "select") {
    input = document.createElement("select");
    field.options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      input.appendChild(optionElement);
    });
  } else {
    input = document.createElement("input");
    input.type = field.type;
  }
  input.id = fieldId + "-input";
  input.name = field.requestName || fieldName;
  input.dataset.field = fieldName;
  input.required = field.required !== false;
  input.setAttribute("aria-describedby", fieldId + "-error");

  let inputArea;
  if (field.type === "checkbox") {
    input.checked = getFieldValue(fieldName);
    input.className = "form-check-input check-orange";
    if (field.link) {
      input.classList.add("register-terms-input");
      input.setAttribute("aria-label", field.label + " " + field.link.label);
      inputArea = document.createElement("div");
      inputArea.className = "register-terms-option";
      inputArea.appendChild(input);

      const text = document.createElement("div");
      text.className = "register-terms-text";
      label.className = "register-terms-label";
      label.textContent = field.label;
      text.appendChild(label);
      text.appendChild(document.createTextNode(" "));

      const link = document.createElement("a");
      link.className = "register-terms-link";
      link.textContent = field.link.label;
      link.href = field.link.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      text.appendChild(link);
      inputArea.appendChild(text);
    } else {
      label.className = "register-route-option";
      label.appendChild(input);
      label.appendChild(document.createTextNode(field.label));
      inputArea = label;
    }
  } else {
    label.textContent = field.label;
    input.className = "form-input";
    if (field.type === "select") {
      input.classList.add("form-select");
    }
    input.value = getFieldValue(fieldName);
    input.placeholder = field.placeholder || "";

    if (field.autocomplete) {
      input.autocomplete = field.autocomplete;
    }
    if (field.inputMode) {
      input.inputMode = field.inputMode;
    }
    if (field.minLength !== undefined) {
      input.minLength = field.minLength;
    }
    if (field.maxLength !== undefined) {
      input.maxLength = field.maxLength;
    }
    if (field.min !== undefined) {
      input.min = field.min;
    }
    if (field.max !== undefined) {
      input.max = field.max;
    }
    if (field.step !== undefined) {
      input.step = field.step;
    }

    inputArea = document.createElement("div");
    inputArea.className = "form-input-area";

    if (field.icon) {
      const icon = document.createElement("i");
      icon.className = "form-input-icon fa-solid " + field.icon;
      icon.setAttribute("aria-hidden", "true");
      inputArea.appendChild(icon);
    }

    inputArea.appendChild(input);
    fieldArea.appendChild(label);
  }

  inputArea.id = fieldId + "-input-area";
  fieldArea.appendChild(inputArea);

  const errorElement = document.createElement("small");
  errorElement.id = fieldId + "-error";
  errorElement.className = "form-error text-danger d-none";
  errorElement.setAttribute("aria-live", "polite");

  if (fieldErrors[fieldName]) {
    errorElement.textContent = fieldErrors[fieldName];
    errorElement.classList.remove("d-none");
    inputArea.classList.add("border-danger");
    input.setAttribute("aria-invalid", "true");
  }
  fieldArea.appendChild(errorElement);

  if (field.hint) {
    const hint = document.createElement("small");
    hint.id = fieldId + "-hint";
    hint.className = "form-input-hint";
    hint.textContent = field.hint;
    input.setAttribute("aria-describedby", fieldId + "-error " + hint.id);
    fieldArea.appendChild(hint);
  }

  return fieldArea;
}

function testStep(index) {
  saveStepValues();

  for (const fieldName of getStepFields(index)) {
    const fieldTest = fields[fieldName].test(getFieldValue(fieldName));
    if (!fieldTest.isValid) {
      setInputAreaError(fieldName, fieldTest.error);
      return false;
    }
    resetInputAreaError(fieldName);
  }
  return true;
}

function getRegisterData() {
  const registerData = { profileType };

  registerSteps.forEach((step, index) => {
    getStepFields(index).forEach((fieldName) => {
      const field = fields[fieldName];
      if (field.send === false) {
        return;
      }

      const fieldTest = field.test(getFieldValue(fieldName));
      const requestName = field.requestName || fieldName;
      registerData[requestName] = fieldTest.value;
    });
  });

  return registerData;
}

function resetSubmitButton() {
  isSubmitting = false;
  submitBtn.disabled = false;
  backBtn.disabled = false;
  submitBtn.classList.remove("disabled");

  profileInputs.forEach((input) => {
    input.disabled = false;
  });
  formElements.querySelectorAll("input, select").forEach((input) => {
    input.disabled = false;
  });

  if (currentStep === registerSteps.length - 1) {
    submitBtn.textContent = "Cadastrar";
  } else {
    submitBtn.textContent = "Continuar";
  }
  updateChoiceClasses();
  updateScrollHint();
}

function updateScrollHint() {
  const remainingScroll = authForm.scrollHeight - authForm.clientHeight - authForm.scrollTop;
  if (!authForm.hidden && authForm.clientHeight > 0 && remainingScroll > 2) {
    formScrollHint.classList.remove("d-none");
  } else {
    formScrollHint.classList.add("d-none");
    if (document.activeElement === formScrollHint && !authForm.hidden && !submitBtn.disabled) {
      submitBtn.focus({ preventScroll: true });
    }
  }
}

function formScrollHintClick() {
  let behavior = "smooth";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    behavior = "auto";
  }
  authForm.scrollBy({
    top: Math.max(120, authForm.clientHeight * 0.75),
    behavior
  });
}

function setInputAreaError(fieldName, message) {
  let fieldStep = -1;

  registerSteps.forEach((step, index) => {
    if (getStepFields(index).includes(fieldName)) {
      fieldStep = index;
    }
  });

  if (fieldStep === -1) {
    registerError.textContent = message;
    registerError.hidden = false;
    return;
  }

  fieldErrors[fieldName] = message;
  if (fieldStep !== currentStep) {
    showStep(fieldStep);
  }

  const fieldId = fields[fieldName].id || fieldName;
  const inputArea = document.getElementById(fieldId + "-input-area");
  const errorElement = document.getElementById(fieldId + "-error");
  const input = getFieldInput(fieldName);

  errorElement.textContent = message;
  errorElement.classList.remove("d-none");
  inputArea.classList.add("border-danger");
  document.getElementById(fieldId + "-input").setAttribute("aria-invalid", "true");
  input.setAttribute("aria-invalid", "true");
  input.focus();
  updateChoiceClasses();
}

function resetInputAreaError(fieldName) {
  delete fieldErrors[fieldName];

  if (!fields[fieldName]) {
    return;
  }

  const fieldId = fields[fieldName].id || fieldName;
  const inputArea = document.getElementById(fieldId + "-input-area");
  if (inputArea) {
    const errorElement = document.getElementById(fieldId + "-error");
    errorElement.textContent = "";
    errorElement.classList.add("d-none");
    inputArea.classList.remove("border-danger");
    document.getElementById(fieldId + "-input").removeAttribute("aria-invalid");
    getFieldInput(fieldName).removeAttribute("aria-invalid");
    updateChoiceClasses();
  }
}

function resetRegisterError() {
  registerError.hidden = true;
  registerError.textContent = "";
}

function showStep(index) {
  saveStepValues();
  currentStep = index;
  formElements.innerHTML = "";

  const step = document.createElement("section");
  step.className = "register-step";
  step.dataset.step = currentStep;
  step.setAttribute("aria-label", "Etapa " + (currentStep + 1) + " de " + registerSteps.length);

  getStepFields(currentStep).forEach((fieldName) => {
    step.appendChild(createField(fieldName));
  });
  formElements.appendChild(step);

  accountType.hidden = currentStep !== 0;
  backBtn.hidden = currentStep === 0;

  if (currentStep === registerSteps.length - 1) {
    submitBtn.textContent = "Cadastrar";
  } else {
    submitBtn.textContent = "Continuar";
  }

  authForm.scrollTop = 0;
  resetRegisterError();
  updateChoiceClasses();
  updateScrollHint();
}

function updateProfile() {
  profileType = authForm.elements.profileType.value;
  registerSteps = stepsByProfile[profileType];

  showStep(0);
}

function updatePersonType() {
  saveStepValues();
  resetInputAreaError("personType");

  const step = formElements.querySelector(".register-step");
  const personTypeField = document.getElementById("personType-input");
  const currentFields = step.querySelectorAll(".register-field");

  // Mantém o seletor na tela para o fundo laranja continuar animando.
  currentFields.forEach((field) => {
    if (field !== personTypeField) {
      field.remove();
    }
  });

  let afterPersonType = false;
  getStepFields(currentStep).forEach((fieldName) => {
    if (fieldName === "personType") {
      afterPersonType = true;
    } else {
      const field = createField(fieldName);
      if (afterPersonType) {
        step.appendChild(field);
      } else {
        step.insertBefore(field, personTypeField);
      }
    }
  });

  resetRegisterError();
  updateChoiceClasses();
  getFieldInput("personType").focus();
  updateScrollHint();
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits === "") {
    return "";
  }
  if (digits.length <= 2) {
    return "(" + digits;
  }
  if (digits.length <= 6) {
    return "(" + digits.slice(0, 2) + ") " + digits.slice(2);
  }
  if (digits.length <= 10) {
    return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
  }
  return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
}

function formatCpf(value) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCnhNumber(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatCnpj(value) {
  const characters = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);
  let cnpj = characters.slice(0, 2);
  if (characters.length > 2) {
    cnpj += "." + characters.slice(2, 5);
  }
  if (characters.length > 5) {
    cnpj += "." + characters.slice(5, 8);
  }
  if (characters.length > 8) {
    cnpj += "/" + characters.slice(8, 12);
  }
  if (characters.length > 12) {
    cnpj += "-" + characters.slice(12, 14);
  }
  return cnpj;
}

function formatPlate(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

function focusFirstInput() {
  const input = formElements.querySelector("input:checked, input:not([type='radio']), select");
  if (input) {
    input.focus();
  }
}

// Monta os campos do perfil selecionado
updateProfile();

const scrollObserver = new ResizeObserver(updateScrollHint);
scrollObserver.observe(authForm);
scrollObserver.observe(formElements);
scrollObserver.observe(registerError);
scrollObserver.observe(submitBtn);

// Os eventos ficam no container porque os inputs são recriados
authForm.addEventListener("scroll", updateScrollHint);
formScrollHint.addEventListener("click", formScrollHintClick);
authForm.addEventListener("focusin", updateChoiceClasses);
authForm.addEventListener("focusout", updateChoiceClasses);
authForm.addEventListener("keyup", updateChoiceClasses);
authForm.addEventListener("click", updateChoiceClasses);

formElements.addEventListener("input", (e) => {
  const input = e.target;
  const fieldName = input.dataset.field;
  if (!fieldName) {
    return;
  }

  if (fields[fieldName].format) {
    input.value = fields[fieldName].format(input.value);
  }

  saveStepValues();
  resetInputAreaError(fieldName);
  if (fieldName === "password") {
    resetInputAreaError("confirmPassword");
  }
  resetRegisterError();
});

formElements.addEventListener("change", (e) => {
  if (e.target.dataset.field === "personType") {
    updatePersonType();
  } else {
    saveStepValues();
  }
});

profileInputs.forEach((input) => {
  input.addEventListener("change", updateProfile);
});

backBtn.addEventListener("click", () => {
  if (!isSubmitting && currentStep > 0) {
    showStep(currentStep - 1);
    focusFirstInput();
  }
});

// Só envia quando a última etapa e todos os campos estiverem válidos
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) {
    return;
  }
  if (!testStep(currentStep)) {
    return;
  }
  if (currentStep < registerSteps.length - 1) {
    showStep(currentStep + 1);
    focusFirstInput();
    return;
  }

  for (let index = 0; index < registerSteps.length; index++) {
    if (!testStep(index)) {
      return;
    }
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const registerData = getRegisterData();
  resetRegisterError();
  isSubmitting = true;
  submitBtn.disabled = true;
  backBtn.disabled = true;
  submitBtn.classList.add("disabled");
  submitBtn.innerHTML =
    '<i class="loading-icon fa-solid fa-spinner"></i> Cadastrando...';

  profileInputs.forEach((input) => {
    input.disabled = true;
  });
  formElements.querySelectorAll("input, select").forEach((input) => {
    input.disabled = true;
  });
  updateChoiceClasses();

  try {
    await sleep(1000);
    const result = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: registerData,
      }),
      signal: AbortSignal.timeout(AUTH_REQUEST_TIMEOUT),
    });

    const resultjson = await result.json();
    if (!result.ok || resultjson.status !== "success") {
      resetSubmitButton();
      const emailErrorTypes = ["already_registered", "invalid_email"];
      if (emailErrorTypes.includes(resultjson.errtype)) {
        setInputAreaError("email", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_name") {
        setInputAreaError("name", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_birth_date") {
        setInputAreaError("birthDate", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_phone") {
        setInputAreaError("phone", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_password") {
        setInputAreaError("password", resultjson.message);
        return;
      }
      if (resultjson.errtype === "terms_not_accepted") {
        setInputAreaError("acceptedTerms", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_person_type") {
        setInputAreaError("personType", resultjson.message);
        return;
      }
      const cpfErrorTypes = ["invalid_cpf", "cpf_already_registered"];
      if (cpfErrorTypes.includes(resultjson.errtype)) {
        setInputAreaError("cpf", resultjson.message);
        return;
      }
      const cnhNumberErrorTypes = ["invalid_cnh_number", "cnh_already_registered"];
      if (cnhNumberErrorTypes.includes(resultjson.errtype)) {
        setInputAreaError("cnhNumber", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_cnh_category") {
        setInputAreaError("cnhCategory", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_cnh_expiration") {
        setInputAreaError("cnhExpiration", resultjson.message);
        return;
      }
      const cnpjErrorTypes = ["invalid_cnpj", "cnpj_already_registered"];
      if (cnpjErrorTypes.includes(resultjson.errtype)) {
        setInputAreaError("cnpj", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_company_name") {
        setInputAreaError("companyName", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_vehicle_type") {
        setInputAreaError("vehicleType", resultjson.message);
        return;
      }
      const plateErrorTypes = ["invalid_plate", "plate_already_registered"];
      if (plateErrorTypes.includes(resultjson.errtype)) {
        setInputAreaError("plate", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_brand") {
        setInputAreaError("brand", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_model") {
        setInputAreaError("model", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_year") {
        setInputAreaError("year", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_color") {
        setInputAreaError("color", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_capacity") {
        setInputAreaError("capacity", resultjson.message);
        return;
      }
      if (resultjson.errtype === "invalid_interstate") {
        setInputAreaError("interstate", resultjson.message);
        return;
      }

      registerError.textContent =
        resultjson.message || "Não foi possível confirmar o cadastro. Tente novamente mais tarde.";
      registerError.hidden = false;
      return;
    }

    const formTitle = document.querySelector(".form-title");
    const formDescription = document.querySelector(".form-description");
    const successMessage = document.getElementById("success-auth");

    formTitle.textContent = "Conta criada!";
    formDescription.textContent = "Agora você pode entrar na sua conta.";
    authForm.hidden = true;
    updateScrollHint();
    successMessage.classList.remove("d-none");

    formElements.innerHTML = "";
    Object.keys(formValues).forEach((fieldName) => {
      delete formValues[fieldName];
    });
    Object.keys(fieldErrors).forEach((fieldName) => {
      delete fieldErrors[fieldName];
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      registerError.textContent =
        "A confirmação do cadastro demorou demais. Tente entrar ou envie o cadastro novamente.";
    } else {
      registerError.textContent =
        "Não foi possível concluir o cadastro. Tente novamente em instantes.";
    }
    registerError.hidden = false;
  } finally {
    resetSubmitButton();
  }
});
