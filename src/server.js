import express from 'express';
import { randomUUID } from 'node:crypto';
import { lerTarefas, guardarTarefas } from './db.js';

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Tarefas a funcionar 🚀', rotas: ['/tarefas'] });
});

// Listar tarefas (com filtros opcionais ?concluida=true&pesquisa=texto)
app.get('/tarefas', async (req, res) => {
  let tarefas = await lerTarefas();
  const { concluida, pesquisa } = req.query;

  if (concluida !== undefined) {
    tarefas = tarefas.filter((t) => t.concluida === (concluida === 'true'));
  }
  if (pesquisa) {
    const termo = pesquisa.toLowerCase();
    tarefas = tarefas.filter((t) => t.titulo.toLowerCase().includes(termo));
  }
  res.json(tarefas);
});

app.get('/tarefas/:id', async (req, res) => {
  const tarefa = (await lerTarefas()).find((t) => t.id === req.params.id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
  res.json(tarefa);
});

app.post('/tarefas', async (req, res) => {
  const { titulo, descricao = '' } = req.body ?? {};
  if (!titulo || !String(titulo).trim()) {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório' });
  }

  const tarefas = await lerTarefas();
  const nova = {
    id: randomUUID(),
    titulo: String(titulo).trim(),
    descricao,
    concluida: false,
    criadaEm: new Date().toISOString(),
  };
  tarefas.push(nova);
  await guardarTarefas(tarefas);
  res.status(201).json(nova);
});

app.put('/tarefas/:id', async (req, res) => {
  const tarefas = await lerTarefas();
  const indice = tarefas.findIndex((t) => t.id === req.params.id);
  if (indice === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

  const { titulo, descricao, concluida } = req.body ?? {};
  if (titulo !== undefined && !String(titulo).trim()) {
    return res.status(400).json({ erro: 'O título não pode estar vazio' });
  }

  const atual = tarefas[indice];
  tarefas[indice] = {
    ...atual,
    titulo: titulo !== undefined ? String(titulo).trim() : atual.titulo,
    descricao: descricao ?? atual.descricao,
    concluida: concluida !== undefined ? Boolean(concluida) : atual.concluida,
    atualizadaEm: new Date().toISOString(),
  };
  await guardarTarefas(tarefas);
  res.json(tarefas[indice]);
});

app.delete('/tarefas/:id', async (req, res) => {
  const tarefas = await lerTarefas();
  const restantes = tarefas.filter((t) => t.id !== req.params.id);
  if (restantes.length === tarefas.length) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  await guardarTarefas(restantes);
  res.status(204).end();
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(erro.status || 500).json({ erro: erro.status ? erro.message : 'Erro interno do servidor' });
});

app.listen(PORTA, () => console.log(`✅ Servidor em http://localhost:${PORTA}`));
