# Como rodar o projeto

Deixei aqui o passo a passo para abrir o FreteUni no seu computador.

## Antes de começar

Instale estas ferramentas, se ainda não tiver:

- [Git](https://git-scm.com/downloads), para baixar o projeto e salvar suas contribuições.
- [Node.js com npm](https://nodejs.org/en/download), para rodar o servidor.

Também tenha um editor, como o VS Code, um navegador e acesso à internet.

Abra um terminal e confira se as instalações funcionaram:

```bash
git --version
node --version
npm --version
```

Cada comando deve mostrar uma versão. Se não funcionar, tente fechar e abrir o terminal depois da instalação.

## Baixando o projeto

No terminal, entre na pasta em que quer guardar o projeto e execute:

```bash
git clone https://github.com/glaw17/FreteUni.git
cd FreteUni
```

Se você já baixou o projeto, pode usar a pasta que já tem.

Abra essa pasta no VS Code. Os próximos comandos devem ser executados na pasta que contém o `package.json` e o `server.js`.

## Abrindo o site

No terminal do projeto, execute:

```bash
npm start
```

Esse comando já instala os pacotes necessários antes de iniciar o servidor. Espere aparecer `Front disponível em http://localhost:3000` e abra `http://localhost:3000` no navegador.

Deixe o terminal aberto enquanto usa o site. Para parar o servidor, pressione **Ctrl + C** nele. Se aparecer uma confirmação, confirme.

Se os pacotes já estiverem instalados, também dá para iniciar com `node server.js`, sem repetir a instalação.

## Enquanto estiver fazendo alterações

- Alterou um arquivo EJS, LESS ou de `public/js`? Salve e atualize a página no navegador.
- Alterou `server.js` ou algum arquivo de `src/routes`? Pare o servidor com **Ctrl + C**, inicie novamente e atualize a página.
- O site não atualiza sozinho quando você salva um arquivo.

Por enquanto, só a home abre uma página. Deixei login, cadastro e fretes com mensagens de desenvolvimento e status **501**. Isso não é falha da instalação. Não precisa configurar banco de dados para abrir a home.

## Se algo não funcionar

- **Erro dizendo que não encontrou `package.json`:** confira se o terminal está na pasta certa. O arquivo precisa estar nessa pasta, e não dentro de `src` ou `public`.
- **O PowerShell bloqueou `npm.ps1`:** tente `npm.cmd start` no lugar de `npm start`.
- **Porta 3000 ocupada (`EADDRINUSE`):** veja se o projeto já está rodando em outro terminal e pare essa execução com **Ctrl + C** antes de tentar de novo.
- **A aparência está incompleta ou não mudou:** confira a internet, pois o site carrega estilos e bibliotecas externas. Tente também **Ctrl + F5** para atualizar os arquivos guardados pelo navegador.

Se continuar dando erro, mande a mensagem completa para o grupo e diga qual comando você executou.

Depois que estiver rodando, veja [como contribuir](../CONTRIBUTING.md). Para voltar à apresentação do projeto, abra o [README](../README.md).
