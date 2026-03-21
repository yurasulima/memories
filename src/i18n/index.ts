import { createI18n } from 'vue-i18n'
import uk from './uk.json'
import en from './en.json'

const savedLocale = localStorage.getItem('locale') || 'uk'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'uk',
  messages: { uk, en }
})

export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale as 'uk' | 'en'
  localStorage.setItem('locale', locale)
}

export const availableLocales = [
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
]
