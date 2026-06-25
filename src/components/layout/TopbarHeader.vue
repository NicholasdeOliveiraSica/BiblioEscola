<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const formattedDate = ref('');

const updateDate = () => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  formattedDate.value = new Date().toLocaleDateString('pt-BR', options);
};

let interval;
onMounted(() => {
  updateDate();
  interval = setInterval(updateDate, 60000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-150 px-8 flex items-center justify-between select-none">
    <!-- Current date -->
    <div class="text-sm font-semibold text-slate-400 capitalize">
      {{ formattedDate }}
    </div>

    <!-- Right Side: Status and Profile info -->
    <div class="flex items-center space-x-6">
      <!-- Database status -->
      <div class="flex items-center space-x-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Banco Local Conectado</span>
      </div>

      <div class="w-px h-5 bg-slate-200"></div>

      <!-- Administrative profile -->
      <div class="flex items-center space-x-2.5">
        <div class="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-sm">
          SE
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-xs font-bold text-slate-800 leading-tight">Secretaria Escolar</p>
          <p class="text-[10px] font-bold text-slate-400 leading-none">Administração</p>
        </div>
      </div>
    </div>
  </header>
</template>
