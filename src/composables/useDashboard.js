import { ref } from 'vue';
import db from '@/services/localStorageService';

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
      const turmas = db.getTurmas();
      const alunos = db.getAlunos();
      const emprestimos = db.getEmprestimos();

      resumo.value = {
        totalTurmas: turmas.length,
        totalAlunos: alunos.length,
        totalEmprestimosAbertos: emprestimos.filter(e => e.status === 'emprestado').length,
        totalEmprestimosDevolvidos: emprestimos.filter(e => e.status === 'devolvido').length
      };
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
      const emprestimos = db.getEmprestimos();
      const alunos = db.getAlunos();
      const turmas = db.getTurmas();

      const abertos = emprestimos.filter(e => e.status === 'emprestado');
      emprestimosAbertos.value = abertos.map(emp => {
        const aluno = alunos.find(a => a.id === emp.alunoId);
        const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
        return {
          ...emp,
          alunoNome: aluno ? aluno.nome : 'Aluno Excluído',
          turmaNome: turma ? turma.nome : 'Sem Turma'
        };
      });
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
