# Correções à documentação acadêmica do FreteUni

Este complemento atualiza a [documentação do projeto](Documenta%C3%A7%C3%A3o%20Projeto%20Final.pdf) e o [dicionário de dados](../src/database/Dicionario_Dados_Freteuni.pdf) de acordo com a revisão final.

## Documentação do projeto

| Página | Atualização |
| --- | --- |
| 2 | Login e cadastro usam uma navbar simplificada com a marca e um link para a outra página de autenticação. As duas páginas dispensam o rodapé. |
| 3–4 | O cadastro exige o aceite dos termos e grava a data do aceite. O nome de exibição é o primeiro nome e pode se repetir. |
| 5 | A contratação está em `/contract`. A pessoa preenche o formulário, confere o orçamento no modal e pode confirmar ou cancelar. A confirmação encerra uma cotação demonstrativa. |
| 5 | A fórmula é `180 + (distância em km × 4,50) + (ajudantes × 60)`. A contratação aceita de zero a dois ajudantes. A home calcula com zero. A distância é estimada pelas coordenadas dos CEPs, em linha reta. |
| 5–6 | O MySQL guarda cadastros, sessões e notas anônimas do rodapé. O servidor usa mysql2 para conectar e Knex para preparar tabelas e executar consultas. |
| 6 | O login e o logout disponíveis são os de clientes e motoristas. O acesso administrativo citado no PDF está fora da versão entregue. |
| 6 | O express-session guarda as sessões no MySQL. O prazo é de uma hora sem marcar «Lembrar de mim» e de 30 dias quando a opção é marcada. |

## Dicionário de dados atualizado

O [schema SQL](../src/database/schema.sql) descreve as tabelas. Os identificadores numéricos que fazem parte das relações usam `INT UNSIGNED`.

### users

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `id_user` | `INT UNSIGNED` | Chave primária, gerada pelo banco. |
| `full_name` | `VARCHAR(100)` | Nome completo obrigatório. |
| `birth_date` | `DATE` | Data de nascimento obrigatória. |
| `email` | `VARCHAR(150)` | Email obrigatório e único. |
| `password` | `VARCHAR(255)` | Hash bcrypt obrigatório. |
| `nickname` | `VARCHAR(50)` | Primeiro nome, usado para exibição. Pode se repetir. |
| `phone` | `VARCHAR(15)` | Telefone com DDD, obrigatório. |
| `cpf` | `VARCHAR(11)` | Único quando preenchido. |
| `cnpj` | `VARCHAR(14)` | Único quando preenchido. |
| `company_name` | `VARCHAR(100)` | Nome da empresa, exigido junto do CNPJ. |
| `user_type` | `ENUM('BUYER', 'DRIVER')` | Tipo de conta obrigatório. |
| `accepted_terms` | `BOOLEAN` | Aceite dos termos. O cadastro exige aceite e o banco usa `FALSE` como padrão. |
| `terms_accepted_at` | `DATETIME` | Momento do aceite. Pode estar vazio em registros anteriores ao campo. |

Cada cadastro usa CPF ou CNPJ. Quando tem CPF, os campos de CNPJ e empresa ficam vazios. Quando tem CNPJ, o nome da empresa é obrigatório e o CPF fica vazio.

### buyers

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `id_buyer` | `INT UNSIGNED` | Chave primária e referência a `users.id_user`. |

### drivers

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `id_driver` | `INT UNSIGNED` | Chave primária e referência a `users.id_user`. |
| `cnh_number` | `VARCHAR(11)` | Número da CNH, obrigatório e único. |
| `cnh_type` | `ENUM('A', 'B', 'C', 'D', 'E')` | Categoria da CNH, obrigatória. |
| `cnh_expiration` | `DATE` | Data de validade da CNH, obrigatória. |
| `interstate` | `BOOLEAN` | Indica se realiza fretes entre estados. O padrão é `FALSE`. |

### cars

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `id_car` | `INT UNSIGNED` | Chave primária, gerada pelo banco. |
| `id_driver` | `INT UNSIGNED` | Referência obrigatória a `drivers.id_driver`. |
| `vehicle_type` | `ENUM('CAR', 'VAN', 'TRUCK')` | Carro, van ou caminhão. Obrigatório. |
| `plate` | `VARCHAR(7)` | Placa obrigatória e única. |
| `brand` | `VARCHAR(50)` | Marca obrigatória. |
| `model` | `VARCHAR(50)` | Modelo obrigatório. |
| `year` | `INT` | Ano de fabricação obrigatório. |
| `color` | `VARCHAR(30)` | Cor opcional. |
| `load_capacity` | `DECIMAL(10,2)` | Capacidade em kg, exigida no cadastro de motorista. O banco aceita valor nulo. |

Os vínculos de `buyers` e `drivers` com `users`, e o de `cars` com `drivers`, usam atualização e exclusão em cascata.

### sessions

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `sid` | `VARCHAR(128)` | Chave primária que identifica a sessão. |
| `data` | `TEXT` | Dados da sessão, guardados como JSON pelo servidor. |
| `expires_at` | `DATETIME` | Prazo da sessão, com índice para consultar vencimentos. |

### reviews

| Campo | Tipo | Regra ou finalidade |
| --- | --- | --- |
| `id_review` | `INT UNSIGNED` | Chave primária, gerada pelo banco. |
| `rating` | `TINYINT UNSIGNED` | Nota de 0 a 10, obrigatória. |
| `created_at` | `TIMESTAMP` | Momento do envio, definido pelo banco. |

As avaliações guardam a nota e a data do envio, sem vínculo com a conta de quem avaliou.
