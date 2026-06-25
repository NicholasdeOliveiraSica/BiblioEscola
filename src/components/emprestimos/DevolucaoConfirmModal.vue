<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { BookOpen } from 'lucide-vue-next';

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  emprestimo: {
    type: Object,
    default: null
  }
});

defineEmits(['close', 'confirm']);
</script>

<template>
  <BaseModal 
    :show="show" 
    title="Confirmar Devolução" 
    size="sm"
    @close="$emit('close')"
  >
    <div v-if="emprestimo" class="flex items-start space-x-3.5 pt-2 select-none">
      <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <BookOpen class="h-5 w-5" />
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-bold text-slate-800 leading-tight">Registrar devolução de livro?</h4>
        <p class="text-xs text-slate-500 leading-relaxed mt-1">
          Deseja confirmar a devolução do livro <strong class="text-slate-700 font-bold">"{{ emprestimo.livro }}"</strong> pelo aluno <strong class="text-slate-700 font-bold">{{ emprestimo.alunoNome }}</strong>?
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="$emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" class="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 border-transparent text-white" @click="$emit('confirm')">
        Confirmar Devolução
      </BaseButton>
    </template>
  </BaseModal>
</template>
