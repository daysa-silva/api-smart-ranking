# Smart Ranking API

## Entidades

### Jogador
- **_id:** string;
- **telefone:** string;
- **email:** string;
- **nome:** string;
- **ranking:** string;
- **posicaoRanking:** number;
- **urlFotoJogador:** string;

### Categoria
 - **categoria:** string;
 - **descricao:** string;
 - **eventos:** Evento\[ \];
 - **jogadores:** Jogador\[ \];

### Desafio
  - **dataHoraDesafio:** Date;
  - **status:** DesafioStatus;
  - **dataHoraSolicitacao:** Date;
  - **dataHoraResposta:** Date;
  - **solicitante:** Jogador;
  - **categoria:** string;
  - **jogadores:** Jogador\[ \];
  - **partida:** Partida;

### Partida
 - **categoria:** string;
 - **jogadores:** Jogador\[ \];
 - **def:** Jogador;
 - **resultado:** { set: string } \[ \];

## Serviços

### JogadoresService

#### POST /api/v1/jogadores
Cria um novo jogador e salva na base de dados. Exemplo de body:


```bash
{
  "nome": "daysa",
  "telefone": "12 34260824",
  "email": "daysa@email.com"
}
```

#### GET /api/v1/jogadores/_:id_
Retorna todos os jogadores na base de dados se _id_ for uma string vazia ou retorna jogador com \_id igual a _id_. 

#### DELETE /api/v1/jogadores/_:id_
Apaga da base de dados o jogador com \_id igual a _id_.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
