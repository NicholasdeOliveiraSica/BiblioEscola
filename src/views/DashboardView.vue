<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard } from '@/composables/useDashboard';
import { useEmprestimos } from '@/composables/useEmprestimos';
import { useToast } from '@/composables/useToast';
import PageHeader from '@/components/layout/PageHeader.vue';
import StatCard from '@/components/common/StatCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import DevolucaoConfirmModal from '@/components/emprestimos/DevolucaoConfirmModal.vue';
import { formatDate } from '@/utils/formatDate';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-vue-next';

const { resumo, emprestimosAbertos, loading, fetchResumo, fetchEmprestimosAbertos } = useDashboard();
const { devolverEmprestimo } = useEmprestimos();
const { showToast } = useToast();
const router = useRouter();

const showReturnConfirm = ref(false);
const selectedEmp = ref(null);

const loadData = async () => {
  await Promise.all([
    fetchResumo(),
    fetchEmprestimosAbertos()
  ]);
};

onMounted(() => {
  loadData();
});

const openReturnConfirm = (emp) => {
  selectedEmp.value = emp;
  showReturnConfirm.value = true;
};

const handleReturnConfirm = async () => {
  if (!selectedEmp.value) return;
  try {
    await devolverEmprestimo(selectedEmp.value.id);
    showToast('Devolução registrada com sucesso!');
    showReturnConfirm.value = false;
    await loadData();
  } catch (err) {
    showToast(err.message || 'Erro ao registrar devolução.', 'error');
  }
};
</script>

<template>
  <div>
    <PageHeader 
      title="Dashboard" 
      description="Visão geral e estatísticas da biblioteca escolar." 
    />

    <!-- Stats grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total de Alunos" 
        :value="resumo.totalAlunos" 
        color="brand"
      >
        <template #icon>
          <Users class="h-5 w-5" />
        </template>
      </StatCard>

      <StatCard 
        title="Total de Turmas" 
        :value="resumo.totalTurmas" 
        color="amber"
      >
        <template #icon>
          <GraduationCap class="h-5 w-5" />
        </template>
      </StatCard>

      <StatCard 
        title="Empréstimos em Aberto" 
        :value="resumo.totalEmprestimosAbertos" 
        color="rose"
      >
        <template #icon>
          <BookOpen class="h-5 w-5" />
        </template>
      </StatCard>

      <StatCard 
        title="Devolvidos" 
        :value="resumo.totalEmprestimosDevolvidos" 
        color="emerald"
      >
        <template #icon>
          <CheckCircle class="h-5 w-5" />
        </template>
      </StatCard>
    </div>

    <!-- Quick Actions & Recent Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left side: Active loans list -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col min-h-[300px]">
        <h3 class="text-sm font-bold text-slate-800 mb-4 select-none flex items-center">
          <span class="inline-block w-1.5 h-3 bg-brand-500 rounded-full mr-2"></span>
          Empréstimos em Aberto (Ativos)
        </h3>

        <div v-if="loading && emprestimosAbertos.length === 0" class="py-12 flex-1 flex items-center justify-center">
          <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="emprestimosAbertos.length === 0" class="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Nenhum empréstimo pendente" 
            description="Todos os livros foram devolvidos e estão em estoque." 
          />
        </div>

        <div class="overflow-x-auto flex-1" v-else>
          <table class="w-full text-left text-sm text-slate-600 border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                <th class="py-2.5 px-2">Livro</th>
                <th class="py-2.5 px-2">Aluno / Turma</th>
                <th class="py-2.5 px-2">Data Empréstimo</th>
                <th class="py-2.5 px-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in emprestimosAbertos" 
                :key="item.id" 
                class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td class="py-3 px-2 font-bold text-slate-800">{{ item.livro }}</td>
                <td class="py-3 px-2">
                  <div class="font-bold text-slate-700 leading-tight">{{ item.alunoNome }}</div>
                  <div class="text-[10px] text-slate-400 font-bold leading-none mt-0.5">{{ item.turmaNome }}</div>
                </td>
                <td class="py-3 px-2 font-semibold text-slate-500">{{ formatDate(item.dataEmprestimo) }}</td>
                <td class="py-3 px-2 text-right">
                  <BaseButton 
                    variant="ghost" 
                    class="p-1.5 h-auto text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                    title="Registrar Devolução"
                    @click="openReturnConfirm(item)"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right side: Quick Shortcuts -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col h-full">
        <h3 class="text-sm font-bold text-slate-800 mb-4 select-none flex items-center">
          <span class="inline-block w-1.5 h-3 bg-brand-500 rounded-full mr-2"></span>
          Ações Rápidas
        </h3>
        
        <div class="flex-1 flex flex-col space-y-3">
          <BaseButton 
            variant="secondary" 
            class="justify-between px-4 py-3 rounded-xl border border-slate-200 text-slate-750 font-bold hover:bg-brand-50/10 hover:text-brand-700 hover:border-brand-200 text-left transition-all"
            @click="router.push('/emprestimos?new=true')"
          >
            <span class="flex items-center">
              <Plus class="h-4 w-4 mr-2.5 text-brand-600" />
              Novo Empréstimo
            </span>
            <ArrowRight class="h-4 w-4 text-slate-400" />
          </BaseButton>

          <BaseButton 
            variant="secondary" 
            class="justify-between px-4 py-3 rounded-xl border border-slate-200 text-slate-750 font-bold hover:bg-brand-50/10 hover:text-brand-700 hover:border-brand-200 text-left transition-all"
            @click="router.push('/alunos?new=true')"
          >
            <span class="flex items-center">
              <Plus class="h-4 w-4 mr-2.5 text-brand-600" />
              Cadastrar Novo Aluno
            </span>
            <ArrowRight class="h-4 w-4 text-slate-400" />
          </BaseButton>

          <BaseButton 
            variant="secondary" 
            class="justify-between px-4 py-3 rounded-xl border border-slate-200 text-slate-750 font-bold hover:bg-brand-50/10 hover:text-brand-700 hover:border-brand-200 text-left transition-all"
            @click="router.push('/turmas?new=true')"
          >
            <span class="flex items-center">
              <Plus class="h-4 w-4 mr-2.5 text-brand-600" />
              Cadastrar Nova Turma
            </span>
            <ArrowRight class="h-4 w-4 text-slate-400" />
          </BaseButton>

          <div class="h-px bg-slate-100 my-2"></div>

          <BaseButton 
            variant="ghost" 
            class="justify-between px-4 py-3 rounded-xl text-brand-600 font-bold hover:bg-brand-50 hover:text-brand-700 transition-all"
            @click="router.push('/emprestimos')"
          >
            <span class="flex items-center">
              Ver Todos os Empréstimos
            </span>
            <ArrowRight class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>

    </div>

    <!-- Return Confirm Modal -->
    <DevolucaoConfirmModal
      :show="showReturnConfirm"
      :emprestimo="selectedEmp"
      @close="showReturnConfirm = false"
      @confirm="handleReturnConfirm"
    />
  </div>
</template>
