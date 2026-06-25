# 📚 Sistema de Biblioteca Escolar

Um sistema completo e simples para gestão de bibliotecas escolares. Desenvolvido para fornecer uma experiência moderna e eficiente, com Vue 3, Tailwind CSS e Electron.

O projeto possui duas versões:
- 🖥️ **Desktop**: Totalmente offline, baseada em Electron, com dados salvos em arquivo JSON local.
- 🌐 **Web Demo**: Executa no navegador, utilizando Vue + Vite, com persistência via LocalStorage.

## 🚀 Sobre o projeto

Gerencie facilmente turmas, alunos e empréstimos em poucos cliques, com foco em simplicidade e usabilidade. Não existe cadastro separado de livros: o nome do livro é fornecido no momento do empréstimo.

## 🧱 Tecnologias

**Desktop:**  
Vue 3 · Electron · Tailwind CSS · Persistência local via JSON

**Web Demo:**  
Vue 3 · Vite · Tailwind CSS · Persistência no LocalStorage do navegador

## 📦 Funcionalidades

- **Dashboard:** Visão geral do sistema, totais de turmas, alunos e status de empréstimos (abertos e devolvidos)
- **Turmas:** Criar, editar, excluir e visualizar quantidade de alunos por turma
- **Alunos:** CRUD completo, associação com turmas e histórico de empréstimos
- **Empréstimos:** Criar e devolver livros, controle de status (emprestado/devolvido), filtros e busca

## 💾 Persistência

- **Desktop:** Dados 100% offline, salvos localmente em arquivo JSON
- **Web Demo:** Persistência usando LocalStorage do navegador

## 🖥️ Como executar

Instale as dependências:
```
npm install
```

Rode a versão web (demo):
```
npm run dev
```

Rode a versão desktop (Electron):
```
npm run electron:dev
```

Para gerar o build desktop (Windows):
```
npm run dist
```

## 📁 Estrutura do projeto

```
src/
 ├─ components/
 ├─ views/
 ├─ composables/
 ├─ services/
 ├─ router/

electron/
 ├─ main.js
 ├─ preload.js
 ├─ db.js
```

## 📌 Observações

- Versão desktop funciona completamente offline, sem necessidade de backend ou APIs externas.
- Interface moderna e responsiva, feita com Tailwind CSS.
- Estrutura clara separando código web e desktop.
- Focado em simplicidade e experiência do usuário.