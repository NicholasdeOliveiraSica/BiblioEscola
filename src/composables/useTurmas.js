import { ref } from 'vue';
import db from '@/services/localStorageService';

export function useTurmas() {
  const turmas = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const listarTurmas = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = db.getTurmas();
      const alunos = db.getAlunos();
      turmas.value = data.map(t => ({
        ...t,
        alunosCount: alunos.filter(a => a.turmaId === t.id).length
      }));
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
      if (!payload || !payload.nome || !payload.nome.trim()) {
        throw new Error('Informe o nome da turma.');
      }
      const nomeNorm = payload.nome.trim().toLowerCase();
      const data = db.getTurmas();
      
      const isDuplicate = data.some(t => t.nome.trim().toLowerCase() === nomeNorm);
      if (isDuplicate) {
        throw new Error('Já existe uma turma cadastrada com este nome.');
      }

      const newTurma = {
        id: Date.now().toString(),
        nome: payload.nome.trim()
      };

      data.push(newTurma);
      db.saveTurmas(data);
      await listarTurmas();
      return newTurma;
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
      if (!payload || !payload.id || !payload.nome || !payload.nome.trim()) {
        throw new Error('Nome da turma é obrigatório.');
      }
      const nomeNorm = payload.nome.trim().toLowerCase();
      const data = db.getTurmas();

      const isDuplicate = data.some(t => t.id !== payload.id && t.nome.trim().toLowerCase() === nomeNorm);
      if (isDuplicate) {
        throw new Error('Já existe outra turma cadastrada com este nome.');
      }

      const index = data.findIndex(t => t.id === payload.id);
      if (index === -1) {
        throw new Error('Turma não encontrada.');
      }

      data[index] = {
        ...data[index],
        nome: payload.nome.trim()
      };

      db.saveTurmas(data);
      await listarTurmas();
      return data[index];
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
      if (!id) {
        throw new Error('ID da turma é obrigatório.');
      }
      const alunos = db.getAlunos();
      const hasStudents = alunos.some(a => a.turmaId === id);
      if (hasStudents) {
        throw new Error('Não é possível excluir a turma porque existem alunos vinculados.');
      }

      const data = db.getTurmas();
      const filtered = data.filter(t => t.id !== id);
      db.saveTurmas(filtered);
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
