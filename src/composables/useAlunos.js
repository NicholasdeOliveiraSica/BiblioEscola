import { ref } from 'vue';
import db from '@/services/localStorageService';

export function useAlunos() {
  const alunos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarAlunos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = db.getAlunos();
      const turmas = db.getTurmas();
      const emprestimos = db.getEmprestimos();

      alunos.value = data.map(aluno => {
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
    } catch (err) {
      console.error('Error fetching alunos:', err);
      error.value = err.message || 'Falha ao buscar os alunos.';
    } finally {
      loading.value = false;
    }
  };

  const criarAluno = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      if (!payload || !payload.nome || !payload.nome.trim()) {
        throw new Error('Informe o nome do aluno.');
      }
      if (!payload.turmaId) {
        throw new Error('Selecione uma turma para o aluno.');
      }

      const turmas = db.getTurmas();
      const classExists = turmas.some(t => t.id === payload.turmaId);
      if (!classExists) {
        throw new Error('A turma selecionada não existe.');
      }

      const data = db.getAlunos();
      const newAluno = {
        id: Date.now().toString(),
        nome: payload.nome.trim(),
        turmaId: payload.turmaId
      };

      data.push(newAluno);
      db.saveAlunos(data);
      await listarAlunos();
      return newAluno;
    } catch (err) {
      console.error('Error creating aluno:', err);
      error.value = err.message || 'Falha ao criar aluno.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const editarAluno = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      if (!payload || !payload.id || !payload.nome || !payload.nome.trim()) {
        throw new Error('Nome do aluno é obrigatório.');
      }
      if (!payload.turmaId) {
        throw new Error('Selecione uma turma para o aluno.');
      }

      const turmas = db.getTurmas();
      const classExists = turmas.some(t => t.id === payload.turmaId);
      if (!classExists) {
        throw new Error('A turma selecionada não existe.');
      }

      const data = db.getAlunos();
      const index = data.findIndex(a => a.id === payload.id);
      if (index === -1) {
        throw new Error('Aluno não encontrado.');
      }

      data[index] = {
        ...data[index],
        nome: payload.nome.trim(),
        turmaId: payload.turmaId
      };

      db.saveAlunos(data);
      await listarAlunos();
      return data[index];
    } catch (err) {
      console.error('Error editing aluno:', err);
      error.value = err.message || 'Falha ao editar aluno.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removerAluno = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      if (!id) {
        throw new Error('ID do aluno é obrigatório.');
      }

      const emprestimos = db.getEmprestimos();
      const hasActiveLoans = emprestimos.some(emp => emp.alunoId === id && emp.status === 'emprestado');
      if (hasActiveLoans) {
        throw new Error('Não é possível excluir o aluno porque ele possui empréstimos em aberto.');
      }

      const data = db.getAlunos();
      const filteredAlunos = data.filter(a => a.id !== id);
      db.saveAlunos(filteredAlunos);

      // Clean up closed history records to keep LocalStorage clean
      const filteredLoans = emprestimos.filter(emp => emp.alunoId !== id);
      db.saveEmprestimos(filteredLoans);

      await listarAlunos();
      return true;
    } catch (err) {
      console.error('Error deleting aluno:', err);
      error.value = err.message || 'Falha ao excluir aluno.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const historicoAluno = async (alunoId) => {
    loading.value = true;
    error.value = null;
    try {
      if (!alunoId) {
        throw new Error('ID do aluno é obrigatório.');
      }
      const emprestimos = db.getEmprestimos();
      const alunos = db.getAlunos();
      const turmas = db.getTurmas();

      const aluno = alunos.find(a => a.id === alunoId);
      const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
      
      const filterLoans = emprestimos.filter(e => e.alunoId === alunoId);
      
      return filterLoans.map(e => ({
        ...e,
        alunoNome: aluno ? aluno.nome : 'Excluído',
        turmaNome: turma ? turma.nome : 'Sem Turma'
      }));
    } catch (err) {
      console.error('Error fetching student history:', err);
      error.value = err.message || 'Falha ao carregar histórico do aluno.';
      return [];
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    await listarAlunos();
  };

  return {
    alunos,
    loading,
    error,
    listarAlunos,
    criarAluno,
    editarAluno,
    removerAluno,
    historicoAluno,
    refresh
  };
}
