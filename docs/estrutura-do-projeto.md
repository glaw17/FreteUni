# Onde mexer no projeto

Este guia mostra onde ficam as páginas, os componentes e a lógica do FreteUni. Para abrir o site, veja [como rodar o projeto](como-rodar-localmente.md). Para enviar sua parte, veja [como contribuir](../CONTRIBUTING.md).

Duas coisas que aparecem bastante:

- **EJS** é o HTML das páginas, com a opção de incluir outros arquivos.
- **LESS** é onde escrevemos os estilos. Ele permite usar variáveis de cores e separar o código em arquivos menores.

## Onde faço minha parte?

| O que você vai fazer | Arquivo ou pasta |
| --- | --- |
| Montar a página inicial e organizar suas seções | `src/views/pages/home/index.ejs` |
| Escrever o HTML de uma seção da home | `src/views/pages/home/sections/` |
| Estilizar uma seção da home | `public/less/pages/home/sections/` |
| Mudar o HTML do menu ou rodapé | `src/views/partials/` |
| Estilizar o menu ou rodapé | `public/less/components/` |
| Usar ou ajustar as cores do projeto | `public/less/colors.less` |
| Ajustar estilos gerais e reset | `public/less/base.less` |
| Personalizar botões e checkbox do Bootstrap | `public/less/bootstrap-extended.less` |
| Fazer um botão responder a um clique | `public/js/script.js` |
| Ajustar as páginas ou formulários de login e cadastro | `src/views/pages/auth/` e `public/js/auth/` |
| Ajustar a página de cotação da contratação | `src/views/pages/contract/index.ejs` e `public/less/pages/contract/style.less` |
| Criar ou ajustar um endereço do site | `src/routes/` |
| Ajustar a estrutura do banco | `src/database/database.js` e `src/database/schema.sql` |

As seções da home têm o mesmo nome no EJS e no LESS. Assim fica mais fácil encontrar os dois lados da tarefa.

Os imports principais ficam em `public/less/style.less`. Os estilos das cinco seções da home são reunidos em `public/less/pages/home/style.less`. A navbar e o rodapé são componentes compartilhados.

## Exemplo: mexer na hero

A hero é a apresentação inicial da página. O texto e os botões ficam no `hero.ejs`, e o visual fica no `hero.less`, no seletor `.hero`. O botão de contratação abre `/contract`, e o de simulação aponta para `#section-simulation` na própria home.

As cores compartilhadas ficam em `colors.less`. Por exemplo, `@highlight` é o laranja usado nos destaques.

Salve os arquivos e atualize a home no navegador. Confira também como ficou com a janela menor.

## E se eu precisar criar outra seção?

Primeiro confira se já existe um arquivo para sua tarefa. Para uma seção nova chamada `benefits`, por exemplo:

1. Crie `src/views/pages/home/sections/benefits.ejs` para o HTML.
2. Crie `public/less/pages/home/sections/benefits.less` para os estilos.
3. Em `src/views/pages/home/index.ejs`, coloque a inclusão na posição em que a seção deve aparecer:

   ```ejs
   <%- include('sections/benefits.ejs') %>
   ```

4. Em `public/less/pages/home/style.less`, acrescente:

   ```less
   @import "sections/benefits.less";
   ```

Os caminhos de `include` e `@import` partem da pasta do arquivo em que você está escrevendo.

## Para manter tudo fácil de encontrar

- Use nomes com palavras separadas por hífen, como `freight-simulation.less` e `.home-hero`.
- Deixe os ajustes para telas menores no mesmo LESS da seção ou componente.
- Use classes específicas da sua parte para evitar mudar outras seções sem querer.
- Ao mudar um arquivo compartilhado, como as cores ou a navbar, avise a equipe e confira o que ele afeta.
- Se renomear um `id` no HTML, veja se ele também é usado no JavaScript ou no LESS.
- Imagens vão em `public/images/`. No HTML, use o endereço sem `public`, por exemplo: `<img src="/images/logo.png" alt="FreteUni" />`.

Para mexer nos endereços do site, veja também o guia de [rotas](rotas.md).
