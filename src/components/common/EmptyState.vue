<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  showAction: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-white select-none">
    <div class="p-3.5 bg-slate-50 text-slate-400 rounded-full mb-4">
      <slot name="icon">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>
    <h3 class="text-base font-bold text-slate-800 mb-1.5">{{ title }}</h3>
    <p v-if="description" class="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{{ description }}</p>
    
    <BaseButton
      v-if="showAction"
      variant="primary"
      @click="emit('action')"
    >
      <template #icon v-if="$slots.btnIcon">
        <slot name="btnIcon"></slot>
      </template>
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>
