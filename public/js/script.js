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
  } else if (pageId == "contract") {
    const formContract = document.getElementById("form-C");
    const modalConfirm = document.getElementById("modal-confirm");

    if (formContract && modalConfirm) {
      formContract.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("nome").value.trim();
        if (name.length < 3) {
          return alert("O nome precisa possuir pelo menos 3 caracteres!");
        }

        const cpf = document.getElementById("cpf").value;
        if (!cpf || !/^\d{11}$/.test(cpf)) {
          return alert("Informe um CPF com 11 dígitos.");
        }

        const telefone = document.getElementById("telefone").value;
        if (!telefone || !/^\d{11}$/.test(telefone)) {
          return alert("Informe um telefone com DDD e 11 dígitos.");
        }

        const cepOrigem = document.getElementById("cep-origem").value;
        const cepDestino = document.getElementById("cep-destino").value;
        const regexCEP = /^\d{8}$/;
        if (!regexCEP.test(cepOrigem) || !regexCEP.test(cepDestino)) {
          return alert("Os CEPs de origem e destino devem ter 8 dígitos.");
        }

        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;
        if (!data || !hora) {
          return alert("Informe a data e o horário do frete!");
        }

        const frete = new Date(`${data}T${hora}`);
        const agora = new Date();
        const limite = new Date();
        limite.setFullYear(limite.getFullYear() + 1);

        if (Number.isNaN(frete.getTime())) {
          return alert("Informe uma data e um horário válidos.");
        }
        if (frete < agora) {
          return alert("O frete não pode ser agendado para o passado!");
        }
        if (frete > limite) {
          return alert("O frete não pode ser agendado para mais de 1 ano!");
        }

        const opcaoAjudantes = document.querySelector('input[name="ajudantes"]:checked');
        const ajudantes = Number(opcaoAjudantes?.value);
        if (!opcaoAjudantes || !Number.isInteger(ajudantes) || ajudantes < 0 || ajudantes > 2) {
          return alert("Selecione de 0 a 2 ajudantes.");
        }

        try {
          const dados = await fetch("/fretes/simular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cepOrigem, cepDestino }),
            signal: AbortSignal.timeout(15000),
          });

          const resultado = await dados.json();
          if (!dados.ok || resultado?.status === "error") {
            return alert(
              typeof resultado?.message === "string"
                ? resultado.message
                : "Não foi possível calcular o frete. Tente novamente.",
            );
          }

          const distancia = resultado?.distancia;
          const valor = resultado?.preco;
          const preco =
            typeof valor === "string" && /^\d+(\.\d{1,2})?$/.test(valor)
              ? Number(valor)
              : valor;
          if (!Number.isFinite(distancia) || distancia < 0 || !Number.isFinite(preco) || preco < 0) {
            return alert("O servidor retornou um cálculo inválido. Tente novamente.");
          }

          // A consulta acima calcula o frete sem ajudantes; eles entram no total abaixo.
          const precoAjudantes = 60 * ajudantes;
          const precoTotal = preco + precoAjudantes;

          document.getElementById("distancia").textContent = `${distancia} km`;
          document.getElementById("valorAjudantes").textContent = `R$ ${precoAjudantes.toFixed(2)}`;
          document.getElementById("subtotal").textContent = `R$ ${preco.toFixed(2)}`;
          document.getElementById("total").textContent = `R$ ${precoTotal.toFixed(2)}`;
          modalConfirm.showModal();
        } catch (error) {
          if (error.name === "TimeoutError" || error.name === "AbortError") {
            alert("O cálculo demorou demais. Tente novamente.");
          } else {
            alert("Não foi possível calcular o frete. Tente novamente.");
          }
        }
      });

      const botaoCancel = document.getElementById("cancel");
      const botaoConfirm = document.getElementById("confirm");
      const obrigado = document.getElementById("modal-agradecimento");
      const fechar = document.getElementById("close");

      if (botaoCancel) {
        botaoCancel.addEventListener("click", () => {
          modalConfirm.close();
          alert("Contrato Cancelado!");
        });
      }

      if (botaoConfirm && obrigado) {
        botaoConfirm.addEventListener("click", () => {
          modalConfirm.close();
          obrigado.showModal();
        });
      }

      if (fechar && obrigado) {
        fechar.addEventListener("click", () => {
          obrigado.close();
          window.location.href = "/";
        });
      }
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
