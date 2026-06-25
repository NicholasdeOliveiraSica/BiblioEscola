const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('../constants');

function registerTurmasIPC(db) {
  ipcMain.handle(IPC_CHANNELS.TURMAS.LISTAR, async () => {
    const data = db.read();
    const turmas = data.turmas || [];
    const alunos = data.alunos || [];

    return turmas.map(t => {
      const count = alunos.filter(a => a.turmaId === t.id).length;
      return {
        ...t,
        alunosCount: count
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.TURMAS.CRIAR, async (event, payload) => {
    if (!payload || !payload.nome || !payload.nome.trim()) {
      throw new Error('Informe o nome da turma.');
    }

    const data = db.read();
    const nomeNorm = payload.nome.trim().toLowerCase();

    // Check duplicate
    const isDuplicate = data.turmas.some(t => t.nome.trim().toLowerCase() === nomeNorm);
    if (isDuplicate) {
      throw new Error('Já existe uma turma cadastrada com este nome.');
    }

    const newTurma = {
      id: Date.now().toString(),
      nome: payload.nome.trim()
    };

    data.turmas.push(newTurma);
    db.write(data);
    return newTurma;
  });

  ipcMain.handle(IPC_CHANNELS.TURMAS.EDITAR, async (event, payload) => {
    if (!payload || !payload.id || !payload.nome || !payload.nome.trim()) {
      throw new Error('Nome da turma é obrigatório.');
    }

    const data = db.read();
    const nomeNorm = payload.nome.trim().toLowerCase();

    // Check duplicate excluding self
    const isDuplicate = data.turmas.some(t => t.id !== payload.id && t.nome.trim().toLowerCase() === nomeNorm);
    if (isDuplicate) {
      throw new Error('Já existe outra turma cadastrada com este nome.');
    }

    const index = data.turmas.findIndex(t => t.id === payload.id);
    if (index === -1) {
      throw new Error('Turma não encontrada.');
    }

    data.turmas[index] = {
      ...data.turmas[index],
      nome: payload.nome.trim()
    };

    db.write(data);
    return data.turmas[index];
  });

  ipcMain.handle(IPC_CHANNELS.TURMAS.REMOVER, async (event, id) => {
    if (!id) {
      throw new Error('ID da turma é obrigatório.');
    }

    const data = db.read();

    // Check if there are linked students
    const hasStudents = data.alunos && data.alunos.some(a => a.turmaId === id);
    if (hasStudents) {
      throw new Error('Não é possível excluir a turma porque existem alunos vinculados.');
    }

    const initialLength = data.turmas.length;
    data.turmas = data.turmas.filter(t => t.id !== id);

    if (data.turmas.length < initialLength) {
      db.write(data);
      return true;
    }
    return false;
  });
}

module.exports = registerTurmasIPC;
