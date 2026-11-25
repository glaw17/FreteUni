# Como rodar o projeto

Deixei aqui o passo a passo para abrir o FreteUni no seu computador.

## Antes de começar

Instale estas ferramentas, se ainda não tiver:

- [Git](https://git-scm.com/downloads), para baixar o projeto e salvar suas contribuições.
- [Node.js com npm](https://nodejs.org/en/download), para rodar o servidor. A versão usada na revisão foi a 24.14.0.
- MySQL 8.0, local ou acessível pela sua rede. Use uma conta com permissão para preparar as tabelas e gravar dados no banco do projeto.

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

## Preparando o banco e o .env

1. Crie o banco do projeto no cliente MySQL.

   ```sql
   CREATE DATABASE IF NOT EXISTS freteuni;
   ```

2. Se ainda não tiver um `.env`, copie o arquivo de exemplo pelo PowerShell.

   ```powershell
   Copy-Item .env.example .env
   ```

3. Preencha `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER` e `DATABASE_PASSWORD` com os dados da sua conexão. O `DATABASE_NAME` precisa ser o nome do banco criado, e o `DATABASE_TYPE` deve ser `mysql2`.
4. Gere um valor aleatório para `SESSION_SECRET` com este comando.

   ```bash
   node -p "require('node:crypto').randomBytes(32).toString('hex')"
   ```

   Cole o resultado no `.env`. Guarde esse arquivo no seu computador e compartilhe apenas o `.env.example`.

Ao iniciar, o servidor prepara as tabelas com Knex. O arquivo `src/database/schema.sql` também descreve a estrutura para instalação em MySQL.

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

Além da home, você pode abrir `/login`, `/register`, `/contract` e `/termos`. O simulador e a cotação da contratação consultam CEPs pela BrasilAPI.

## Se algo não funcionar

- **Erro dizendo que não encontrou `package.json`:** confira se o terminal está na pasta certa. O arquivo precisa estar nessa pasta, e não dentro de `src` ou `public`.
- **Erro ao ler o `.env`:** confira se o arquivo se chama exatamente `.env` e fica ao lado do `package.json`.
- **O PowerShell bloqueou `npm.ps1`:** tente `npm.cmd start` no lugar de `npm start`.
- **Conexão com o MySQL recusada (`ECONNREFUSED`):** confira se o serviço está ativo e se o host e a porta estão certos.
- **Acesso negado ou banco desconhecido:** confira as credenciais, as permissões da conta e se `DATABASE_NAME` corresponde ao banco criado.
- **Porta 3000 ocupada (`EADDRINUSE`):** veja se o projeto já está rodando em outro terminal e pare essa execução com **Ctrl + C** antes de tentar de novo.
- **A aparência está incompleta ou não mudou:** confira a internet, pois o site carrega estilos e bibliotecas externas. Tente também **Ctrl + F5** para atualizar os arquivos guardados pelo navegador.

Se continuar dando erro, mande a mensagem ao grupo e diga qual comando você executou. Remova senhas e segredos antes de compartilhar.

Depois que estiver rodando, veja [como contribuir](../CONTRIBUTING.md). Para voltar à apresentação do projeto, abra o [README](../README.md).
