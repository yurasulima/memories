<template>
  <div class="settings-view">
    <header class="page-header">
      <h1>Налаштування</h1>
    </header>

    <div class="settings-content">

      <!-- Профіль -->
      <div class="section-card">
        <h2>Профіль</h2>
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
        <h2>Тема</h2>
        <div class="theme-grid">
          <button
              v-for="t in themes"
              :key="t.value"
              :class="['theme-btn', { active: themeStore.theme === t.value }]"
              @click="themeStore.setTheme(t.value)"
          >
            <div class="theme-preview" :class="t.value"></div>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>

      <!-- Група -->
      <div class="section-card">
        <h2>Група</h2>
        <div v-if="groupsStore.currentGroup" class="group-info">
          <div class="group-row">
            <div class="group-details">
              <span class="group-name-label">{{ groupsStore.currentGroup.name }}</span>
              <span class="group-meta">{{ groupsStore.currentGroup.members?.length || 0 }} учасників</span>
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
              <span v-if="m.id === groupsStore.currentGroup.owner?.id" class="owner-badge">власник</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-group">
          <span>Немає активної групи</span>
        </div>
      </div>

      <button class="logout-btn" @click="logout">
        <IconLogout :size="18" />
        <span>Вийти</span>
      </button>

      <!-- Про нас -->
      <div class="section-card">
        <h2>Про нас</h2>
        <div class="about-text">
          <p>
            Memories — це невеликий проєкт для збереження спільних моментів,
            фотографій та історій. Ми робимо його для пар та близьких людей,
            щоб їхні спогади завжди були поруч.
          </p>
          <p>
            Якщо вам подобається проєкт — ви можете підтримати його розвиток ❤️
          </p>
        </div>
        <div class="support-actions">
          <a class="support-btn" href="https://send.monobank.ua/jar/b1DegFSYh" target="_blank">
            Підтримати (Monobank)
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.ts'
import { useThemeStore } from '../stores/theme.ts'
import { useGroupsStore } from '../stores/group.ts'
import type { Theme } from '../stores/theme.ts'
import IconLogout from '../components/icons/IconLogout.vue'

interface ThemeOption {
  value: Theme
  label: string
}

const router = useRouter()
const auth = useAuthStore()
const themeStore = useThemeStore()
const groupsStore = useGroupsStore()

const profileLoading = ref<boolean>(false)

onMounted(async () => {
  if (!auth.user) {
    profileLoading.value = true
    try {
      await auth.fetchMe()
    } finally {
      profileLoading.value = false
    }
  }
})

const initials = computed<string>(() => {
  const name = auth.user?.fullName || auth.user?.username || ''
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
})

const themes: ThemeOption[] = [
  { value: 'white',       label: 'Біла' },
  { value: 'pastel',      label: 'Пастельна' },
  { value: 'dark',        label: 'Чорна' },
  { value: 'dark-pastel', label: 'Чорна пастельна' },
]

const logout = (): void => {
  auth.logout()
  router.push('/auth')
}
</script>

<style scoped>
.settings-view {
  padding-bottom: 20px;
}

.page-header {
  padding: 18px 20px 14px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.page-header h1 {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover, var(--accent)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.settings-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px 18px;
  box-shadow: 0 2px 12px var(--shadow);
}

.section-card h2 {
  font-size: 10px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

/* ── Profile ── */
.profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: -0.5px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.profile-email {
  font-size: 13px;
  color: var(--text-muted);
}

.profile-username {
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
}

/* ── Profile skeleton ── */
.profile-skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
}

.skeleton-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--bg-secondary);
  flex-shrink: 0;
  animation: shimmer 1.4s ease infinite;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  animation: shimmer 1.4s ease infinite;
}

.skeleton-line.w60 { width: 60%; }
.skeleton-line.w40 { width: 40%; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Theme ── */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  border: 2px solid var(--border);
  transition: border-color 0.2s, transform 0.15s;
  background: var(--bg-secondary);
}

.theme-btn:hover { transform: translateY(-1px); }

.theme-btn.active {
  border-color: var(--accent);
}

.theme-btn span {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.theme-preview {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.theme-preview.white       { background: linear-gradient(135deg, #fff 60%, #f7f7f7); }
.theme-preview.pastel      { background: linear-gradient(135deg, #fff5f8 60%, #ffe8f0); }
.theme-preview.dark        { background: linear-gradient(135deg, #141414 60%, #1e1e1e); }
.theme-preview.dark-pastel { background: linear-gradient(135deg, #1e1220 60%, #2a1a2e); }

/* ── Group ── */
.group-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-name-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.group-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.member-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
  text-transform: uppercase;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.member-username {
  font-size: 12px;
  color: var(--text-muted);
}

.owner-badge {
  font-size: 11px;
  font-weight: 700;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 6px;
  padding: 2px 8px;
}

.empty-group {
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
  padding: 10px 0;
}

/* ── Logout ── */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(224, 85, 85, 0.1);
  color: #e05555;
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(224, 85, 85, 0.18);
}

/* ── About ── */
.about-text {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.support-actions {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.support-btn {
  background: #4caf50;
  color: white;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  display: block;
  transition: transform 0.15s, box-shadow 0.15s;
}

.support-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.contact-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  display: block;
  transition: background 0.15s;
}

.contact-btn:hover {
  background: var(--border);
}
</style>