const STORAGE_KEY = 'biblioescola_db';

const defaultData = {
  turmas: [],
  alunos: [],
  emprestimos: []
};

function init() {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }
}

function getData() {
  init();
  if (typeof window === 'undefined') return defaultData;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch (e) {
    console.error('Failed to parse localStorage data:', e);
    return defaultData;
  }
}

function saveData(data) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

export default {
  // Turmas
  getTurmas() {
    return getData().turmas || [];
  },
  saveTurmas(turmas) {
    const data = getData();
    data.turmas = turmas;
    saveData(data);
  },
  
  // Alunos
  getAlunos() {
    return getData().alunos || [];
  },
  saveAlunos(alunos) {
    const data = getData();
    data.alunos = alunos;
    saveData(data);
  },

  // Emprestimos
  getEmprestimos() {
    return getData().emprestimos || [];
  },
  saveEmprestimos(emprestimos) {
    const data = getData();
    data.emprestimos = emprestimos;
    saveData(data);
  }
};
