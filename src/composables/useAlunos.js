import { ref } from 'vue';
import electronApi from '@/services/electronApi';

export function useAlunos() {
  const alunos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarAlunos = async () => {
    loading.value = true;
    error.value = null;
    try {
      alunos.value = await electronApi.alunos.listar();
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
      const created = await electronApi.alunos.criar(payload);
      await listarAlunos();
      return created;
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
      const edited = await electronApi.alunos.editar(payload);
      await listarAlunos();
      return edited;
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
      await electronApi.alunos.remover(id);
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
      return await electronApi.alunos.historico(alunoId);
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
