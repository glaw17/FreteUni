import { regexEmail, createAuthButtonToPage } from "./utils.js";

let profileType = "BUYER";

const authArea = document.querySelector(".navbar-auth");
if (authArea) {
  authArea.innerHTML = "";
  authArea.appendChild(createAuthButtonToPage("login", "/login"));
}

function switchFormElements(type) {
  const formElements = document.getElementById("form-elements");
  formElements.innerHTML = "";

  const inputName = document.createElement("div");
  inputName.id = "name-input-area";
  inputName.className = "form-input-area";
  inputName.innerHTML = `
    <i class="form-input-icon fa-solid fa-user"></i>
    <input
      class="form-input"
      type="text"
      placeholder="Digite seu nome completo"
      id="name-input"
    />
  `;

  const inputEmail = document.createElement("div");
  inputEmail.id = "email-input-area";
  inputEmail.className = "form-input-area";
  inputEmail.innerHTML = `
    <i class="form-input-icon fa-solid fa-envelope"></i>
    <input
      class="form-input"
      type="email"
      placeholder="Digite seu melhor email"
      id="email-input"
    />
  `;

  const inputNumber = document.createElement("div");
  inputNumber.id = "phone-input-area";
  inputNumber.className = "form-input-area";
  inputNumber.innerHTML = `
    <i class="form-input-icon fa-solid fa-phone"></i>
    <input
      class="form-input"
      type="tel"
      inputmode="numeric"
      placeholder="(00) 00000-0000"
      id="phone-input"
      maxlength="15"
    />
  `;
  inputNumber.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      phoneInput.value = digits ? `(${digits}` : "";
    } else if (digits.length <= 6) {
      phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
  });

  const inputPassword = document.createElement("div");
  inputPassword.id = "password-input-area";
  inputPassword.className = "form-input-area";
  inputPassword.innerHTML = `
    <i class="form-input-icon fa-solid fa-lock"></i>
    <input
      class="form-input"
      type="password"
      placeholder="Crie uma senha segura"
      id="password-input"
    />
  `;

  formElements.appendChild(inputName);
  formElements.appendChild(inputEmail);
  formElements.appendChild(inputNumber);
  formElements.appendChild(inputPassword);

  if (type === "BUYER") {
    // Implementation for buyer form elements
  } else if (type === "DRIVER") {
    const inputCpf = document.createElement("div");
    inputCpf.id = "cpf-input-area";
    inputCpf.className = "form-input-area";
    inputCpf.innerHTML = `
    <i class="form-input-icon fa-solid fa-id-card"></i>
    <input
      class="form-input"
      type="text"
      placeholder="Digite seu CPF"
      id="cpf-input"
    />
  `;
  formElements.appendChild(inputCpf);
  }
}

switchFormElements("BUYER");

const selectedTypeBackground = document.getElementById(
  "selected-type-background",
);
const accountTypes = document.querySelectorAll(".account-type");
const accountTypeTexts = document.querySelectorAll(".form-check-label-type");
accountTypes.forEach((accountType) => {
  accountType.addEventListener("click", (type) => {
    const target = type.target;
    const optionId = Number(target.getAttribute("option-id"));

    target.classList.add("actived");

    if (optionId === 0) {
      if (selectedTypeBackground.classList.contains("move")) {
        selectedTypeBackground.classList.remove("move");
      }
      accountTypeTexts[0].classList.add("actived");
      accountTypeTexts[1].classList.remove("actived");
      profileType = "BUYER";
      switchFormElements("BUYER");
    } else if (optionId === 1) {
      selectedTypeBackground.classList.add("move");
      accountTypeTexts[1].classList.add("actived");
      accountTypeTexts[0].classList.remove("actived");
      profileType = "DRIVER";
      switchFormElements("DRIVER");
    }
  });
});

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // Handle register logic here
});
