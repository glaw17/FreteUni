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

//JS da Página de Contrato
const formContract = document.getElementById('form-C');
const modal_confirm = document.getElementById('modal-confirm');
formContract.addEventListener('submit', async (envio) => {
  envio.preventDefault();

  //Verificação do Nome
  const name = document.getElementById('nome').value.trim();

  if(name.length < 3){
    return alert("O nome precisa possuir mais de 3 caracteres!");
  }
  if(!name || name === ''){
    return alert("Nome Inválido! Digite Novamente");
  }

  //Verificação do CPF
  const cpf = document.getElementById('cpf').value;

  if(!cpf){
    return alert("CPF Inválido! Digite Novamente");
  }
  if(cpf.length !== 11){
    return alert("CPF precisa ter 11 Algarismos!");
  }

  //Verficação do Telefone
  const telefone = document.getElementById('telefone').value;

  if(!telefone){
    return alert("Número de Telefone Inválido!");
  }
  if(telefone.length !== 11){
    return alert("Número de Telefone precisa ter 11 Algarismos!");
  }

  //Verificação dos CEPs (Reutilizado)
  const cepOrigem = document.getElementById('cep-origem').value;
  const cepDestino = document.getElementById('cep-destino').value;

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

  //Verificação de Data e Hora
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  if (!data || !hora) {
    return alert("Informe a data e o horário do frete!");
  }

  const frete = new Date(`${data}T${hora}`);
  const agora = new Date();

  const limite = new Date();
  limite.setFullYear(limite.getFullYear() + 2);

  if (frete < agora) {
    return alert("O frete não pode ser agendado para o passado!");
  }

  if (frete > limite) {
    return alert("O frete não pode ser agendado para mais de 2 anos!");
  }

  //Calculo para Confirmação (Reutilizado)
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
      return alert("ERRO ao Consultar CEPs");
    }

    const distancia = resultado.distancia;
    const preco = resultado.preco;
    const ajudantes = document.querySelector('input[name="ajudantes"]:checked').value;
    const precoTotal = Number(preco) + (60*Number(ajudantes));

    //Apresentando Valores no Modal
    document.getElementById('distancia').textContent = `${distancia} km`;
    document.getElementById('valorAjudantes').textContent = `R$ ${60 * Number(ajudantes)}`;
    document.getElementById('subtotal').textContent = `R$ ${preco}`;
    document.getElementById('total').textContent = `R$ ${precoTotal.toFixed(2)}`;

    modal_confirm.showModal();
});

const botaoCancel = document.getElementById('cancel');
botaoCancel.addEventListener('click', ()=>{
    modal_confirm.close();
    alert("Contrato Cancelado!");
});

const botaoConfirm = document.getElementById('confirm');
botaoConfirm.addEventListener('click', ()=>{
    modal_confirm.close();

    const obrigado = document.getElementById('modal-agradecimento');
    obrigado.showModal();
    
    const fechar = document.getElementById('close');
    fechar.addEventListener('click', ()=>{
        obrigado.close();
        window.location.href = '/';
    });
});