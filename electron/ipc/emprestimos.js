const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('../constants');

function registerEmprestimosIPC(db) {
  ipcMain.handle(IPC_CHANNELS.EMPRESTIMOS.LISTAR, async () => {
    const data = db.read();
    const emprestimos = data.emprestimos || [];
    const alunos = data.alunos || [];
    const turmas = data.turmas || [];

    return emprestimos.map(emp => {
      const aluno = alunos.find(a => a.id === emp.alunoId);
      const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
      return {
        ...emp,
        alunoNome: aluno ? aluno.nome : 'Aluno Excluído',
        turmaNome: turma ? turma.nome : 'Sem Turma',
        turmaId: turma ? turma.id : null
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.EMPRESTIMOS.CRIAR, async (event, payload) => {
    if (!payload) {
      throw new Error('Dados do empréstimo inválidos.');
    }
    if (!payload.alunoId) {
      throw new Error('Selecione um aluno para registrar o empréstimo.');
    }
    if (!payload.livro || !payload.livro.trim()) {
      throw new Error('Informe o nome do livro.');
    }
    if (!payload.dataEmprestimo) {
      throw new Error('A data do empréstimo é obrigatória.');
    }

    const data = db.read();
    
    // Check student existence
    const studentExists = data.alunos.some(a => a.id === payload.alunoId);
    if (!studentExists) {
      throw new Error('O aluno selecionado não existe.');
    }

    const newEmp = {
      id: Date.now().toString(),
      alunoId: payload.alunoId,
      livro: payload.livro.trim(),
      dataEmprestimo: payload.dataEmprestimo,
      dataDevolucao: null,
      status: 'emprestado'
    };

    data.emprestimos.push(newEmp);
    db.write(data);
    return newEmp;
  });

  ipcMain.handle(IPC_CHANNELS.EMPRESTIMOS.DEVOLVER, async (event, id) => {
    if (!id) {
      throw new Error('ID do empréstimo é obrigatório.');
    }

    const data = db.read();
    const index = data.emprestimos.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Empréstimo não encontrado.');
    }

    data.emprestimos[index] = {
      ...data.emprestimos[index],
      dataDevolucao: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: 'devolvido'
    };

    db.write(data);
    return data.emprestimos[index];
  });

  ipcMain.handle(IPC_CHANNELS.EMPRESTIMOS.REMOVER, async (event, id) => {
    if (!id) {
      throw new Error('ID do empréstimo é obrigatório.');
    }

    const data = db.read();
    const initialLength = data.emprestimos.length;
    data.emprestimos = data.emprestimos.filter(e => e.id !== id);

    if (data.emprestimos.length < initialLength) {
      db.write(data);
      return true;
    }
    return false;
  });
}

module.exports = registerEmprestimosIPC;
