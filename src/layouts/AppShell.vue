<script setup>
import SidebarNav from '@/components/layout/SidebarNav.vue';
import TopbarHeader from '@/components/layout/TopbarHeader.vue';
import { useToast } from '@/composables/useToast';
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
    <!-- Sidebar -->
    <SidebarNav />

    <!-- Right Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar Header -->
      <TopbarHeader />

      <!-- Scrollable Main View -->
      <main class="flex-1 overflow-y-auto px-8 py-8">
        <div class="max-w-6xl mx-auto">
          <!-- Page View with nice enter transitions -->
          <RouterView v-slot="{ Component }">
            <Transition
              name="fade-slide"
              mode="out-in"
            >
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>

    <!-- Toast Notifications Container -->
    <div class="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start space-x-3 bg-white/95 backdrop-blur-md transition-all duration-300"
          :class="toast.type === 'error' 
            ? 'border-rose-100 text-rose-800 bg-rose-50/95' 
            : toast.type === 'warning'
              ? 'border-amber-100 text-amber-800 bg-amber-50/95'
              : 'border-emerald-100 text-emerald-800 bg-emerald-50/95'"
        >
          <div class="flex-shrink-0 mt-0.5">
            <AlertCircle v-if="toast.type === 'error' || toast.type === 'warning'" class="h-5 w-5" :class="toast.type === 'error' ? 'text-rose-500' : 'text-amber-500'" />
            <CheckCircle2 v-else class="h-5 w-5 text-emerald-500" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold leading-snug">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 rounded-lg p-0.5 hover:bg-black/5 transition-colors"
          >
            <X class="h-4 w-4 opacity-60 hover:opacity-100" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
/* Smooth fade-slide transition for pages */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Toast Transition Group animations */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9) opacity(0);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
}
.toast-move {
  transition: all 0.3s ease;
}
</style>
