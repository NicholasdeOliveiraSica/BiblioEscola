<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative rounded-lg w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300"
      :placeholder="placeholder"
    />
  </div>
</template>
