const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  dashboard: {
    resumo: () => ipcRenderer.invoke('dashboard:resumo'),
    emprestimosAbertos: () => ipcRenderer.invoke('dashboard:emprestimosAbertos')
  },
  turmas: {
    listar: () => ipcRenderer.invoke('turmas:listar'),
    criar: (payload) => ipcRenderer.invoke('turmas:criar', payload),
    editar: (payload) => ipcRenderer.invoke('turmas:editar', payload),
    remover: (id) => ipcRenderer.invoke('turmas:remover', id)
  },
  alunos: {
    listar: () => ipcRenderer.invoke('alunos:listar'),
    criar: (payload) => ipcRenderer.invoke('alunos:criar', payload),
    editar: (payload) => ipcRenderer.invoke('alunos:editar', payload),
    remover: (id) => ipcRenderer.invoke('alunos:remover', id),
    historico: (alunoId) => ipcRenderer.invoke('alunos:historico', alunoId)
  },
  emprestimos: {
    listar: () => ipcRenderer.invoke('emprestimos:listar'),
    criar: (payload) => ipcRenderer.invoke('emprestimos:criar', payload),
    devolver: (id) => ipcRenderer.invoke('emprestimos:devolver', id),
    remover: (id) => ipcRenderer.invoke('emprestimos:remover', id)
  }
});
