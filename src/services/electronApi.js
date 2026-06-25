const hasElectronApi = typeof window !== 'undefined' && !!window.api;

const electronApi = hasElectronApi 
  ? window.api 
  : {
      dashboard: {
        resumo: async () => {
          console.warn('Electron API not found. Returning mock resumen.');
          return {
            totalTurmas: 0,
            totalAlunos: 0,
            totalEmprestimosAbertos: 0,
            totalEmprestimosDevolvidos: 0
          };
        },
        emprestimosAbertos: async () => {
          console.warn('Electron API not found. Returning mock active loans.');
          return [];
        }
      },
      turmas: {
        listar: async () => {
          console.warn('Electron API not found. Returning mock turmas list.');
          return [];
        },
        criar: async (payload) => {
          console.warn('Electron API not found. Creating mock turma.');
          return { id: Date.now().toString(), ...payload, alunosCount: 0 };
        },
        editar: async (payload) => {
          console.warn('Electron API not found. Editing mock turma.');
          return { ...payload };
        },
        remover: async (id) => {
          console.warn(`Electron API not found. Removing mock turma ${id}.`);
          return true;
        }
      },
      alunos: {
        listar: async () => {
          console.warn('Electron API not found. Returning mock alunos list.');
          return [];
        },
        criar: async (payload) => {
          console.warn('Electron API not found. Creating mock aluno.');
          return { id: Date.now().toString(), ...payload, turmaNome: 'Mock Turma', totalEmprestimos: 0, emprestimosAbertos: 0 };
        },
        editar: async (payload) => {
          console.warn('Electron API not found. Editing mock aluno.');
          return { ...payload, turmaNome: 'Mock Turma' };
        },
        remover: async (id) => {
          console.warn(`Electron API not found. Removing mock aluno ${id}.`);
          return true;
        },
        historico: async (alunoId) => {
          console.warn(`Electron API not found. Returning mock history for student ${alunoId}.`);
          return [];
        }
      },
      emprestimos: {
        listar: async () => {
          console.warn('Electron API not found. Returning mock loans list.');
          return [];
        },
        criar: async (payload) => {
          console.warn('Electron API not found. Creating mock loan.');
          return { id: Date.now().toString(), ...payload, dataDevolucao: null, status: 'emprestado', alunoNome: 'Mock Aluno', turmaNome: 'Mock Turma' };
        },
        devolver: async (id) => {
          console.warn(`Electron API not found. Returning mock returned loan for ${id}.`);
          return { id, dataDevolucao: new Date().toISOString().split('T')[0], status: 'devolvido' };
        },
        remover: async (id) => {
          console.warn(`Electron API not found. Removing mock loan ${id}.`);
          return true;
        }
      }
    };

export default electronApi;
