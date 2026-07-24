import { ref } from 'vue';

// Shared global state across components
const isDarkMode = ref(true);
let isInitialized = false;

export function useTheme() {
  const updateDOM = () => {
    if (typeof window === 'undefined') return;

    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    updateDOM();
  };

  const initTheme = () => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark';
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateDOM();
  };

  // Auto-initialize on first use
  if (!isInitialized && typeof window !== 'undefined') {
    initTheme();
    isInitialized = true;
  }

  return {
    isDarkMode,
    toggleTheme,
    initTheme
  };
}