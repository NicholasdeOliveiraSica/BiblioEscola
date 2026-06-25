import { ref } from 'vue';
import db from '@/services/localStorageService';

export function useEmprestimos() {
  const emprestimos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarEmprestimos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = db.getEmprestimos();
      const alunos = db.getAlunos();
      const turmas = db.getTurmas();

      emprestimos.value = data.map(emp => {
        const aluno = alunos.find(a => a.id === emp.alunoId);
        const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
        return {
          ...emp,
          alunoNome: aluno ? aluno.nome : 'Aluno Excluído',
          turmaNome: turma ? turma.nome : 'Sem Turma',
          turmaId: turma ? turma.id : null
        };
      });
    } catch (err) {
      console.error('Error fetching loans:', err);
      error.value = err.message || 'Falha ao buscar os empréstimos.';
    } finally {
      loading.value = false;
    }
  };

  const criarEmprestimo = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
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

      const alunos = db.getAlunos();
      const studentExists = alunos.some(a => a.id === payload.alunoId);
      if (!studentExists) {
        throw new Error('O aluno selecionado não existe.');
      }

      const data = db.getEmprestimos();
      const newEmp = {
        id: Date.now().toString(),
        alunoId: payload.alunoId,
        livro: payload.livro.trim(),
        dataEmprestimo: payload.dataEmprestimo,
        dataDevolucao: null,
        status: 'emprestado'
      };

      data.push(newEmp);
      db.saveEmprestimos(data);
      await listarEmprestimos();
      return newEmp;
    } catch (err) {
      console.error('Error creating loan:', err);
      error.value = err.message || 'Falha ao registrar empréstimo.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const devolverEmprestimo = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      if (!id) {
        throw new Error('ID do empréstimo é obrigatório.');
      }

      const data = db.getEmprestimos();
      const index = data.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error('Empréstimo não encontrado.');
      }

      data[index] = {
        ...data[index],
        dataDevolucao: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        status: 'devolvido'
      };

      db.saveEmprestimos(data);
      await listarEmprestimos();
      return data[index];
    } catch (err) {
      console.error('Error returning loan:', err);
      error.value = err.message || 'Falha ao registrar devolução do livro.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removerEmprestimo = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      if (!id) {
        throw new Error('ID do empréstimo é obrigatório.');
      }

      const data = db.getEmprestimos();
      const filtered = data.filter(e => e.id !== id);
      db.saveEmprestimos(filtered);
      await listarEmprestimos();
      return true;
    } catch (err) {
      console.error('Error deleting loan record:', err);
      error.value = err.message || 'Falha ao excluir o empréstimo.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    await listarEmprestimos();
  };

  return {
    emprestimos,
    loading,
    error,
    listarEmprestimos,
    criarEmprestimo,
    devolverEmprestimo,
    removerEmprestimo,
    refresh
  };
}
