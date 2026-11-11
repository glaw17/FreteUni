import { regexEmail, createAuthButtonToPage } from "./utils.js";

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const emailInputArea = document.getElementById("email-input-area");
const passwordInputArea = document.getElementById("password-input-area");

const rememberInput = document.getElementById("rememberMe");
const passwordViewIcon = document.getElementById("password-view");
const forgetPasswordLink = document.getElementById("forget-password");

const submitBtn = document.getElementById("submitBtn");

function testEmail() {
  const email = emailInput.value.trim();
  if (email === "") {
    return { isValid: false, error: "O email é obrigatório." };
  }
  if (!regexEmail.test(email)) {
    return { isValid: false, error: "Por favor, insira um email válido." };
  }
  emailError.classList.add("d-none");
  emailInputArea.classList.remove("border-danger");
  return { isValid: true, error: null, email };
}

function testPassword() {
  const password = passwordInput.value.trim();
  if (password === "") {
    return { isValid: false, error: "A senha é obrigatória." };
  }
  if (password.length < 8) {
    return {
      isValid: false,
      error: "A senha deve ter pelo menos 8 caracteres.",
    };
  }
  passwordError.classList.add("d-none");
  passwordInputArea.classList.remove("border-danger");
  return { isValid: true, error: null, password };
}

function resetNavbarButtons() {
  const authArea = document.querySelector(".navbar-auth");
  if (authArea) {
    authArea.innerHTML = "";
    authArea.appendChild(createAuthButtonToPage("register", "/register"));
  }
}

function forgotPasswordClick() {
  alert("não implementei ainda!");
}

function passwordViewClick() {
  if (passwordInput) {
    if (passwordInput.getAttribute("type") === "password") {
      passwordInput.setAttribute("type", "text");
    } else {
      // Poderia usar ternário? claro! Pq eu n sei? pq alguém pode n entender
      passwordInput.setAttribute("type", "password");
    }
  }
}

function resetSubmitButton() {
  submitBtn.classList.remove("disabled");
  submitBtn.innerHTML = "Entrar";
}

function setInputAreaError(inputArea, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove("d-none");
  inputArea.classList.add("border-danger");
}

// Recarrega os botões da navbar
resetNavbarButtons();

// Adiciona eventos aos elementos
passwordViewIcon.addEventListener("click", passwordViewClick);
forgetPasswordLink.addEventListener("click", forgotPasswordClick);

emailInput.addEventListener("input", () => {
  if (!emailError.classList.contains("d-none")) {
    emailError.innerHTML = "";
    emailError.classList.remove("d-none");
  }
  if (emailInputArea.classList.contains("border-danger")) {
    emailInputArea.classList.remove("border-danger");
  }
});

// Adiciona logica de envio ao clicar no botão de submit
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  submitBtn.classList.add("disabled");
  submitBtn.innerHTML =
    '<i class="loading-icon fa-solid fa-spinner"></i> Entrando...';
  await sleep(1000);

  // Verificações pra email
  const emailTest = testEmail();
  if (!emailTest.isValid) {
    setInputAreaError(emailInputArea, emailError, emailTest.error);
    resetSubmitButton();
    return;
  }

  // Verificações pra senha
  const passwordTest = testPassword();
  if (!passwordTest.isValid) {
    setInputAreaError(passwordInputArea, passwordError, passwordTest.error);
    resetSubmitButton();
    return;
  }

  const result = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailTest.email,
      password: passwordTest.password
    }),
  });

  const resultjson = await result.json();
  if (resultjson.status === "error") {
    let emailErroTypes = ["missing_fields", "already_registered", "invalid_email"];
    if (emailErroTypes.includes(resultjson.errtype)) {
      setInputAreaError(emailInputArea, emailError, resultjson.message);
      resetSubmitButton();
      return;
    }
    let passwordErroTypes = ["invalid_password", "invalid_credentials"];
    if (passwordErroTypes.includes(resultjson.errtype)) {
      setInputAreaError(passwordInputArea, passwordError, resultjson.message);
      resetSubmitButton();
      return;
    }
    setInputAreaError(emailInputArea, emailError, "Erro ao tentar fazer login.");
    setInputAreaError(passwordInputArea, passwordError, "Erro ao tentar fazer login.");
    resetSubmitButton();
    return;
  }

  const formTitle = document.querySelector(".form-title");
  const formDescription = document.querySelector(".form-description");
  const successMessage = document.getElementById("success-auth");
  const authForm = document.getElementById("auth-form");
  const alternativeLogins = document.getElementById("alternative-logins");

  formTitle.textContent = "Login realizado com sucesso!";
  formDescription.textContent =
    "Você será redirecionado para a página principal.";

  authForm.innerHTML = "";
  alternativeLogins.innerHTML = "";
  successMessage.classList.remove("d-none");

  for (let count = 0; count < 10; count++) {
    const steps = (count % 5) + 1;
    successMessage.textContent = "Redirecionando" + ".".repeat(steps);
    await sleep(300);
  }
  window.location.href = "/";
});
