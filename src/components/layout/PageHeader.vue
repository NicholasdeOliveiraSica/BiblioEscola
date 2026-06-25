<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100 mb-6 select-none">
    <div class="flex-1 min-w-0 pr-4">
      <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-slate-400 font-medium">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="mt-4 md:mt-0 flex-shrink-0 flex items-center space-x-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
