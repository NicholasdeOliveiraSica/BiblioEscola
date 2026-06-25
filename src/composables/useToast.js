import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    toasts.value.push({ id, message, type });
    
    // Automatically dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    showToast,
    removeToast
  };
}
