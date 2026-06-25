const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('../constants');

function registerDashboardIPC(db) {
  ipcMain.handle(IPC_CHANNELS.DASHBOARD.RESUMO, async () => {
    const data = db.read();
    const turmas = data.turmas || [];
    const alunos = data.alunos || [];
    const emprestimos = data.emprestimos || [];

    const totalTurmas = turmas.length;
    const totalAlunos = alunos.length;
    const totalEmprestimosAbertos = emprestimos.filter(e => e.status === 'emprestado').length;
    const totalEmprestimosDevolvidos = emprestimos.filter(e => e.status === 'devolvido').length;

    return {
      totalTurmas,
      totalAlunos,
      totalEmprestimosAbertos,
      totalEmprestimosDevolvidos
    };
  });

  ipcMain.handle(IPC_CHANNELS.DASHBOARD.EMPRESTIMOS_ABERTOS, async () => {
    const data = db.read();
    const emprestimos = data.emprestimos || [];
    const alunos = data.alunos || [];
    const turmas = data.turmas || [];

    const abertos = emprestimos.filter(e => e.status === 'emprestado');

    return abertos.map(emp => {
      const aluno = alunos.find(a => a.id === emp.alunoId);
      const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
      return {
        ...emp,
        alunoNome: aluno ? aluno.nome : 'Aluno Excluído',
        turmaNome: turma ? turma.nome : 'Sem Turma'
      };
    });
  });
}

module.exports = registerDashboardIPC;
