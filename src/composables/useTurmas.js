import { ref } from 'vue';
import electronApi from '@/services/electronApi';

export function useTurmas() {
  const turmas = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarTurmas = async () => {
    loading.value = true;
    error.value = null;
    try {
      turmas.value = await electronApi.turmas.listar();
    } catch (err) {
      console.error('Error fetching turmas:', err);
      error.value = err.message || 'Falha ao buscar as turmas.';
    } finally {
      loading.value = false;
    }
  };

  const criarTurma = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const created = await electronApi.turmas.criar(payload);
      await listarTurmas();
      return created;
    } catch (err) {
      console.error('Error creating turma:', err);
      error.value = err.message || 'Falha ao criar turma.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const editarTurma = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const edited = await electronApi.turmas.editar(payload);
      await listarTurmas();
      return edited;
    } catch (err) {
      console.error('Error editing turma:', err);
      error.value = err.message || 'Falha ao editar turma.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removerTurma = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await electronApi.turmas.remover(id);
      await listarTurmas();
      return true;
    } catch (err) {
      console.error('Error deleting turma:', err);
      error.value = err.message || 'Falha ao excluir turma.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    await listarTurmas();
  };

  return {
    turmas,
    loading,
    error,
    listarTurmas,
    criarTurma,
    editarTurma,
    removerTurma,
    refresh
  };
}
