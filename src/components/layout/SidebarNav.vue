<script setup>
import { useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen 
} from 'lucide-vue-next';

const route = useRoute();

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Turmas', path: '/turmas', icon: GraduationCap },
  { name: 'Alunos', path: '/alunos', icon: Users },
  { name: 'Empréstimos', path: '/emprestimos', icon: BookOpen }
];

const isActive = (path) => {
  return route.path.startsWith(path);
};
</script>

<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 select-none">
    <!-- Brand Title -->
    <div class="h-16 flex items-center px-6 border-b border-slate-800 space-x-2.5">
      <div class="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
        <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div>
        <h1 class="text-sm font-bold text-white leading-none">BiblioEscola</h1>
        <span class="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Painel Offline</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group"
        :class="isActive(item.path) 
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10' 
          : 'hover:bg-slate-800 hover:text-slate-100'"
      >
        <component 
          :is="item.icon" 
          class="h-4.5 w-4.5 mr-3 flex-shrink-0 transition-colors"
          :class="isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'"
        />
        {{ item.name }}
      </RouterLink>
    </nav>

    <!-- Version Info Footer -->
    <div class="p-6 border-t border-slate-800 text-[11px] text-slate-500 font-medium">
      <p>Biblioteca Escolar v1.0.0</p>
      <p class="mt-0.5">Banco de dados Local</p>
    </div>
  </aside>
</template>
