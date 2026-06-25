<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Filtrar por...'
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative rounded-lg w-full">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="block w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300 cursor-pointer appearance-none"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
