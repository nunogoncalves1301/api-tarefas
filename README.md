# 📝 API de Tarefas

API REST para gerir uma lista de tarefas (to-do), feita com **Node.js** e **Express**.
Foi o meu primeiro projeto de back-end, focado nos conceitos base de uma API REST.

## 🛠️ Tecnologias
- Node.js (ES Modules)
- Express 5
- Persistência em ficheiro JSON (`fs/promises`)

## ▶️ Como executar
```bash
npm install
npm run dev
```
O servidor arranca em `http://localhost:3000`.

## 📚 Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista tarefas (filtros: `?concluida=true`, `?pesquisa=texto`) |
| GET | `/tarefas/:id` | Obtém uma tarefa |
| POST | `/tarefas` | Cria uma tarefa (`titulo` obrigatório) |
| PUT | `/tarefas/:id` | Atualiza título, descrição ou estado |
| DELETE | `/tarefas/:id` | Apaga uma tarefa |

Exemplos prontos a usar no ficheiro [`pedidos.http`](pedidos.http).

## 💡 O que aprendi
- Métodos HTTP e códigos de estado (200, 201, 204, 400, 404, 500)
- Middleware no Express e tratamento centralizado de erros
- Leitura/escrita assíncrona de ficheiros
