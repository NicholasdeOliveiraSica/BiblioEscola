const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('../constants');

function registerAlunosIPC(db) {
  ipcMain.handle(IPC_CHANNELS.ALUNOS.LISTAR, async () => {
    const data = db.read();
    const alunos = data.alunos || [];
    const turmas = data.turmas || [];
    const emprestimos = data.emprestimos || [];

    return alunos.map(aluno => {
      const turma = turmas.find(t => t.id === aluno.turmaId);
      const alunoLoans = emprestimos.filter(e => e.alunoId === aluno.id);
      
      const totalEmprestimos = alunoLoans.length;
      const emprestimosAbertos = alunoLoans.filter(e => e.status === 'emprestado').length;

      return {
        ...aluno,
        turmaNome: turma ? turma.nome : 'Sem Turma',
        totalEmprestimos,
        emprestimosAbertos
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.ALUNOS.CRIAR, async (event, payload) => {
    if (!payload || !payload.nome || !payload.nome.trim()) {
      throw new Error('Informe o nome do aluno.');
    }
    if (!payload.turmaId) {
      throw new Error('Selecione uma turma para o aluno.');
    }

    const data = db.read();
    
    const classExists = data.turmas.some(t => t.id === payload.turmaId);
    if (!classExists) {
      throw new Error('A turma selecionada não existe.');
    }

    const newAluno = {
      id: Date.now().toString(),
      nome: payload.nome.trim(),
      turmaId: payload.turmaId
    };

    data.alunos.push(newAluno);
    db.write(data);
    return newAluno;
  });

  ipcMain.handle(IPC_CHANNELS.ALUNOS.EDITAR, async (event, payload) => {
    if (!payload || !payload.id || !payload.nome || !payload.nome.trim()) {
      throw new Error('Nome do aluno é obrigatório.');
    }
    if (!payload.turmaId) {
      throw new Error('Selecione uma turma para o aluno.');
    }

    const data = db.read();
    
    const classExists = data.turmas.some(t => t.id === payload.turmaId);
    if (!classExists) {
      throw new Error('A turma selecionada não existe.');
    }

    const index = data.alunos.findIndex(a => a.id === payload.id);
    if (index === -1) {
      throw new Error('Aluno não encontrado.');
    }

    data.alunos[index] = {
      ...data.alunos[index],
      nome: payload.nome.trim(),
      turmaId: payload.turmaId
    };

    db.write(data);
    return data.alunos[index];
  });

  ipcMain.handle(IPC_CHANNELS.ALUNOS.REMOVER, async (event, id) => {
    if (!id) {
      throw new Error('ID do aluno é obrigatório.');
    }

    const data = db.read();

    // Check if student has active borrow
    const hasActiveLoans = data.emprestimos && data.emprestimos.some(
      emp => emp.alunoId === id && emp.status === 'emprestado'
    );
    if (hasActiveLoans) {
      throw new Error('Não é possível excluir o aluno porque ele possui empréstimos em aberto.');
    }

    const initialLength = data.alunos.length;
    data.alunos = data.alunos.filter(a => a.id !== id);

    // Remove closed history records to keep DB clean
    data.emprestimos = data.emprestimos.filter(emp => emp.alunoId !== id);

    if (data.alunos.length < initialLength) {
      db.write(data);
      return true;
    }
    return false;
  });

  ipcMain.handle(IPC_CHANNELS.ALUNOS.HISTORICO, async (event, alunoId) => {
    if (!alunoId) {
      throw new Error('ID do aluno é obrigatório.');
    }
    const data = db.read();
    const emprestimos = data.emprestimos || [];
    const aluno = data.alunos.find(a => a.id === alunoId);
    const turma = aluno ? data.turmas.find(t => t.id === aluno.turmaId) : null;
    
    const filterLoans = emprestimos.filter(e => e.alunoId === alunoId);
    
    return filterLoans.map(e => ({
      ...e,
      alunoNome: aluno ? aluno.nome : 'Excluído',
      turmaNome: turma ? turma.nome : 'Sem Turma'
    }));
  });
}

module.exports = registerAlunosIPC;
