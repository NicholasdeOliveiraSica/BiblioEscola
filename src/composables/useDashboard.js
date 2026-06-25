import { ref } from 'vue';
import electronApi from '@/services/electronApi';

export function useDashboard() {
  const resumo = ref({
    totalTurmas: 0,
    totalAlunos: 0,
    totalEmprestimosAbertos: 0,
    totalEmprestimosDevolvidos: 0
  });
  const emprestimosAbertos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchResumo = async () => {
    loading.value = true;
    error.value = null;
    try {
      resumo.value = await electronApi.dashboard.resumo();
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      error.value = err.message || 'Falha ao carregar o resumo do dashboard.';
    } finally {
      loading.value = false;
    }
  };

  const fetchEmprestimosAbertos = async () => {
    loading.value = true;
    error.value = null;
    try {
      emprestimosAbertos.value = await electronApi.dashboard.emprestimosAbertos();
    } catch (err) {
      console.error('Error fetching active loans:', err);
      error.value = err.message || 'Falha ao carregar empréstimos em aberto.';
    } finally {
      loading.value = false;
    }
  };

  return {
    resumo,
    emprestimosAbertos,
    loading,
    error,
    fetchResumo,
    fetchEmprestimosAbertos
  };
}
