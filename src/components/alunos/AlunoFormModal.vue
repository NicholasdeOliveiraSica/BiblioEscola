<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  aluno: {
    type: Object,
    default: null
  },
  turmas: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const nome = ref('');
const turmaId = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    nome.value = props.aluno ? props.aluno.nome : '';
    turmaId.value = props.aluno ? props.aluno.turmaId : '';
  }
});

const handleSubmit = () => {
  if (!nome.value || !nome.value.trim() || !turmaId.value) return;
  emit('submit', {
    id: props.aluno ? props.aluno.id : undefined,
    nome: nome.value.trim(),
    turmaId: turmaId.value
  });
};
</script>

<template>
  <BaseModal 
    :show="show" 
    :title="aluno ? 'Editar Aluno' : 'Novo Aluno'" 
    size="sm"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome Completo *</label>
        <input 
          v-model="nome" 
          type="text" 
          required 
          placeholder="Nome do aluno"
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300"
        />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Turma *</label>
        <select 
          v-model="turmaId"
          required
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300 cursor-pointer"
        >
          <option value="" disabled>Selecione a turma</option>
          <option v-for="t in turmas" :key="t.id" :value="t.id">{{ t.nome }}</option>
        </select>
      </div>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" :disabled="!nome || !nome.trim() || !turmaId" @click="handleSubmit">Salvar</BaseButton>
    </template>
  </BaseModal>
</template>
