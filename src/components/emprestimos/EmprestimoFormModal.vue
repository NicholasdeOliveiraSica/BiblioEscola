<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  alunos: {
    type: Array,
    required: true
  },
  preselectedAlunoId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'submit']);

const alunoId = ref('');
const livro = ref('');
const dataEmprestimo = ref('');

// Watch show to initialize values
watch(() => props.show, (newVal) => {
  if (newVal) {
    alunoId.value = props.preselectedAlunoId || '';
    livro.value = '';
    dataEmprestimo.value = new Date().toISOString().split('T')[0];
  }
});

// Reactively find selected student info
const selectedAluno = computed(() => {
  if (!alunoId.value) return null;
  return props.alunos.find(a => a.id === alunoId.value) || null;
});

const handleSubmit = () => {
  if (!alunoId.value || !livro.value || !livro.value.trim() || !dataEmprestimo.value) return;
  emit('submit', {
    alunoId: alunoId.value,
    livro: livro.value.trim(),
    dataEmprestimo: dataEmprestimo.value
  });
};
</script>

<template>
  <BaseModal 
    :show="show" 
    title="Novo Empréstimo" 
    size="sm"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aluno *</label>
        <select 
          v-model="alunoId"
          required
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300 cursor-pointer"
        >
          <option value="" disabled>Selecione o aluno</option>
          <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
            {{ aluno.nome }}
          </option>
        </select>
      </div>

      <!-- Reactive Student Summary Block -->
      <div 
        v-if="selectedAluno" 
        class="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 animate-fadeIn select-none"
      >
        <div class="flex justify-between">
          <span class="font-bold text-slate-400 uppercase tracking-wide">Turma:</span>
          <span class="font-bold text-slate-850">{{ selectedAluno.turmaNome }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold text-slate-400 uppercase tracking-wide">Empréstimos Ativos:</span>
          <span 
            class="font-extrabold" 
            :class="selectedAluno.emprestimosAbertos > 0 ? 'text-rose-600' : 'text-emerald-600'"
          >
            {{ selectedAluno.emprestimosAbertos || 0 }} pendente(s)
          </span>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Título do Livro *</label>
        <input 
          v-model="livro" 
          type="text" 
          required 
          placeholder="Título do livro emprestado"
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300"
        />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data do Empréstimo *</label>
        <input 
          v-model="dataEmprestimo" 
          type="date" 
          required 
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300 cursor-pointer"
        />
      </div>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton 
        variant="primary" 
        :disabled="!alunoId || !livro || !livro.trim() || !dataEmprestimo" 
        @click="handleSubmit"
      >
        Confirmar Empréstimo
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
