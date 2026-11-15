(() => {
  const pageId = document.body?.getAttribute("page");

  if (pageId == "home") {
    // So define e executa o código abaixo caso o <body> tenha (page = "body")
    // exemplo <body page="home"> usado em index.ejs

    const loginButton = document.getElementById("login-btn");
    const registerButton = document.getElementById("register-btn");

    if (loginButton) {
      loginButton.addEventListener("click", () => {
        window.location.href = "/login";
      });
    }

    if (registerButton) {
      registerButton.addEventListener("click", () => {
        window.location.href = "/register";
      });
    }
  }
})();

const formSimular = document.getElementById('simular-f');
if (formSimular) {
  formSimular.addEventListener('submit', async (simular) => {
    simular.preventDefault();

    console.log("Formulario Enviado!");

    const ceps = new FormData(formSimular);
    const dados = await fetch('/fretes/simular', {
      method: 'POST',
      body: new URLSearchParams(ceps)
    });

    const resultado = await dados.json();

    const distancia = resultado.distancia;
    const preco = resultado.preco;

    document.getElementById('resultado').innerHTML = `<p>Distância: ${distancia} km. Valor Final do Frete: ${preco}</p>`;
  });
}
