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
  } else if (pageId == "easter-egg") {
    const videoLink = document.getElementById("video-link");
    if (videoLink) {
      videoLink.addEventListener("click", (e) => {
        e.preventDefault();
        const heroContent =  document.getElementById("hero-content");
        heroContent.style.display = "none";
        const video =  document.getElementById("easter-egg-video");
        video.style.filter = "blur(0px)";
        video.play();
      });
    }
  }
})();

const formSimular = document.getElementById('simular-f');
if (formSimular) {
  formSimular.addEventListener('submit', async (simular) => {
    simular.preventDefault();

    const cepOrigem = document.querySelector('[name=cepOrigem]').value;
    const cepDestino = document.querySelector('[name=cepDestino]').value;
    const botao = document.getElementById('botaoEnv');
    botao.disable= true;

    //Debug
    console.log(`${cepOrigem}`);
    console.log(`${cepDestino}`);

    if (!cepOrigem || !cepDestino) {
      return alert("Cep de origem e destino são obrigatórios.");
    }
    const reCEP = /^\d{5}-?\d{3}$/;
    if (!reCEP.test(cepOrigem) || !reCEP.test(cepDestino)){
      return alert("CEP Inválido!");
    }

    if (cepOrigem.length !== 8 || cepDestino.length !== 8) {
      return alert("Cep de origem e destino devem ter 8 dígitos.");
    }

    console.log("Formulario Enviado!");

    const dados = await fetch('/fretes/simular', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cepOrigem,
        cepDestino
      })
    });

    const resultado = await dados.json();

    if(resultado === null){
      return alert("ERRO ao Consultar CEPs");
    }

    if(!resultado.ok && resultado.status == "error"){
      const message = document.getElementById('messageERRO');
      if(message && message.classList.includes("d-none")){
        message.classList.remove('d-none');
        message.classList.add('d-flex');
      }
      message.innerHTML = resultado.message;
      botao.disable= false;
      return;
    }

    const distancia = resultado.distancia;
    const preco = resultado.preco;

    document.getElementById('resultado').innerHTML = `<p>Distância: ${distancia} km. Valor Final do Frete: ${preco}</p>`;
    botao.disable= false;
  });
}
