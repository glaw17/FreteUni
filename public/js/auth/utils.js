const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function createAuthButtonToPage(selectedPage, redirect) {
  // cria um botão padrão apra ser usado em ambas as páginas
  const button = document.createElement("button");
  button.style.minWidth = "100px";
  button.classList.add("btn", "btn-orange");
  button.addEventListener("click", () => {
    window.location.href = redirect || "/";
  });

  switch (selectedPage) {
    case "login":
      button.textContent = "Entrar";
      break;
    case "register":
      button.textContent = "Criar conta";
      break;
    default:
      button.textContent = "Página desconhecida";
  }

  return button;
}

export { regexEmail, createAuthButtonToPage };
