# Como ajudar no projeto

A ideia é cada um cuidar de uma parte e depois juntar o trabalho do grupo. Deixei este guia com o básico para fazer isso usando Git e GitHub.

## 1. Combine o que vai fazer

Antes de começar, avise o grupo: por exemplo, "vou fazer a seção inicial da home". Assim, duas pessoas não acabam mexendo na mesma parte sem saber.

Se ainda não conseguiu abrir o site, siga [como rodar o projeto](docs/como-rodar-localmente.md). Para encontrar os arquivos da sua parte, veja [onde fica cada coisa](docs/estrutura-do-projeto.md).

## 2. Atualize o projeto e crie uma branch

**Sempre usem `git pull` antes de começar uma tarefa nova por aqui.** Sigam os passos abaixo para atualizar a `main` antes de criar a branch da sua parte. Assim vocês começam com as mudanças que o grupo já juntou no projeto.

Uma **branch** é uma linha de trabalho separada. A `main` é onde juntamos as partes do grupo.

Abra o terminal na pasta do projeto e confira:

```bash
git status
```

Se aparecerem alterações de uma tarefa anterior, salve e registre essa tarefa na branch certa antes de continuar. Se não souber o que fazer, peça ajuda ao grupo para não perder nada.

Quando não houver alterações pendentes:

```bash
git switch main
git pull --ff-only origin main
git switch -c home-hero
```

Isso abre a `main`, baixa as atualizações do GitHub e cria a branch `home-hero`. Se algum comando der erro, resolva com o grupo antes de executar o próximo.

`home-hero` é só um exemplo. Use um nome curto para sua parte, como `navbar-mobile` ou `organize-styles`. Se a branch já existir, confirme se deve continuar nela ou criar outra com um nome diferente.

Se forem continuar uma tarefa, fiquem na branch dela. Quando essa branch já tiver sido enviada com `git push -u`, confiram se o `git status` está sem alterações pendentes e usem `git pull --ff-only` antes de editar. Isso atualiza a própria branch. Para trazer mudanças novas da `main` para ela, peçam ajuda ao grupo.

## 3. Faça sua parte e confira no site

Para trabalhar na seção inicial da home, os arquivos são:

```text
src/views/pages/home/sections/hero.ejs
public/less/pages/home/sections/hero.less
```

O `.ejs` guarda o conteúdo e a estrutura. O `.less` cuida da aparência. Deixei esses dois arquivos ligados à home, então é só editar.

Alguns combinados simples:

- Siga a organização e a indentação dos arquivos existentes.
- Use as cores de `colors.less`, como `@highlight`.
- Deixe os ajustes para celular junto dos estilos da sua seção.
- Avise antes de mudar algo compartilhado, como a navbar ou as cores do site.
- Se mudar o nome de um ID, confira se ele também é usado no JavaScript.

Salve, abra o site e confira sua parte na janela grande e na largura de celular. Recarregue a página depois de editar. Se alterar `server.js` ou as rotas, reinicie o servidor.

## 4. Salve as mudanças no Git e envie

Um **commit** registra uma versão das alterações. O **push** envia esses commits para o GitHub.

Primeiro veja quais arquivos mudaram:

```bash
git status
git diff
```

Depois, selecione os arquivos da sua parte. Para o exemplo da hero:

```bash
git add src/views/pages/home/sections/hero.ejs public/less/pages/home/sections/hero.less
git diff --cached
git commit -m "Adiciona seção inicial da home"
git push -u origin home-hero
```

O `git add` escolhe o que entra no commit. Com `git diff --cached`, você confere essa seleção antes de registrar. Arquivos novos aparecem no `git status` e passam a aparecer no diff depois do `git add`.

Troque os caminhos e o nome da branch pelos da sua tarefa. Escreva uma mensagem curta contando o que fez. Não precisa usar prefixos ou seguir um modelo de mensagem.

A pasta `node_modules` e arquivos `.env` ficam fora dos commits. O `.gitignore` já cuida disso. Mantenha o `package-lock.json` no projeto.

## 5. Junte com o trabalho do grupo

No GitHub, abra um **Pull Request**: é o pedido para juntar sua branch à `main`.

Escolha `main` como **base** e sua branch como **compare**. Conte em uma ou duas frases o que mudou e como conferir. Uma imagem pode ajudar quando a mudança for visual.

Avise o grupo para alguém conferir antes de juntar. Se precisar ajustar alguma coisa, continue na mesma branch, faça outro commit e use `git push`. O mesmo Pull Request será atualizado.

Quando sua parte já estiver na `main`, volte ao passo 2 para começar a próxima tarefa em outra branch.

## Deu erro?

Mande ao grupo a mensagem do terminal e diga o que estava tentando fazer. Se aparecer um conflito, o Git precisa de ajuda para juntar mudanças no mesmo trecho: vale resolver com quem mexeu naquele arquivo.
