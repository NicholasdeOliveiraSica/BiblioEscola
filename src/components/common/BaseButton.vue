<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm focus-visible:ring-brand-500 border border-transparent';
    case 'secondary':
      return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus-visible:ring-brand-500';
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-500 border border-transparent';
    case 'ghost':
      return 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent';
    default:
      return '';
  }
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
    :class="variantClasses"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot name="icon" v-if="!loading"></slot>
    <span :class="{ 'ml-1.5': $slots.icon && !loading }">
      <slot></slot>
    </span>
  </button>
</template>
