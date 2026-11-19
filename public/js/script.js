(() => {
  const pageId = document.body?.getAttribute("page");

  if (pageId == "home") {
    const formSimular = document.getElementById("simular-f");
    if (formSimular) {
      const origemInput = document.getElementById("cep-origem");
      const destinoInput = document.getElementById("cep-destino");
      const botao = document.getElementById("botaoEnv");
      const mensagemErro = document.getElementById("messageERRO");
      const resultado = document.getElementById("resultado");
      const regexCEP = /^\d{8}$/;
      const formatoPreco = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      const formatoDistancia = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      function limparMensagens() {
        mensagemErro.textContent = "";
        resultado.textContent = "";
      }

      for (const input of [origemInput, destinoInput]) {
        input.addEventListener("input", () => {
          input.removeAttribute("aria-invalid");
          limparMensagens();
        });
      }

      formSimular.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (botao.disabled) {
          return;
        }

        limparMensagens();

        for (const input of [origemInput, destinoInput]) {
          input.removeAttribute("aria-invalid");
        }

        for (const input of [origemInput, destinoInput]) {
          if (input.value.length !== 8 || !regexCEP.test(input.value)) {
            mensagemErro.textContent =
              input === origemInput
                ? "Informe um CEP de origem com 8 dígitos."
                : "Informe um CEP de destino com 8 dígitos.";
            input.setAttribute("aria-invalid", "true");
            input.focus();
            return;
          }
        }

        const cepOrigem = origemInput.value;
        const cepDestino = destinoInput.value;

        botao.disabled = true;
        botao.classList.add("disabled");
        botao.value = "Calculando...";
        origemInput.disabled = true;
        destinoInput.disabled = true;
        formSimular.setAttribute("aria-busy", "true");

        try {
          const dados = await fetch("/fretes/simular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cepOrigem, cepDestino }),
            signal: AbortSignal.timeout(15000),
          });

          let resposta;
          try {
            resposta = await dados.json();
          } catch (error) {
            if (error.name === "TimeoutError" || error.name === "AbortError") {
              throw error;
            }
            throw new Error(
              "O servidor retornou uma resposta inválida. Tente novamente.",
            );
          }

          if (!dados.ok || resposta?.status === "error") {
            mensagemErro.textContent =
              typeof resposta?.message === "string"
                ? resposta.message
                : "Não foi possível calcular o frete. Tente novamente.";
            return;
          }

          const distancia = resposta?.distancia;
          const valor = resposta?.preco;
          const preco =
            typeof valor === "string" && /^\d+(\.\d{1,2})?$/.test(valor)
              ? Number(valor)
              : valor;

          if (
            !Number.isFinite(distancia) ||
            distancia < 0 ||
            !Number.isFinite(preco) ||
            preco < 0
          ) {
            throw new Error(
              "O servidor retornou um cálculo inválido. Tente novamente.",
            );
          }

          resultado.textContent = `Distância estimada: ${formatoDistancia.format(distancia)} km. Valor estimado do frete: ${formatoPreco.format(preco)}.`;
        } catch (error) {
          if (error.name === "TimeoutError" || error.name === "AbortError") {
            mensagemErro.textContent =
              "O cálculo demorou demais. Tente novamente.";
          } else if (error instanceof TypeError) {
            mensagemErro.textContent =
              "Não foi possível conectar ao servidor. Tente novamente.";
          } else {
            mensagemErro.textContent =
              error.message || "Não foi possível calcular o frete.";
          }
        } finally {
          botao.disabled = false;
          botao.classList.remove("disabled");
          botao.value = "Calcular";
          origemInput.disabled = false;
          destinoInput.disabled = false;
          formSimular.removeAttribute("aria-busy");
        }
      });
    }
  } else if (pageId == "easter-egg") {
    const videoLink = document.getElementById("video-link");
    if (videoLink) {
      videoLink.addEventListener("click", (e) => {
        e.preventDefault();
        const heroContent = document.getElementById("hero-content");
        heroContent.style.display = "none";
        const video = document.getElementById("easter-egg-video");
        video.style.filter = "blur(0px)";
        video.play();
      });
    }
  }
})();
