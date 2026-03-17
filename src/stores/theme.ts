import { defineStore } from 'pinia'
import { ref } from 'vue'

type Theme = 'white' | 'pastel' | 'dark' | 'dark-pastel'

export const useThemeStore = defineStore('theme', () => {
  const themes: Theme[] = ['white', 'pastel', 'dark', 'dark-pastel']
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'white')

  const setTheme = (newTheme: Theme): void => {
    if (themes.includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = (): void => {
    const i = themes.indexOf(theme.value)
    setTheme(themes[(i + 1) % themes.length])
  }

  return { theme, themes, setTheme, toggleTheme }
})
