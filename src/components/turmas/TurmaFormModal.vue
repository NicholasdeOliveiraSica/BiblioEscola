<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  turma: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const nome = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    nome.value = props.turma ? props.turma.nome : '';
  }
});

const handleSubmit = () => {
  if (!nome.value || !nome.value.trim()) return;
  emit('submit', {
    id: props.turma ? props.turma.id : undefined,
    nome: nome.value.trim()
  });
};
</script>

<template>
  <BaseModal 
    :show="show" 
    :title="turma ? 'Editar Turma' : 'Nova Turma'" 
    size="sm"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome da Turma *</label>
        <input 
          v-model="nome" 
          type="text" 
          required 
          placeholder="Ex: 9º Ano A, 101, etc."
          class="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300"
          ref="inputName"
        />
      </div>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" :disabled="!nome || !nome.trim()" @click="handleSubmit">Salvar</BaseButton>
    </template>
  </BaseModal>
</template>
