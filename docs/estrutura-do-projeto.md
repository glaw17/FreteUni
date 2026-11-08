# Onde mexer no projeto

Deixei algumas coisas prontas para ajudar vocês a começar. Este guia mostra onde fica cada parte e o que já está ligado à home. Para abrir o site, veja [como rodar o projeto](como-rodar-localmente.md). Para enviar sua parte, veja [como contribuir](../CONTRIBUTING.md).

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
| Criar ou ajustar um endereço do site | `src/routes/` |

As seções da home têm o mesmo nome no EJS e no LESS. Assim fica mais fácil encontrar os dois lados da tarefa.

Deixei os imports dos estilos no `public/less/style.less`. Os estilos das seções da home são reunidos no `public/less/pages/home/style.less`. As quatro seções atuais já estão incluídas, então vocês podem editar os arquivos delas direto.

## Exemplo: mexer na hero

A hero é a apresentação inicial da página. Deixei uma base de HTML e LESS pronta nos dois arquivos dela. Eles já estão incluídos na home, então vocês podem continuar dali.

Em `src/views/pages/home/sections/hero.ejs`, deixei este começo:

```html
<section class="home-hero">
  <h1>Seu frete começa aqui</h1>
  <p>Conheça a FreteUni.</p>
</section>
```

E em `public/less/pages/home/sections/hero.less`, deixei um espaçamento e a cor do título:

```less
.home-hero {
  padding: 40px 20px;

  h1 {
    color: @highlight;
  }
}
```

As cores do projeto já estão em `colors.less`. O `@highlight` usado no título é o laranja. Vocês podem usar essas variáveis nos estilos das outras seções também.

Esse é só um começo para mostrar como o HTML e o LESS se conectam. Podem trocar os textos, acrescentar elementos e continuar o layout conforme a parte de vocês.

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
