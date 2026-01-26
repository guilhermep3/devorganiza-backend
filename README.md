# DevOrganiza

<img width="1351" height="760" alt="Image" src="https://github.com/user-attachments/assets/c64811c7-cc49-4740-9e3e-0fd9dd0986fe" />

A DevOrganiza é um web-app Full-stack onde o usuário pode organizar seus estudos e tarefas, além de desbloquear quizzes relacionados aos conteúdos cadastrados para praticar o aprendizado.
O objetivo da DevOrganiza é organizar e facilitar os estudos dos desenvolvedores, tornando mais visível as suas metas e encurtando o tempo de alcançá-las.


## 📌 Visão Geral

Este repositório é a camada backend da DevOrganiza, uma API RESTful, desenvolvida em Node.js + TypeScript, responsável por gerenciar autenticação, estudos, tarefas, quizzes, dados de usuário e métricas de desempenho.

## 🎯 Objetivo do projeto

- Demonstrar domínio em Node.js + TypeScript
- Simular um ambiente próximo ao mundo real / produção
- Criar uma API REST organizada, escalável e validada
- Aplicar arquitetura em camadas (Layered Architecture)
- Implementar autenticação e autorização com JWT
- Trabalhar com ORM moderno e com migrations

## 🧩 Tecnologias utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web minimalista
- **Typescript**: Superset do JavaScript com tipagem estática
- **PostgreSQL**: Banco de dados relacional

## 🧩 Bibliotecas

- **Drizzle ORM**: ORM TypeScript-first para acesso ao banco de dados
- **Drizzle Kit**: CLI para migrações e geração de schemas
- **Zod**: Validação de dados
- **Helmet**: Segurança via headers HTTP
- **Jsonwebtoken**: Autenticação JWT
- **bcrypt-ts**: Hash seguro de senhas
- **Slug**: Geração de username único
- **Multer**: Upload de arquivos multipart/form-data
- **Cloudinary**: Armazenamento de imagens em nuvem

## 🏗️ Arquitetura

A aplicação segue arquitetura em camadas, separando responsabilidades e facilitando manutenção e escalabilidade.

- ### Camadas

  - **Routes**: Definição e versionamento das rotas
  - **Middlewares**: Autenticação, autorização e validações
  - **Controllers**: Interface HTTP (req/res)
  - **Services**: regras de negócio e orquestração
  - **Schemas**: Validação de dados com Zod
  - **DB/Repositories**: Persistência de dados com Drizzle ORM

- ### Fluxo de requisição:
  1. A Requisição chega pela rota
  2. Middlewares validam autenticação e permissões
  3. Controller recebe a requisição
  4. Schema valida os dados enviados com Zod
  5. Service executa a regra de negócio
  6. Drizzle ORM interage com o banco de dados
  7. Controller retorna a resposta HTTP

## 🚀 Funcionalidades Principais

- Cadastro e login de usuários
- Upload de imagem de perfil (Cloudinary)
- Autenticação via JWT
- Organização de estudos por temas, com criação de tarefas vinculadas
- CRUD completo de estudos e tarefas
- Sistema de quizzes desbloqueáveis conforme os estudos cadastrados
- Registro de tentativas, pontuação e tempo de jogatina do quiz
- Controle de acesso de rotas por tipo de usuário (user/admin)
- Endpoints de métricas para dashboards

## 🛣️ Rotas da API

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
| `POST`   | `/studies`          | Cria um estudo                          | ✔️       |
| `PUT`    | `/studies/:studyId` | Atualiza um estudo                      | ✔️       |
| `DELETE` | `/studies/:studyId` | Deleta um estudo                        | ✔️       |
| `POST`   | `/tasks/:studyId`   | Cria uma tarefa                         | ✔️       |
| `PUT`    | `/tasks/:taskId`    | Atualiza uma tarefa                     | ✔️       |
| `DELETE` | `/tasks/:taskId`    | Deleta uma tarefa                       | ✔️       |


### Rotas quizzes

| Método   | Rota                | Descrição                              | Auth?    |
| -------- | ------------------- | -------------------------------------- | -------- |
| `GET`    | `/quizzes/all`      | Retorna todos os quizzes               | ✔️       |
| `GET`    | `/quizzes/locked`   | Retorna quizzes bloqueados do usuário  | ✔️       |
| `GET`    | `/quizzes/attempts` | Retorna todas as tentativas do usuário | ✔️       |
| `GET`    | `/quizzes`          | Retorna quizzes disponíveis do usuário | ✔️       |
| `POST`   | `/quizzes/many`     | Cria vários quizzes                    | ✔️ (dev) |
| `POST`   | `/quizzes`          | Cria um quiz                           | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/unlock` | Desbloqueia um quiz para o usuário | ✔️       |
| `POST`   | `/quizzes/:quizId/image`  | Atualiza a imagem do quiz          | ✔️ (dev) |
| `GET`    | `/quizzes/:quizId` | Retorna os dados do quiz | ✔️       |
| `PUT`    | `/quizzes/:quizId` | Atualiza um quiz         | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId` | Deleta um quiz           | ✔️ (dev) |



### Rotas attempts

| Método   | Rota                               | Descrição                          | Auth? |
| -------- | ---------------------------------- | ---------------------------------- | ----- |
| `GET`    | `/quizzes/:quizId/attempts/last`   | Retorna a última tentativa do quiz | ✔️    |
| `POST`   | `/quizzes/:quizId/attempts/start`  | Inicia uma tentativa do quiz       | ✔️    |
| `PUT`    | `/quizzes/:quizId/attempts/finish` | Finaliza uma tentativa do quiz     | ✔️    |
| `DELETE` | `/quizzes/:quizId/attempts/delete` | Deleta a tentativa do quiz         | ✔️    |


### Rotas questions

| Método   | Rota                                     | Descrição                       | Auth?      |
| -------- | ---------------------------------------- | ------------------------------- | ---------- |
| `POST`   | `/quizzes/:quizId/questions`             | Cria uma pergunta     | ✔️ (dev) |
| `POST`   | `/quizzes/:quizId/questions/many`        | Cria várias perguntas | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/questions/:questionId` | Atualiza uma pergunta | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId/questions/:questionId` | Deleta uma pergunta   | ✔️ (dev) |

### Rotas alternatives

| Método   | Rota                                     | Descrição                       | Auth?      |
| -------- | ---------------------------------------- | ------------------------------- | ---------- |
| `POST`   | `/quizzes/:quizId/questions/alternatives`                            | Cria várias alternativas | ✔️ (dev) |
| `PUT`    | `/quizzes/:quizId/questions/:questionId/alternatives/:alternativeId` | Atualiza uma alternativa | ✔️ (dev) |
| `DELETE` | `/quizzes/:quizId/questions/:questionId/alternatives/:alternativeId` | Deleta uma alternativa   | ✔️ (dev) |


### Rotas charts

| Método   | Rota                        | Descrição           | Auth?    |
|----------|-----------------------------|---------------------|----------|
| `GET`    | `/weekly-productivity`      | Retorna as tarefas criadas e finalizadas em cada dia da semana | ✔️      |
| `GET`    | `/tasks-by-type`            | Retorna a quantidade de tarefas por setor (frontent, backend e ferramentas) | ✔️      |
| `GET`    | `/finished-tasks-by-month`  | Retorna a quantidade de tarefas finalizadas por mês | ✔️      |
| `GET`    | `/average-time-finish-task` | Retorna o tempo médio para finalizar tarefas de cada estudo  | ✔️      |
| `GET`    | `/average-score`            | Retorna a pontuação média por quiz | ✔️      |
| `GET`    | `/faster-attempts`          | Retorna as tentativas de quizzes mais rápidas  | ✔️      |


## 🛣️ Exemplos de retorno das rotas GET

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

- **/auth/signin**
``` bash
[
  "message": "Login bem sucedido",
  "token": "token",
  "user": {
    "id": "userid",
    "name": "nome",
    "username": "username",
    "email": "email@gmail.com",
    "profileImage": null,
    "role": "user",
    "createdAt": "2025-12-22T19:11:24.801Z"
  }
]
```

- **/studies**
``` bash
[
  {
    "study": {
      "id": "idestudo1",
      "name": "HTML",
      "type": "frontend",
      "link": "https://app.b7web.com.br/lesson/ae9f1a01-b8ed-4876-b386-a11e4df144ca",
      "description": "descrição estudo 1",
      "status": "finalizado",
      "progress": 100,
      "userId": "userId",
      "createdAt": "2025-12-22T19:11:24.801Z",
      "updatedAt": "2025-12-22T19:11:24.801Z"
    },
    "tasks": [
      {
        "id": "c15a2236-81fd-4f27-9895-4716c7428d18",
        "title": "Criar páginas de login",
        "link": null,
        "done": true,
        "studyId": "idestudo1",
        "createdAt": "2025-12-22T19:11:24.801Z",
        "finishIn": null,
        "finishedAt": "22025-12-22T19:11:24.801Z"
      },
    ]
  },
  {
    // mais estudos e tarefas...
  }
]
```

- **/quizzes**
``` bash
[
  {
    "id": "quizId",
    "title": "HTML",
    "description": "Pratique seus estudos com o quiz de HTML da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764444330/Quizzes/zvhoqjhiidbiylw5bggu.png",
    "createdAt": "2025-12-22T19:11:24.801Z",
    "updatedAt": "2025-12-22T19:11:24.801Z",
    "unlockedAt": "2025-12-22T19:11:24.801Z",
    "lastAttempt": {
      "id": "attemptId",
      "userId": "userId",
      "quizId": "quizId",
      "startedAt": "2025-12-22T19:11:24.801Z",
      "finishedAt": "2025-12-22T19:11:24.801Z",
      "score": 20,
      "durationSec": 300
    }
  },
  {
    // mais quizzes e tentativas...
  }
]
```

- **/quizzes/all**
``` bash
[
  {
    "id": "quizId",
    "title": "HTML",
    "description": "Pratique seus estudos com o quiz de HTML da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764444330/Quizzes/zvhoqjhiidbiylw5bggu.png",
    "createdAt": "2025-12-22T19:11:24.801Z",
    "updatedAt": "2025-12-22T19:11:24.801Z"
  },
  {
    "id": "quizId",
    "title": "CSS",
    "description": "Pratique seus estudos com o quiz de CSS da DevOrganiza",
    "type": "frontend",
    "imageUrl": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764451996/Quizzes/fxsjsrsim3jd14vu3xjc.png",
    "createdAt": "2025-12-22T19:11:24.801Z",
    "updatedAt": "2025-12-22T19:11:24.801Z"
  },
  {
    // mais quizzes...
  }
]
```

- **/quizzes/attempts**
``` bash
[
  {
    "id": "attemptId",
    "quizId": "quizId",
    "quizTitle": "HTML",
    "quizImage": "https://res.cloudinary.com/dvuxplf3j/image/upload/v1764444330/Quizzes/zvhoqjhiidbiylw5bggu.png",
    "startedAt": "2025-12-22T19:11:24.801Z",
    "finishedAt": "2025-12-22T19:11:24.801Z",
    "score": 20,
    "durationSec": 300
  },
]
```

## Estrutura do projeto

``` bash
src/
├── controllers/   # Camada HTTP
├── db/            # Configuração do Drizzle ORM e schemas
├── drizzle/       # Migrations e geração de schemas
├── lib/           # Configurações de bibliotecas
├── middlewares/   # Autenticação e validações
├── routes/        # Definição das rotas
├── schemas/       # Validação com Zod
├── services/      # Regras de negócio
├── types/         # Tipos TypeScript
├── utils/         # Funções utilitárias
└── server.ts      # Entry-point da aplicação
```

## Comandos de execução

- **npm run dev**: Roda em desenvolvimento
- **npm run generate**: Gera schemas do Drizzle baseado no banco
- **npm run build**: Compila TypeScript para JavaScript
- **npm run start**: Inicia o servidor em produção

## ⚙️ Pré-requisitos
- Node.js (versão 18+)
- PostgreSQL (versão 12+)
- npm ou yarn

## Instalação

Clone o repositório
``` bash
git clone https://github.com/guilhermep3/devorganiza-backend
cd devorganiza-backend
```

Instale as dependências
``` bash
npm install
```

Configure as variáveis de ambiente
``` bash
cp .env.example .env
```