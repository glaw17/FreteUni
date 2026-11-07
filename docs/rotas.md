# Rotas do FreteUni

Separei as rotas em três arquivos dentro de `src/routes`, pra ficar mais fácil de mexer em cada parte (por agora, possivelmente adicionaremos mais):

- `pages.js`: páginas do site. Por enquanto, só tem a inicial.
- `auth.js`: login, cadastro e sair da conta.
- `fretes.js`: simular, contratar, ver os detalhes e rastrear um frete.

O `server.js` ficou com a configuração do Express, do EJS e dos arquivos públicos. Ele também carrega esses três arquivos de rotas. (basicamente oq o index.ejs faz com os partials)

## Pra que serve cada rota

| Método | Rota | Arquivo | Pra que serve |
| --- | --- | --- | --- |
| GET | `/` | `pages.js` | Abrir a página inicial. |
| GET | `/login` | `auth.js` | Abrir a página de login. |
| POST | `/login` | `auth.js` | Conferir os dados e fazer o login. |
| GET | `/register` | `auth.js` | Abrir o cadastro de cliente ou motorista. |
| POST | `/register` | `auth.js` | Conferir os dados e salvar o cadastro. |
| POST | `/logout` | `auth.js` | Sair da conta. |
| GET | `/fretes/novo` | `fretes.js` | Abrir o formulário pra contratar um frete. |
| POST | `/fretes/simular` | `fretes.js` | Calcular o preço estimado do frete. |
| POST | `/fretes` | `fretes.js` | Confirmar e salvar a contratação. |
| GET | `/fretes/:id` | `fretes.js` | Mostrar os detalhes daquele frete. |
| GET | `/rastrear` | `fretes.js` | Buscar o frete pelo código da URL. |

Por enquanto, só a rota `/` mostra uma página. Nas outras, deixei uma mensagem com status **501**, porque ainda falta fazer as páginas e o backend dessas partes. Deixei os comentários `TODO` pra indicar o que falta em cada uma.

## Pra continuar

Quando criarem as páginas EJS, é só trocar a mensagem do GET por `response.render` e passar os dados que a página precisar. Os partials continuam sendo incluídos nas páginas, sem precisar de uma rota pra cada um.

Nos forms que enviam dados, coloquem `method="post"` e o endereço da rota no `action`. Cada campo precisa ter `name` pra chegar no backend. Os dados ficam em `request.body`; já adicionei o `express.urlencoded` no `server.js` pra receber isso.

Depois de salvar a contratação, usem `response.redirect(303, "/fretes/" + id)` pra abrir os detalhes do frete. Assim, dar F5 nessa página não envia a contratação de novo. Façam isso depois de confirmar que salvou.

Os botões da navbar já apontam pra `/login`, `/register` e `/rastrear?id=...`.

> Já deixei uma base pra vc aq glawber
- Em `/rastrear?id=ABC123`, o código chega em `request.query.id` (usa isso pra pegar o valro vindo do frontend).
- Em `/fretes/123`, o ID chega em `request.params.id` (usa isso pra pegar o valor vindo do frontend).

Deixe `/fretes/novo` antes de `/fretes/:id`, senão ele pode entender `novo` como um ID. No `server.js`, carreguem as rotas antes da resposta 404.
