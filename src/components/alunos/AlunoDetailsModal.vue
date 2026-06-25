<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { formatDate } from '@/utils/formatDate';
import { BookOpen, Plus } from 'lucide-vue-next';

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  aluno: {
    type: Object,
    default: null
  },
  history: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'newLoan']);
</script>

<template>
  <BaseModal 
    :show="show" 
    :title="aluno ? `Histórico do Aluno: ${aluno.nome}` : 'Detalhes do Aluno'" 
    size="lg"
    @close="$emit('close')"
  >
    <div v-if="aluno" class="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Aluno Selecionado</p>
        <h4 class="text-base font-extrabold text-slate-800 leading-tight">{{ aluno.nome }}</h4>
      </div>
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 sm:text-right">Turma / Série</p>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100">
          {{ aluno.turmaNome }}
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 flex justify-center">
      <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Content -->
    <div v-else>
      <div v-if="history.length === 0">
        <EmptyState 
          title="Nenhum empréstimo no histórico" 
          description="Este aluno nunca retirou livros na biblioteca."
        >
          <template #icon>
            <BookOpen class="h-6 w-6 text-slate-400" />
          </template>
        </EmptyState>
      </div>

      <div v-else class="max-h-72 overflow-y-auto border border-slate-100 rounded-xl bg-white">
        <table class="w-full text-left text-sm text-slate-600 border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none sticky top-0">
              <th class="py-2.5 px-4">Livro</th>
              <th class="py-2.5 px-4">Data Empréstimo</th>
              <th class="py-2.5 px-4">Data Devolução</th>
              <th class="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="loan in history" 
              :key="loan.id"
              class="border-b border-slate-50 hover:bg-slate-50/20 transition-colors"
            >
              <td class="py-3 px-4 font-semibold text-slate-800">{{ loan.livro }}</td>
              <td class="py-3 px-4 font-semibold text-slate-500">{{ formatDate(loan.dataEmprestimo) }}</td>
              <td class="py-3 px-4 font-semibold text-slate-500">
                {{ loan.dataDevolucao ? formatDate(loan.dataDevolucao) : '-' }}
              </td>
              <td class="py-3 px-4">
                <StatusBadge :status="loan.status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex flex-col sm:flex-row justify-between items-center gap-3">
        <!-- Quick Action button -->
        <BaseButton 
          v-if="aluno"
          variant="primary" 
          @click="$emit('newLoan', aluno)"
          class="w-full sm:w-auto"
        >
          <template #icon><Plus class="h-4 w-4" /></template>
          Novo Empréstimo para este Aluno
        </BaseButton>
        <span v-else class="hidden sm:block"></span>
        <BaseButton variant="secondary" @click="$emit('close')" class="w-full sm:w-auto">Fechar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
