import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import TurmasView from '@/views/TurmasView.vue'
import AlunosView from '@/views/AlunosView.vue'
import EmprestimosView from '@/views/EmprestimosView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/turmas',
      name: 'turmas',
      component: TurmasView
    },
    {
      path: '/alunos',
      name: 'alunos',
      component: AlunosView
    },
    {
      path: '/emprestimos',
      name: 'emprestimos',
      component: EmprestimosView
    }
  ]
})

export default router
