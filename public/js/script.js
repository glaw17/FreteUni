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
