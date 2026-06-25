<script setup>
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmar Exclusão'
  },
  message: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: 'Excluir'
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  loading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'danger'
  }
});

const emit = defineEmits(['confirm', 'close']);
</script>

<template>
  <BaseModal :show="show" :title="title" size="sm" @close="emit('close')">
    <div class="flex items-start space-x-3.5 pt-2">
      <div
        class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full"
        :class="variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm text-slate-600 leading-relaxed">{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" :disabled="loading" @click="emit('close')">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton :variant="variant" :loading="loading" @click="emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
