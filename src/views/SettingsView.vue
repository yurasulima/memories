<template>
  <div class="settings-view">
    <header class="page-header">
      <h1>{{ $t('settings.title') }}</h1>
    </header>

    <div class="settings-content">

      <!-- Профіль -->
      <div class="section-card">
        <h2>{{ $t('settings.profile') }}</h2>
        <div v-if="profileLoading" class="profile-skeleton">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line w60"></div>
            <div class="skeleton-line w40"></div>
          </div>
        </div>
        <div v-else class="profile-row">
          <div class="avatar">{{ initials }}</div>
          <div class="profile-info">
            <span class="profile-name">{{ auth.user?.fullName }}</span>
            <span class="profile-email">{{ auth.user?.email }}</span>
            <span class="profile-username">@{{ auth.user?.username }}</span>
          </div>
        </div>
      </div>

      <!-- Тема -->
      <div class="section-card">
        <h2>{{ $t('settings.theme') }}</h2>
        <div class="dropdown-wrap" ref="themeDropRef">
          <button class="dropdown-trigger" @click="themeOpen = !themeOpen">
            <div class="dropdown-trigger-left">
              <div class="theme-dot" :class="themeStore.theme"></div>
              <span>{{ currentThemeLabel }}</span>
            </div>
            <svg class="dropdown-chevron" :class="{ open: themeOpen }" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 6l4 4 4-4"/>
            </svg>
          </button>
          <transition name="dropdown-fade">
            <div v-if="themeOpen" class="dropdown-menu">
              <button
                  v-for="th in themes"
                  :key="th.value"
                  class="dropdown-item"
                  :class="{ active: themeStore.theme === th.value }"
                  @click="selectTheme(th.value)"
              >
                <div class="theme-dot" :class="th.value"></div>
                <span>{{ th.label }}</span>
                <svg v-if="themeStore.theme === th.value" class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><path d="M2 7l3.5 3.5L12 3"/></svg>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Мова -->
      <div class="section-card">
        <h2>{{ $t('settings.language') }}</h2>
        <div class="dropdown-wrap" ref="langDropRef">
          <button class="dropdown-trigger" @click="langOpen = !langOpen">
            <div class="dropdown-trigger-left">
              <span class="drop-flag">{{ currentLangObj?.flag }}</span>
              <span>{{ currentLangObj?.label }}</span>
            </div>
            <svg class="dropdown-chevron" :class="{ open: langOpen }" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 6l4 4 4-4"/>
            </svg>
          </button>
          <transition name="dropdown-fade">
            <div v-if="langOpen" class="dropdown-menu">
              <button
                  v-for="loc in availableLocales"
                  :key="loc.code"
                  class="dropdown-item"
                  :class="{ active: currentLocale === loc.code }"
                  @click="selectLang(loc.code)"
              >
                <span class="drop-flag">{{ loc.flag }}</span>
                <span>{{ loc.label }}</span>
                <svg v-if="currentLocale === loc.code" class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><path d="M2 7l3.5 3.5L12 3"/></svg>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Стрічка спогадів -->
      <div class="section-card">
        <h2>{{ $t('settings.group') }}</h2>
        <div v-if="groupsStore.currentGroup" class="group-info">
          <div class="group-row">
            <div class="group-details">
              <span class="group-name-label">{{ groupsStore.currentGroup.name }}</span>
              <span class="group-meta">{{ groupsStore.currentGroup.members?.length || 0 }} {{ $t('settings.members') }}</span>
            </div>
          </div>
          <div class="members-list">
            <div v-for="m in groupsStore.currentGroup.members" :key="m.id" class="member-row">
              <div class="member-avatar">{{ m.fullName?.charAt(0) || m.username?.charAt(0) }}</div>
              <div class="member-info">
                <span class="member-name">
                  {{
                    m.fullName
                        ? m.fullName.split(' ')[0] + ' ' + (m.fullName.split(' ')[1]?.charAt(0) || '') + '.'
                        : ''
                  }}
                </span>
                <span class="member-username">@{{ m.username }}</span>
              </div>
              <span v-if="m.id === groupsStore.currentGroup.owner?.id" class="owner-badge">{{ $t('settings.owner') }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-group">
          <span>{{ $t('settings.noGroup') }}</span>
        </div>
      </div>

      <button class="logout-btn" @click="logout">
        <IconLogout :size="18" />
        <span>{{ $t('settings.logout') }}</span>
      </button>

      <!-- Про нас -->
      <div class="section-card">
        <h2>{{ $t('settings.about') }}</h2>
        <div class="about-text">
          <p>{{ $t('settings.aboutText1') }}</p>
          <p>{{ $t('settings.aboutText2') }}</p>
        </div>
        <div class="support-actions">
          <a class="support-btn" href="https://send.monobank.ua/jar/b1DegFSYh" target="_blank">
            {{ $t('settings.support') }}
          </a>
          <a class="contact-btn" href="https://t.me/ImMurMurCat" target="_blank">
            Telegram: @ImMurMurCat
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, availableLocales } from '../i18n/index'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useGroupsStore } from '../stores/group'
import IconLogout from '../components/icons/IconLogout.vue'

interface ThemeOption {
  value: string
  label: string
}

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value)
const router = useRouter()
const auth = useAuthStore()
const themeStore = useThemeStore()
const groupsStore = useGroupsStore()

// ── Dropdown state ────────────────────────────────────────────────────────────
const themeOpen = ref(false)
const langOpen  = ref(false)
const themeDropRef = ref<HTMLElement | null>(null)
const langDropRef  = ref<HTMLElement | null>(null)

const closeOnOutside = (e: MouseEvent) => {
  if (themeDropRef.value && !themeDropRef.value.contains(e.target as Node)) themeOpen.value = false
  if (langDropRef.value  && !langDropRef.value.contains(e.target as Node))  langOpen.value  = false
}
onMounted(async () => {
  document.addEventListener('click', closeOnOutside, true)
  if (!auth.user) {
    profileLoading.value = true
    try { await auth.fetchMe() } finally { profileLoading.value = false }
  }
})
onUnmounted(() => document.removeEventListener('click', closeOnOutside, true))

// ── Profile ───────────────────────────────────────────────────────────────────
const profileLoading = ref<boolean>(false)
const initials = computed<string>(() => {
  const name = auth.user?.fullName || auth.user?.username || ''
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
})

// ── Themes ────────────────────────────────────────────────────────────────────
const themes = computed<ThemeOption[]>(() => [
  { value: 'white',       label: t('settings.themes.white') },
  { value: 'pastel',      label: t('settings.themes.pastel') },
  { value: 'rose',        label: t('settings.themes.rose') },
  { value: 'mint',        label: t('settings.themes.mint') },
  { value: 'sky',         label: t('settings.themes.sky') },
  { value: 'dark',        label: t('settings.themes.dark') },
  { value: 'dark-pastel', label: t('settings.themes.darkPastel') },
  { value: 'ocean',       label: t('settings.themes.ocean') },
  { value: 'forest',      label: t('settings.themes.forest') },
  { value: 'sunset',      label: t('settings.themes.sunset') },
  { value: 'midnight',    label: t('settings.themes.midnight') },
  { value: 'amoled',      label: t('settings.themes.amoled') },
])
const currentThemeLabel = computed(() =>
    themes.value.find(th => th.value === themeStore.theme)?.label ?? themeStore.theme
)
const selectTheme = (val: string) => {
  themeStore.setTheme(val as any)
  themeOpen.value = false
}

// ── Language ──────────────────────────────────────────────────────────────────
const currentLangObj = computed(() =>
    availableLocales.find(l => l.code === currentLocale.value)
)
const selectLang = (code: string) => {
  setLocale(code)
  langOpen.value = false
}

// ── Logout ────────────────────────────────────────────────────────────────────
const logout = (): void => {
  groupsStore.reset()
  auth.logout()
  router.push('/auth')
}
</script>

<style scoped>
.settings-view { padding-bottom: 20px; }

.page-header {
  padding: 18px 20px 14px;
  position: sticky; top: 0;
  background: var(--bg); z-index: 10;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
.page-header h1 {
  font-size: 19px; font-weight: 800; letter-spacing: -0.4px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover, var(--accent)));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.settings-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

.section-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 20px 18px;
  box-shadow: 0 2px 12px var(--shadow);
}
.section-card h2 {
  font-size: 10px; font-weight: 800; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;
}

/* ── Profile ── */
.profile-row { display: flex; align-items: center; gap: 14px; }
.avatar {
  width: 54px; height: 54px; border-radius: 50%;
  background: var(--accent-light); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; font-weight: 800; flex-shrink: 0; letter-spacing: -0.5px;
}
.profile-info { display: flex; flex-direction: column; gap: 3px; }
.profile-name { font-size: 16px; font-weight: 700; color: var(--text); }
.profile-email { font-size: 13px; color: var(--text-muted); }
.profile-username { font-size: 12px; color: var(--accent); font-weight: 600; }

/* ── Profile skeleton ── */
.profile-skeleton { display: flex; align-items: center; gap: 14px; }
.skeleton-avatar {
  width: 54px; height: 54px; border-radius: 50%;
  background: var(--bg-secondary); flex-shrink: 0; animation: shimmer 1.4s ease infinite;
}
.skeleton-lines { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.skeleton-line { height: 12px; border-radius: 6px; background: var(--bg-secondary); animation: shimmer 1.4s ease infinite; }
.skeleton-line.w60 { width: 60%; }
.skeleton-line.w40 { width: 40%; }
@keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* ── Dropdown shared ── */
.dropdown-wrap { position: relative; }

.dropdown-trigger {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  background: var(--bg-secondary); border: 1.5px solid var(--border);
  border-radius: 14px; padding: 12px 14px;
  font-size: 14px; font-weight: 600; color: var(--text);
  transition: border-color 0.2s;
  cursor: pointer;
}
.dropdown-trigger:hover { border-color: var(--accent); }

.dropdown-trigger-left { display: flex; align-items: center; gap: 10px; }

.dropdown-chevron {
  color: var(--text-muted); flex-shrink: 0;
  transition: transform 0.2s;
}
.dropdown-chevron.open { transform: rotate(180deg); }

.dropdown-menu {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; padding: 6px;
  box-shadow: 0 8px 32px var(--shadow);
}

.dropdown-item {
  width: 100%;
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  font-size: 14px; font-weight: 500; color: var(--text);
  transition: background 0.15s;
  cursor: pointer;
}
.dropdown-item:hover { background: var(--bg-secondary); }
.dropdown-item.active { color: var(--accent); font-weight: 700; }
.dropdown-item.active:hover { background: var(--accent-light); }

.check-icon { margin-left: auto; flex-shrink: 0; }

/* ── Theme dot ── */
.theme-dot {
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  border: 1.5px solid rgba(0,0,0,0.1);
}
.theme-dot.white       { background: linear-gradient(135deg, #ffffff 50%, #f0f0f0); }
.theme-dot.pastel      { background: linear-gradient(135deg, #fff5f8 50%, #ffd6e7); }
.theme-dot.rose        { background: linear-gradient(135deg, #fff1f2 50%, #fecdd3); }
.theme-dot.mint        { background: linear-gradient(135deg, #f0fdf4 50%, #bbf7d0); }
.theme-dot.sky         { background: linear-gradient(135deg, #f0f9ff 50%, #bae6fd); }
.theme-dot.dark        { background: linear-gradient(135deg, #1a1a1a 50%, #2a2a2a); }
.theme-dot.dark-pastel { background: linear-gradient(135deg, #1e1220 50%, #2f1a35); }
.theme-dot.ocean       { background: linear-gradient(135deg, #0a1628 50%, #1a3a5c); }
.theme-dot.forest      { background: linear-gradient(135deg, #0d1f12 50%, #1e3d28); }
.theme-dot.sunset      { background: linear-gradient(135deg, #1a0f0a 50%, #3d2015); }
.theme-dot.midnight    { background: linear-gradient(135deg, #0d0b1e 50%, #2a2050); }
.theme-dot.amoled      { background: linear-gradient(135deg, #000000 50%, #0f0f0f); border-color: #333; }

/* ── Lang flag ── */
.drop-flag { font-size: 20px; line-height: 1; flex-shrink: 0; }

/* ── Dropdown animation ── */
.dropdown-fade-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-fade-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Group ── */
.group-info { display: flex; flex-direction: column; gap: 12px; }
.group-row { display: flex; align-items: center; justify-content: space-between; }
.group-details { display: flex; flex-direction: column; gap: 2px; }
.group-name-label { font-size: 15px; font-weight: 700; color: var(--text); }
.group-meta { font-size: 12px; color: var(--text-muted); }

.members-list { display: flex; flex-direction: column; gap: 10px; }
.member-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; background: var(--bg-secondary); border-radius: 12px;
}
.member-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--accent-light); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0; text-transform: uppercase;
}
.member-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.member-name { font-size: 14px; font-weight: 600; color: var(--text); }
.member-username { font-size: 12px; color: var(--text-muted); }
.owner-badge {
  font-size: 11px; font-weight: 700;
  background: var(--accent-light); color: var(--accent);
  border-radius: 6px; padding: 2px 8px;
}
.empty-group { font-size: 14px; color: var(--text-muted); text-align: center; padding: 10px 0; }

/* ── Logout ── */
.logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: rgba(224, 85, 85, 0.1); color: #e05555;
  border-radius: 14px; padding: 14px;
  font-size: 15px; font-weight: 600; transition: background 0.2s;
}
.logout-btn:hover { background: rgba(224, 85, 85, 0.18); }

/* ── About ── */
.about-text { font-size: 14px; color: var(--text); line-height: 1.6; display: flex; flex-direction: column; gap: 10px; }
.support-actions { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
.support-btn {
  background: #4caf50; color: white; padding: 12px; border-radius: 12px;
  text-align: center; font-weight: 600; font-size: 14px; display: block;
  transition: transform 0.15s, box-shadow 0.15s;
}
.support-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
.contact-btn {
  background: var(--bg-secondary); border: 1px solid var(--border);
  padding: 12px; border-radius: 12px; text-align: center;
  font-weight: 600; font-size: 14px; color: var(--text); display: block;
  transition: background 0.15s;
}
.contact-btn:hover { background: var(--border); }
</style>