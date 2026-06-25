import { ref } from 'vue';
import electronApi from '@/services/electronApi';

export function useEmprestimos() {
  const emprestimos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarEmprestimos = async () => {
    loading.value = true;
    error.value = null;
    try {
      emprestimos.value = await electronApi.emprestimos.listar();
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
      const created = await electronApi.emprestimos.criar(payload);
      await listarEmprestimos();
      return created;
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
      const returned = await electronApi.emprestimos.devolver(id);
      await listarEmprestimos();
      return returned;
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
      await electronApi.emprestimos.remover(id);
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
