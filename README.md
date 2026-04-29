# DevOrganiza - Backend

<img width="1351" height="760" alt="Image" src="https://github.com/user-attachments/assets/c64811c7-cc49-4740-9e3e-0fd9dd0986fe" />

API REST da DevOrganiza, responsável por autenticação, gerenciamento de estudos, tarefas, quizzes e métricas de desempenho.

---

## 🚀 Funcionalidades

- Autenticação com JWT
- Cadastro e gerenciamento de usuários
- CRUD de estudos e tarefas
- Sistema de quizzes com desbloqueio por estudo
- Registro de tentativas e pontuação
- Upload de imagens (Cloudinary)
- Endpoints de métricas para dashboard

---

## 🎯 Objetivo do projeto

- Construir uma API REST escalável e organizada
- Aplicar arquitetura em camadas (Controller → Service → Repository)
- Trabalhar com validação de dados e regras de negócio
- Implementar autenticação e autorização
- Utilizar ORM com migrations

---

## 🧩 Tecnologias

Node.js, Express, TypeScript, PostgreSQL  
Drizzle ORM, Zod, JWT, bcrypt, Multer, Cloudinary

---

## 🏗️ Arquitetura

Estrutura baseada em separação de responsabilidades:

- **controllers** → camada HTTP  
- **services** → regras de negócio  
- **repositories** → acesso ao banco  
- **middlewares** → autenticação e validações  
- **schemas** → validação com Zod  

---

## 📁 Estrutura do projeto

``` bash
src/
├── controllers/   # Camada HTTP
├── db/            # Configuração do Drizzle ORM e schemas
├── lib/           # Configurações de bibliotecas
├── middlewares/   # Autenticação e validações
├── repositories/  # Acesso ao banco de dados
├── routes/        # Definição das rotas
├── schemas/       # Validação com Zod
├── services/      # Regras de negócio
├── types/         # Tipos TypeScript
├── utils/         # Funções utilitárias
└── server.ts      # Entry-point da aplicação
```

---

## 🔐 Regras de Negócio

- Quizzes são desbloqueados com base nos estudos do usuário
- Progresso é calculado a partir das tarefas concluídas
- Cada estudo pode conter múltiplas tarefas
- Tentativas de quiz armazenam pontuação e tempo

---

## 🛣️ Exemplos de retorno das rotas GET

- **/auth/signup**
``` bash
[
  {
    "id": "userid",
    "name": "nome",
    "username": "username",
    "email": "email@gmail.com",
    "password": "senha",
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
        "finishedAt": "2025-12-22T19:11:24.801Z"
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

Projeto desenvolvido por <a href="https://github.com/guilhermep3" target="_blank">Guilherme Pereira</a>