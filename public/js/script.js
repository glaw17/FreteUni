(() => {
  const pageId = document.body?.getAttribute("page");

  if (pageId == "home") {
    // So define e executa o código abaixo caso o <body> tenha (page = "body")
    // exemplo <body page="home"> usado em index.ejs

    // Obtem o valor da caixa de texto search-input, verifica se esta com algum valor e redireciona pra página de rastreamento (tlvz pedir cpf la)
    document.getElementById("track-btn").addEventListener("click", () => {
      const searchInput = document.getElementById("search-input");
      const searchId = searchInput.value.trim();
      if (searchId) {
        searchInput.value = "";
        window.location.href = `/rastrear?id=${encodeURIComponent(searchId)}`;
      }
    });

    document.getElementById("login-btn").addEventListener("click", () => {
      window.location.href = "/login";
    });

    document.getElementById("register-btn").addEventListener("click", () => {
      window.location.href = "/register";
    });
  }
})();

const formSimular = document.getElementById('simular-f');
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
})