<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { formatDate } from '@/utils/formatDate';
import { CheckCircle, Trash2 } from 'lucide-vue-next';

defineProps({
  emprestimos: {
    type: Array,
    required: true
  }
});

defineEmits(['return', 'delete']);
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600 border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
            <th class="py-3.5 px-6">Livro</th>
            <th class="py-3.5 px-6">Aluno / Turma</th>
            <th class="py-3.5 px-6">Data Empréstimo</th>
            <th class="py-3.5 px-6">Data Devolução</th>
            <th class="py-3.5 px-6">Status</th>
            <th class="py-3.5 px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="emp in emprestimos" 
            :key="emp.id"
            class="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
          >
            <td class="py-4 px-6 font-bold text-slate-800">{{ emp.livro }}</td>
            <td class="py-4 px-6">
              <div class="font-bold text-slate-700 leading-tight">{{ emp.alunoNome }}</div>
              <div class="text-xs text-slate-400 font-bold leading-none mt-0.5">{{ emp.turmaNome }}</div>
            </td>
            <td class="py-4 px-6 font-semibold text-slate-500">{{ formatDate(emp.dataEmprestimo) }}</td>
            <td class="py-4 px-6 font-semibold text-slate-550 text-slate-500">
              {{ emp.dataDevolucao ? formatDate(emp.dataDevolucao) : '-' }}
            </td>
            <td class="py-4 px-6">
              <StatusBadge :status="emp.status" />
            </td>
            <td class="py-4 px-6 text-right">
              <div class="inline-flex space-x-2">
                <!-- Return Button -->
                <BaseButton 
                  v-if="emp.status !== 'devolvido'"
                  variant="ghost" 
                  class="p-1.5 h-auto text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                  title="Marcar como Devolvido"
                  @click="$emit('return', emp)"
                >
                  <CheckCircle class="h-4 w-4" />
                </BaseButton>

                <BaseButton 
                  variant="ghost" 
                  class="p-1.5 h-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded" 
                  title="Excluir Registro"
                  @click="$emit('delete', emp)"
                >
                  <Trash2 class="h-4 w-4" />
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
