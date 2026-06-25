<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import { Edit, Trash2, History } from 'lucide-vue-next';

defineProps({
  alunos: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete', 'history']);
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600 border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
            <th class="py-3.5 px-6">Nome do Aluno</th>
            <th class="py-3.5 px-6">Turma</th>
            <th class="py-3.5 px-6">Empréstimos</th>
            <th class="py-3.5 px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="aluno in alunos" 
            :key="aluno.id"
            class="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
          >
            <td class="py-4 px-6 font-bold text-slate-800">{{ aluno.nome }}</td>
            <td class="py-4 px-6">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 select-none">
                {{ aluno.turmaNome }}
              </span>
            </td>
            <td class="py-4 px-6 font-semibold text-slate-500">
              <span>
                {{ aluno.totalEmprestimos || 0 }} no total / 
                <span class="text-rose-600 font-bold">{{ aluno.emprestimosAbertos || 0 }} ativo(s)</span>
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="inline-flex space-x-2">
                <BaseButton variant="ghost" class="p-1.5 h-auto text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded" title="Ver Histórico" @click="$emit('history', aluno)">
                  <History class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="ghost" class="p-1.5 h-auto text-slate-400 hover:text-slate-700 rounded" title="Editar Aluno" @click="$emit('edit', aluno)">
                  <Edit class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="ghost" class="p-1.5 h-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded" title="Excluir Aluno" @click="$emit('delete', aluno)">
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
