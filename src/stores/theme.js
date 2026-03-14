import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'white')
  const themes = ['white', 'pastel', 'dark', 'dark-pastel']

  const setTheme = (newTheme) => {
    if (themes.includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const i = themes.indexOf(theme.value)
    setTheme(themes[(i + 1) % themes.length])
  }

  return { theme, themes, setTheme, toggleTheme }
})
