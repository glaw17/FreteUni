# Rotas do projeto

Rotas são os endereços que o servidor atende. **GET** serve para abrir páginas ou consultar dados. **POST** serve para enviar dados, como os campos de um formulário.

Deixei as rotas separadas nestes arquivos de `src/routes/`:

- `pages.js`: páginas gerais, como a home.
- `auth.js`: login, cadastro e saída da conta.
- `fretes.js`: simulação, contratação e rastreamento.

## O que temos por enquanto

Só a home (`GET /`) mostra uma página. Deixei as outras rotas com uma mensagem e status **501**, porque essas partes ainda precisam ser feitas.

| Método | Rota | Arquivo | Para que vai servir |
| --- | --- | --- | --- |
| GET | `/` | `pages.js` | Abrir a home. |
| GET | `/login` | `auth.js` | Abrir o login. |
| POST | `/login` | `auth.js` | Receber os dados do login. |
| GET | `/register` | `auth.js` | Abrir o cadastro. |
| POST | `/register` | `auth.js` | Receber e salvar o cadastro. |
| POST | `/logout` | `auth.js` | Sair da conta. |
| GET | `/fretes/novo` | `fretes.js` | Abrir o formulário de contratação. |
| POST | `/fretes/simular` | `fretes.js` | Estimar o preço do frete. |
| POST | `/fretes` | `fretes.js` | Salvar uma contratação. |
| GET | `/fretes/:id` | `fretes.js` | Mostrar os detalhes de um frete. |
| GET | `/rastrear` | `fretes.js` | Rastrear um frete pelo código. |

## Como abrir uma página pela rota

A home usa `response.render("pages/home/index", ...)`, em `src/routes/pages.js`. Esse caminho aponta para `src/views/pages/home/index.ejs`.

Para fazer outra página, crie o arquivo EJS na pasta correspondente de `src/views/pages/` e troque a mensagem 501 da rota GET por um `response.render` com o caminho certo. Seções dentro de uma página não precisam de uma rota própria.

## Como os dados chegam

- Em `/rastrear?id=ABC123`, o código chega em `request.query.id`.
- Em `/fretes/123`, o ID chega em `request.params.id`.
- Em um formulário com `method="post" action="/login"`, um campo com `name="email"` chega em `request.body.email`.

Deixei o servidor pronto para receber dados de formulários, mas o login e as outras funcionalidades ainda precisam ser feitos. O atributo `name` é o que identifica o valor enviado pelo campo.

Mantenha `/fretes/novo` antes de `/fretes/:id` no arquivo de rotas, para o servidor não confundir `novo` com um ID. No `server.js`, as rotas ficam antes da resposta 404, que atende os endereços não encontrados.

Atualize esta lista quando implementar ou acrescentar alguma rota. Veja também [onde ficam os arquivos](estrutura-do-projeto.md).
