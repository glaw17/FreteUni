# Como rodar localmente

## Node.JS

### 1) Instale o Node.js

Baixe o Node.js:

https://nodejs.org/

Depois confirme se a instalação foi concluída com sucesso:

```bash
node -v
npm -v
```

### 2) Instale as dependências do projeto

Abra o terminal na pasta raiz do projeto e execute:

```bash
npm install
```

### 3) Inicie o projeto localmente

```bash
npm run start
```

O terminal vai mostrar a URL local onde a aplicação está rodando, normalmente algo como:

```bash
http://localhost:3000
```
> ":3000" é a porta que o servidor está escutando, pode ser alterada no .env

Acesse essa URL no navegador para visualizar o projeto.

### 4) Se quiser gerar a build de produção

```bash
npm run start
```
> A principio não fiz separação de build/preview então use o mesmo comando para rodar localmente

Se houver erros de dependência, tente limpar o cache e reinstalar:

```bash
rm -rf node_modules package-lock.json
npm install
```

Em Windows, use o PowerShell ou CMD e adapte o comando de remoção:

```bash
rmdir /s /q node_modules
 del package-lock.json
npm install
```
