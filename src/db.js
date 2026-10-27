import { readFile, writeFile, mkdir } from 'node:fs/promises';

// Os dados são guardados num ficheiro JSON para manter o projeto simples
const PASTA = new URL('../data/', import.meta.url);
const FICHEIRO = new URL('tarefas.json', PASTA);

export async function lerTarefas() {
  try {
    return JSON.parse(await readFile(FICHEIRO, 'utf-8'));
  } catch (erro) {
    if (erro.code === 'ENOENT') return [];
    throw erro;
  }
}

export async function guardarTarefas(tarefas) {
  await mkdir(PASTA, { recursive: true });
  await writeFile(FICHEIRO, JSON.stringify(tarefas, null, 2));
}
