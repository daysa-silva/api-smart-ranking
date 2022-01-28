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
Cria um novo jogador salva na base de dados. Exemplo de body:


```bash
{
  "categoria": "A",
  "telefone": ""12 34567890",
  "email": "daysa@email.com"
}
```
#### PUT /api/v1/jogadores/_:id_
Atualiza o jogador com id igual a _id_. Exemplo de body:

```bash
{
  "telefone": "12 34567890",
  "nome": "Eliza"
}
```

#### GET /api/v1/jogadores/_:id_
Retorna todos os jogadores na base de dados se _id_ for uma string vazia ou retorna jogador com \_id igual a _id_. 

#### DELETE /api/v1/jogadores/_:id_
Apaga da base de dados o jogador com \_id igual a _id_.

### CategoriasService

#### POST /api/v1/categorias
Cria uma nova categoria e salva na base de dados. Exemplo de body:


```bash
{
  "categoria": "A",
  "descricao": "Categoria A",
  "eventos": [
    {
      "nome": "VITORIA",
      "operacao":"+",
      "valor": 30
  	},
    {
      "nome": "VITORIA_LIDER",
      "operacao":"+",
      "valor": 50
    },
    {
      "nome": "DERROTA",
      "operacao":"+",
      "valor": 0
    }
  ]
}
```
#### POST /api/v1/categorias/_:cat_/jogadores/_:idJog_
Adiciona no vetor de jogadores da categoria _cat_, o jogador com id _idJog_.

### PUT /api/v1/categorias/_:cat_
Atualiza a categoria _cat_. Exemplo de body:
```bash
{
  "descricao": "Categoria A - Os melhores dos melhores"
}
```

#### GET /api/v1/categorias/_:cat_
Retorna todos os jogadores na base de dados se _cat_ for uma string vazia ou retorna categoria com categoria igual _cat_. 

#### DELETE /api/v1/categorias/_:cat_
Apaga da base de dados a categoria com categoria igual a _cat_.

### DesafiosService

#### POST /api/v1/desafios
Cria um novo desafio e salva na base de dados. Exemplo de body:


```bash
{
	"dataHoraDesafio": "04-05-2022 18:00:00",
    "solicitante": {
        "_id": "61f3ec2e9df084e29a151e97"
    },
	"jogadores": [
    {
        "_id": "61f3ec219df084e29a151e94"
    },
	   {
        "_id": "61f3ec2e9df084e29a151e97"
	   }
	]
}
```
#### POST /api/v1/desafios/_:id_/partida/
Defini o parâmetro partida no desafio com \_id igual a _id_. Exemplo de body:

```bash
{
  "def": { "_id": "61f3ec2e9df084e29a151e97" },
  "resultado": [
    { "set": "3x7" }, 
    { "set": "10x9" }, 
    { "set": "4x8" }
  ]
}
```

### PUT /api/v1/desafios/_:id_
Atualiza o desafio _id_. Exemplo de body:

```bash
{
  "status": "ACEITO",
  "dataHoraDesafio": "28-01-2022 10:15:00"
}
```
OBS: Se o staus for atualizado de um desafio, então o parâmetro _dataHoraResposta_ é definido como a hora da requisição foi feita.

#### GET /api/v1/desafios/_:id_
Retorna todos os desafios na base de dados se _id_ for uma string vazia ou retorna desafio com \_id igual _id_. 

#### GET /api/v1/desafios?jogador=_id_
Retorna todos os desafios na base de dados onde jogador faz parte. 

#### DELETE /api/v1/desafios/_:id_
Apaga da base de dados o desafio com \_id igual a _id_.

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
