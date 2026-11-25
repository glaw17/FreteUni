# FreteUni - Andrey Elias, David Anderson, Glawber de Morais, Lucas Arruda, Yohan Mitsuo

Trabalho do primeiro período da disciplina de Desenvolvimento Front-End Para Web. O FreteUni é uma demonstração de serviços de frete feita com LESS, JavaScript, EJS, Express e MySQL.

## Deploy

O FreteUni está oficialmente online! A plataforma foi publicada e está disponível para acesso em [freteuni.store](https://freteuni.store).

## Como rodar localmente

Você precisa de Node.js com npm e de um banco MySQL. Crie o banco `freteuni` e preencha o `.env` a partir do `.env.example`. O [passo a passo de instalação](docs/como-rodar-localmente.md) mostra como configurar os dois.

Com a configuração pronta, abra o terminal na pasta que contém `package.json` e execute:

```bash
npm start
```

Depois, acesse [http://localhost:3000](http://localhost:3000). Para encerrar, use `Ctrl+C` no terminal.

O `npm start` já instala as dependências antes de iniciar o servidor. É preciso ter internet para carregar os estilos e as bibliotecas usadas na página.

## Para trabalhar no projeto

- [Como contribuir](CONTRIBUTING.md): combinar sua parte, criar uma branch e enviar as alterações.
- [Onde fica cada coisa](docs/estrutura-do-projeto.md): arquivos de HTML, estilos e JavaScript.
- [Rotas](docs/rotas.md): endereços das páginas e das requisições.
- [Correções à documentação acadêmica](docs/errata-documentacao.md): escopo da entrega, fórmula de frete e dicionário atualizado do banco.

O site tem home com simulador por CEP, cadastro de cliente e motorista, login, logout, termos de uso e avaliação no rodapé. A página de contratação demonstra a cotação com até dois ajudantes e a confirmação do orçamento. O rastreamento aparece como indisponível na interface.

