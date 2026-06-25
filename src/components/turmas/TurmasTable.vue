<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import { Edit, Trash2 } from 'lucide-vue-next';

defineProps({
  turmas: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600 border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
            <th class="py-3.5 px-6">Nome da Turma</th>
            <th class="py-3.5 px-6">Alunos Cadastrados</th>
            <th class="py-3.5 px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="turma in turmas" 
            :key="turma.id"
            class="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
          >
            <td class="py-4 px-6 font-bold text-slate-800">{{ turma.nome }}</td>
            <td class="py-4 px-6">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-650 border border-slate-200">
                {{ turma.alunosCount || 0 }} {{ (turma.alunosCount || 0) === 1 ? 'aluno' : 'alunos' }}
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="inline-flex space-x-2">
                <BaseButton variant="ghost" class="p-1.5 h-auto text-slate-400 hover:text-slate-700 rounded" title="Editar Turma" @click="$emit('edit', turma)">
                  <Edit class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="ghost" class="p-1.5 h-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded" title="Excluir Turma" @click="$emit('delete', turma)">
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
