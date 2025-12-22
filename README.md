# PlanejaEstudos - Backend

O  PlanejaEstudos tem o objetivo de organizar e facilitar os estudos dos desenvolvedores, tornando mais visível as suas metas e encurtando o tempo de alcançá-las.

## Status do projeto

🚧 <strong>EM DESENVOLVIMENTO</strong> 🚧

## Funcionalidades

- Sistema de usuários com perfil
- CRUD de estudos com progresso
- Gestão de tarefas por estudo
- Sistema de quizzes baseado nos estudos do usuário (em desenvolvimento)
- Log de atividades (em desenvolvimento)
- Autenticação JWT

## Tecnologias

- **Node.js** (Ambiente de execução JavaScript server-side)
- **Express** (Framework web minimalista para Node.js)
- **Typescript** (Superset do JavaScript com tipagem estática)
- **PostgreSQL** (Banco de dados relacional)

## Bibliotecas

- **Drizzle ORM** (ORM TypeScript-first para acesso ao banco de dados)
- **Drizzle Kit** (Ferramenta CLI para migrações e geração de schemas)
- **Helmet** (Segurança de headers HTTP)
- **Jsonwebtoken** (Autenticação JWT)
- **bcrypt-ts** (Hash seguro de senhas)
- **Slug** (Geração de username único)
- **Zod** (Validação de dados)
- **Multer** (Upload de arquivos multipart/form-data)
- **Cloudinary** (Armazenamento de mídia em nuvem)

## ⚙️ Pré-requisitos
- Node.js (versão 18+)
- PostgreSQL (versão 12+)
- npm ou yarn

## Rotas da API

### Rotas auth e users


| Método   | Rota           | Descrição                          | Auth?      |
| -------- | -------------- | ---------------------------------- | ---------- |
| `POST`   | `/auth/signup` | Cria a conta do usuário            | ❌         |
| `POST`   | `/auth/signin` | Faz login do usuário               | ❌         |
| `GET`    | `/users/all`   | Retorna todos os usuários          | ✔️ (dev)   |
| `GET`    | `/users`       | Retorna os dados do usuário logado | ✔️         |
| `PUT`    | `/users/image` | Atualiza a imagem de perfil        | ✔️         |
| `PUT`    | `/users`       | Atualiza os dados do usuário       | ✔️         |
| `DELETE` | `/users`       | Deleta a conta do usuário          | ✔️         |

### Rotas studies e tasks

| Método   | Rota                | Descrição                               | Auth?      |
| -------- | ------------------- | --------------------------------------- | ---------- |
| `GET`    | `/studies/all`      | Retorna todos os estudos (DEV)          | ✔️ (dev) |
| `GET`    | `/studies/:studyId` | Retorna um estudo do usuário e tarefas  | ✔️       |
| `GET`    | `/studies`          | Retorna os estudos do usuário e tarefas | ✔️       |
| `GET`    | `/tasks/:studyId`   | Retorna as tarefas de um estudo         | ✔️       |
| `POST`   | `/studies`          | Cria um estudo                          | ✔️       |
| `PUT`    | `/studies/:studyId` | Atualiza um estudo                      | ✔️       |
| `DELETE` | `/studies/:studyId` | Deleta um estudo                        | ✔️       |
| `POST`   | `/tasks/:studyId`   | Cria uma tarefa                         | ✔️       |
| `PUT`    | `/tasks/:taskId`    | Atualiza uma tarefa                     | ✔️       |
| `DELETE` | `/tasks/:taskId`    | Deleta uma tarefa                       | ✔️       |


### Rotas quizzes

| Método   | Rota                      | Descrição                                   | Auth?      |
| -------- | ------------------------- | ------------------------------------------- | ---------- |
| `GET`    | `/quizzes`                | Retorna os quizzes desbloqueados do usuário | ✔️         |
| `POST`   | `/quizzes`                | Cria um quiz                                | ✔️ (dev)   |
| `POST`   | `/quizzes/many`           | Cria vários quizzes                         | ✔️ (dev)   |
| `GET`    | `/quizzes/:quizId`        | Retorna os dados de um quiz                 | ✔️         |
| `PUT`    | `/quizzes/:quizId`        | Atualiza um quiz                            | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId`        | Deleta um quiz                              | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/unlock` | Desbloqueia um quiz para o usuário          | ✔️         |
| `POST`   | `/quizzes/:quizId/image`  | Atualiza a imagem do quiz                   | ✔️ (dev) |
| `POST`   | `/quizzes/:quizId/start`  | Inicia uma tentativa do quiz                | ✔️         |
| `PUT`    | `/quizzes/:quizId/finish` | Finaliza uma tentativa do quiz              | ✔️         |

### Rotas questions

| Método   | Rota                                     | Descrição                       | Auth?      |
| -------- | ---------------------------------------- | ------------------------------- | ---------- |
| `POST`   | `/quizzes/:quizId/questions`             | Cria uma pergunta               | ✔️ (dev) |
| `POST`   | `/quizzes/:quizId/questions/many`        | Cria várias perguntas           | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/questions/:questionId` | Atualiza uma pergunta           | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId/questions/:questionId` | Deleta uma pergunta             | ✔️ (dev) |

### Rotas alternatives

| Método   | Rota                                     | Descrição                       | Auth?      |
| -------- | ---------------------------------------- | ------------------------------- | ---------- |
| `POST`   | `/quizzes/:quizId/questions/:questionId/alternatives` | Cria alternativas | ✔️ (dev) |
| `POST`   | `/quizzes/:quizId/questions/:questionId/alternatives/many` | Cria várias alternativas | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/questions/:questionId/alternatives/:alternativeId` | Atualiza uma alternativa | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId/questions/:questionId/alternatives/:alternativeId` | Deleta uma alternativa | ✔️ (dev) |


### Rotas charts

| Método   | Rota                        | Descrição           | Auth?    |
|----------|-----------------------------|---------------------|----------|
| `GET`    | `/weekly-productivity`      | Retorna as tarefas criadas e finalizadas em cada dia da semana | ✔️      |
| `GET`    | `/tasks-by-type`            | Retorna a quantidade de tarefas por setor (frontent, backend e ferramentas) | ✔️      |
| `GET`    | `/finished-tasks-by-month`  | Retorna a quantidade de tarefas finalizadas por mês | ✔️      |
| `GET`    | `/average-time-finish-task` | Retorna o tempo médio para finalizar tarefas de cada estudo  | ✔️      |
| `GET`    | `/average-score`            | Retorna a pontuação média por quiz | ✔️      |
| `GET`    | `/faster-attempts`          | Retorna as tentativas de quizzes mais rápidas  | ✔️      |


## Exemplos de retorno das rotas

- **/auth/signup**
``` bash
[
  {
    "id": "userid",
    "name": "nome",
    "username": "username",
    "email": "email@gmail.com",
    "password": "hashdasenha",
    "profileImage": null,
    "role": "user",
    "createdAt": "2025-12-22T19:11:24.801Z"
  }
]
```

- **/studies**
``` bash
{
  "name": "HTML",
  "type": "frontend",
  "link": "https://developer.mozilla.org/pt-BR/docs/Web/HTML",
  "description": "HTML (HyperText Markup Language)",
  "status": "em_andamento"
  "progress": 0
}
```

- **/taks/:studyId**
``` bash
{
  "title": "Aprender a estrutura básica do HTML",
  "link": "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content",
  "finishIn": "2025-11-14T00:10:00.000Z"
}
```

- **/quizzes**
``` bash
[
  {
    "id": "0e35b57e-b8dc-4822-bedd-03eda0a3827e",
    "title": "HTML",
    "description": "Pratique seus estudos com o quiz de HTML da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764444330/Quizzes/zvhoqjhiidbiylw5bggu.png",
    "createdAt": "2025-12-11T16:54:40.488Z",
    "updatedAt": "2025-12-11T16:54:40.488Z",
    "unlockedAt": "2025-12-11T19:14:35.905Z",
    "lastAttempt": {
        "id": "e05d046f-c990-4a54-b124-f09411d1fc04",
        "userId": "123",
        "quizId": "0e35b57e-b8dc-4822-bedd-03eda0a3827e",
        "startedAt": "2025-12-14T12:12:34.449Z",
        "finishedAt": "2025-12-14T12:14:29.335Z",
        "score": 0,
        "durationSec": 114
    }
  },
]
```

- **/quizzes/all**
``` bash
[
  {
    "id": "0e35b57e-b8dc-4822-bedd-03eda0a3827e",
    "title": "HTML",
    "description": "Pratique seus estudos com o quiz de HTML da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764444330/Quizzes/zvhoqjhiidbiylw5bggu.png",
    "createdAt": "2025-12-11T16:54:40.488Z",
    "updatedAt": "2025-12-11T16:54:40.488Z"
  },
]
```

- **/quizzes/attempts**
``` bash
[
  {
    "id": "d5d5964f-a7eb-44d9-bdf4-1126b8556484",
    "quizId": "4df5cdeb-3e56-4cf5-ae6f-de5a997fbc2c",
    "quizTitle": "Javascript",
    "quizImage": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764700935/Quizzes/pjvto2ofgpqthc4xo5yx.png",
    "startedAt": "2025-12-22T13:11:28.021Z",
    "finishedAt": "2025-12-22T13:12:28.688Z",
    "score": 12,
    "durationSec": 60
  },
]
```

- **/quizzes/locked**
``` bash
[
  {
    "id": "50a922ee-64b4-4c3e-9c39-e9f865242a7d",
    "title": "Next",
    "description": "Pratique seus estudos com o quiz de Next da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764805626/Quizzes/sdum6n1yq8e4ubtkpxp2.jpg",
    "createdAt": "2025-12-11T16:54:40.488Z",
    "updatedAt": "2025-12-11T16:54:40.488Z"
  },
]
```

- **/quizzes/:quizId/attempts/finish**
``` bash
[
  {
    "questionId": "1",
    "answerId": "1"
  },
  {
    "questionId": "1",
    "answerId": "1"
  }
]
```

- **/quizzes/:quizId/attempts/questions**
``` bash
{
  "question": "Qual tag é usada para indicar o início de um documento HTML?"
}
```

- **/quizzes/:quizId/questions/many**
``` bash
[
  {
    "question": "Qual tag é usada para indicar o início de um documento HTML?"
  },
  {
    "question": "Onde ficam as informações não visíveis na página, como o título e meta tags?"
  }
]
```

- **/quizzes/:quizId/questions/:questionId/alternatives**
``` bash
{
  "text": "<doctype>", "isCorrect": false, "questionId": 1
}
```

- **/quizzes/:quizId/questions/:questionId/alternatives/many**
``` bash
[
  { "text": "<doctype>", "isCorrect": false, "questionId": 1 },
  { "text": "<html>", "isCorrect": true, "questionId": 1 },
  { "text": "<header>", "isCorrect": false, "questionId": 1 },
  { "text": "<document>", "isCorrect": false, "questionId": 1 }
]
```

## Estrutura do projeto

``` bash
src/
|-- controllers/   # Lógica dos endpoints
|-- db/            # Configurações do Drizzle ORM e schemas
|-- middlewares/   # Autenticação, validações
|-- routes/        # Arquitetura RESTful
|-- schemas/       # Validação Zod
|-- services/      # Regras de negócio + banco
|-- types/         # Tipos TypeScript
|-- utils/         # Funções utilitárias
|-- drizzle/       # Configurações do Drizzle
|-- server.ts      # Entry-point do servidor
```


## Comandos de execução

- **npm run dev** (Roda em desenvolvimento)
- **npm run generate** (Gera schemas do Drizzle baseado no banco)
- **npm run build** (Compila TypeScript para JavaScript)
- **npm run start** (Inicia o servidor em produção)

## Instalação

Clone o repositório
``` bash
git clone https://github.com/seu-usuario/studyflow-api.git
cd studyflow-api
```

Instale as dependências
``` bash
npm install
```

Configure as variáveis de ambiente
``` bash
cp .env.example .env
```