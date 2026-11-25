# Rotas do projeto

Rotas são os endereços que o servidor atende. **GET** serve para abrir páginas ou consultar dados. **POST** serve para enviar dados, como os campos de um formulário.

Deixei as rotas separadas nestes arquivos de `src/routes/`:

- `pages.js`: home, contratação, termos de uso e easter egg.
- `auth.js`: login, cadastro e saída da conta.
- `fretes.js`: simulação de frete.
- `avaliacoes.js`: envio das notas do rodapé.

## Endereços disponíveis

| Método | Rota | Para que serve |
| --- | --- | --- |
| GET | `/` | Abrir a home e o simulador. |
| GET | `/login` | Abrir o login. |
| POST | `/auth/login` | Conferir email e senha e abrir a sessão. |
| GET | `/register` | Abrir o cadastro. |
| POST | `/auth/register` | Validar e salvar o cadastro. |
| POST | `/auth/logout` | Encerrar a sessão. |
| GET | `/contract` | Abrir o formulário da cotação de contratação. |
| POST | `/fretes/simular` | Estimar o preço a partir dos dois CEPs e da quantidade de ajudantes. |
| POST | `/avaliacoes` | Receber uma nota de 0 a 10 enviada pelo rodapé. |
| GET | `/termos` | Abrir os termos de uso. |
| GET | `/easter-egg` | Abrir o easter egg. |

A confirmação de `/contract` conclui a demonstração da cotação na página. A busca de rastreio avisa que o serviço está indisponível.

## Como abrir uma página pela rota

A home usa `response.render("pages/home/index", ...)`, em `src/routes/pages.js`. Esse caminho aponta para `src/views/pages/home/index.ejs`.

Para fazer outra página, crie o arquivo EJS em `src/views/pages/` e adicione uma rota GET com `response.render` e o caminho certo. As seções da home são incluídas pelo EJS.

## Como os dados chegam

- O JavaScript do login envia `email`, `password` e `rememberMe` como JSON. Esses campos chegam em `request.body`.
- Em `POST /fretes/simular`, envie `cepOrigem` e `cepDestino` como textos de 8 dígitos. O campo `ajudantes` é um número inteiro de 0 a 2 e vale 0 quando omitido.
- Em `POST /avaliacoes`, envie a nota no campo `rating`. O servidor responde com `201` depois de gravar a avaliação.
- O cookie identifica a sessão, que o servidor recupera do MySQL a cada requisição que precisa dela.

No `server.js`, as rotas ficam antes da resposta 404, que atende os endereços não encontrados.

Atualize esta lista quando implementar ou acrescentar alguma rota. Veja também [onde ficam os arquivos](estrutura-do-projeto.md).
