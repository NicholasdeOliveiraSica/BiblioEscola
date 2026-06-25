<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'brand',
    validator: (v) => ['brand', 'emerald', 'rose', 'amber'].includes(v)
  }
});

const colorClasses = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600'
};
</script>

<template>
  <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-250 hover:shadow-md hover:border-slate-200/60 select-none">
    <div class="flex-1 min-w-0 pr-4">
      <p class="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{{ title }}</p>
      <h3 class="text-3xl font-extrabold text-slate-800 tracking-tight truncate">{{ value }}</h3>
    </div>
    <div class="p-3 rounded-xl flex-shrink-0" :class="colorClasses[color]">
      <slot name="icon"></slot>
    </div>
  </div>
</template>
