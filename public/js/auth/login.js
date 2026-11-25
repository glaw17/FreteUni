import { regexEmail, AUTH_REQUEST_TIMEOUT } from "./utils.js";

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const formError = document.getElementById("form-error");
const emailInputArea = document.getElementById("email-input-area");
const passwordInputArea = document.getElementById("password-input-area");

const rememberInput = document.getElementById("rememberMe");
const passwordViewButton = document.getElementById("password-view");

const authForm = document.getElementById("auth-form");
const submitBtn = document.getElementById("submitBtn");
let isSubmitting = false;

function testEmail() {
  const email = emailInput.value.trim();
  if (email === "") {
    return { isValid: false, error: "O email é obrigatório." };
  }
  if (!regexEmail.test(email)) {
    return { isValid: false, error: "Por favor, insira um email válido." };
  }
  resetInputAreaError(emailInput, emailInputArea, emailError);
  return { isValid: true, error: null, email };
}

function testPassword() {
  const password = passwordInput.value;
  if (password === "") {
    return { isValid: false, error: "A senha é obrigatória." };
  }
  if (password.length < 8) {
    return {
      isValid: false,
      error: "A senha deve ter pelo menos 8 caracteres.",
    };
  }
  if (new TextEncoder().encode(password).length > 72) {
    return {
      isValid: false,
      error: "A senha é muito longa. Reduza a quantidade de caracteres.",
    };
  }
  resetInputAreaError(passwordInput, passwordInputArea, passwordError);
  return { isValid: true, error: null, password };
}

function passwordViewClick() {
  if (passwordInput.getAttribute("type") === "password") {
    passwordInput.setAttribute("type", "text");
    passwordViewButton.setAttribute("aria-pressed", "true");
  } else {
    passwordInput.setAttribute("type", "password");
    passwordViewButton.setAttribute("aria-pressed", "false");
  }
}

function resetSubmitButton() {
  isSubmitting = false;
  submitBtn.disabled = false;
  submitBtn.classList.remove("disabled");
  submitBtn.innerHTML = "Entrar";
}

function setInputAreaError(input, inputArea, errorElement, message) {
  errorElement.textContent = message;
  inputArea.classList.add("border-danger");
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function resetInputAreaError(input, inputArea, errorElement) {
  errorElement.textContent = "";
  inputArea.classList.remove("border-danger");
  input.removeAttribute("aria-invalid");
}

function setFormError(message) {
  formError.textContent = message;
  formError.classList.remove("d-none");
}

function resetFormError() {
  formError.textContent = "";
  formError.classList.add("d-none");
}

// Adiciona eventos aos elementos
passwordViewButton.addEventListener("click", passwordViewClick);

emailInput.addEventListener("input", () => {
  resetInputAreaError(emailInput, emailInputArea, emailError);
  resetFormError();
});

passwordInput.addEventListener("input", () => {
  resetInputAreaError(passwordInput, passwordInputArea, passwordError);
  resetFormError();
});

// Envia o formulário pelo botão ou pelo Enter.
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) {
    return;
  }
  resetFormError();

  // Verificações pra email
  const emailTest = testEmail();
  if (!emailTest.isValid) {
    setInputAreaError(emailInput, emailInputArea, emailError, emailTest.error);
    resetSubmitButton();
    return;
  }

  // Verificações pra senha
  const passwordTest = testPassword();
  if (!passwordTest.isValid) {
    setInputAreaError(passwordInput, passwordInputArea, passwordError, passwordTest.error);
    resetSubmitButton();
    return;
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.classList.add("disabled");
  submitBtn.innerHTML =
    '<i class="loading-icon fa-solid fa-spinner"></i> Entrando...';

  try {
    await sleep(1000);
    const result = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailTest.email,
        password: passwordTest.password,
        rememberMe: rememberInput.checked,
      }),
      signal: AbortSignal.timeout(AUTH_REQUEST_TIMEOUT),
    });

    const resultjson = await result.json();
    if (!result.ok || resultjson.status !== "success") {
      let emailErroTypes = [
        "not_registered",
        "invalid_email",
      ];
      if (emailErroTypes.includes(resultjson.errtype)) {
        setInputAreaError(emailInput, emailInputArea, emailError, resultjson.message);
        return;
      }
      let passwordErroTypes = ["invalid_password"];
      if (passwordErroTypes.includes(resultjson.errtype)) {
        setInputAreaError(passwordInput, passwordInputArea, passwordError, resultjson.message);
        return;
      }
      setFormError(
        resultjson.message || "Erro ao tentar fazer login.",
      );
      return;
    }

    const formTitle = document.querySelector(".form-title");
    const formDescription = document.querySelector(".form-description");
    const successMessage = document.getElementById("success-auth");
    const alternativeLogins = document.getElementById("alternative-logins");

    formTitle.textContent = "Login realizado com sucesso!";
    formDescription.textContent =
      "Você será redirecionado para a página principal.";

    authForm.hidden = true;
    authForm.innerHTML = "";
    alternativeLogins.innerHTML = "";
    successMessage.classList.remove("d-none");

    for (let count = 0; count < 10; count++) {
      const steps = (count % 5) + 1;
      successMessage.textContent = "Redirecionando" + ".".repeat(steps);
      await sleep(300);
    }
    window.location.href = "/";
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      setFormError("O login demorou demais. Tente novamente.");
    } else {
      setFormError(
        "Não foi possível concluir o login. Tente novamente em instantes.",
      );
    }
  } finally {
    if (!authForm.hidden) {
      resetSubmitButton();
    }
  }
});
