<script setup>
import { computed } from 'vue';
import { getStatusDetails } from '@/utils/status';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const details = computed(() => getStatusDetails(props.status));
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border"
    :class="details.bgClass"
  >
    <span class="w-1.5 h-1.5 mr-1.5 rounded-full" :class="details.dotClass"></span>
    {{ details.label }}
  </span>
</template>
