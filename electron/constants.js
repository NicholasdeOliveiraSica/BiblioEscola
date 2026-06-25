module.exports = {
  IPC_CHANNELS: {
    DASHBOARD: {
      RESUMO: 'dashboard:resumo',
      EMPRESTIMOS_ABERTOS: 'dashboard:emprestimosAbertos',
    },
    TURMAS: {
      LISTAR: 'turmas:listar',
      CRIAR: 'turmas:criar',
      EDITAR: 'turmas:editar',
      REMOVER: 'turmas:remover',
    },
    ALUNOS: {
      LISTAR: 'alunos:listar',
      CRIAR: 'alunos:criar',
      EDITAR: 'alunos:editar',
      REMOVER: 'alunos:remover',
      HISTORICO: 'alunos:historico',
    },
    EMPRESTIMOS: {
      LISTAR: 'emprestimos:listar',
      CRIAR: 'emprestimos:criar',
      DEVOLVER: 'emprestimos:devolver',
      REMOVER: 'emprestimos:remover',
    }
  }
};
