<template>
  <div class="settings-view">
    <header class="page-header">
      <h1>Налаштування</h1>
    </header>

    <div class="settings-content">
      <div class="section-card">
        <h2>Профіль</h2>
        <div class="profile-row">
          <div class="avatar">{{ initials }}</div>
          <div class="profile-info">
            <span class="profile-name">{{ auth.user?.fullName }}</span>
            <span class="profile-email">{{ auth.user?.email }}</span>
            <span class="profile-username">@{{ auth.user?.username }}</span>
          </div>
        </div>
      </div>

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
                <span class="member-name">{{ m.fullName }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useThemeStore } from '../stores/theme.js'
import { useGroupsStore } from '../stores/group.js'
import IconLogout from '../components/icons/IconLogout.vue'

const router = useRouter()
const auth = useAuthStore()
const themeStore = useThemeStore()
const groupsStore = useGroupsStore()

const initials = computed(() => {
  const name = auth.user?.fullName || auth.user?.username || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

const themes = [
  { value: 'white', label: 'Біла' },
  { value: 'pastel', label: 'Пастельна' },
  { value: 'dark', label: 'Чорна' },
  { value: 'dark-pastel', label: 'Чорна пастельна' }
]

const logout = () => {
  auth.logout()
  router.push('/auth')
}
</script>

<style scoped>
.settings-view {
  padding-bottom: 20px;
}

.page-header {
  padding: 16px 20px 12px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  border-bottom: 1px solid var(--border);
}

.page-header h1 {
  font-size: 18px;
  font-weight: 700;
}

.settings-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: 0 2px 10px var(--shadow);
}

.section-card h2 {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 14px;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
}

.profile-email {
  font-size: 13px;
  color: var(--text-muted);
}

.profile-username {
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
}

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
  transition: border-color 0.2s;
  background: var(--bg-secondary);
}

.theme-btn.active {
  border-color: var(--accent);
}

.theme-btn span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}

.theme-preview {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
}

.theme-preview.white { background: linear-gradient(135deg, #fff 60%, #f7f7f7); }
.theme-preview.pastel { background: linear-gradient(135deg, #fff5f8 60%, #ffe8f0); }
.theme-preview.dark { background: linear-gradient(135deg, #141414 60%, #1e1e1e); }
.theme-preview.dark-pastel { background: linear-gradient(135deg, #1e1220 60%, #2a1a2e); }

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

.group-name-label {
  font-size: 15px;
  font-weight: 700;
}

.group-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.group-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
}

.member-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
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
}

.member-username {
  font-size: 12px;
  color: var(--text-muted);
}

.owner-badge {
  font-size: 11px;
  font-weight: 600;
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
</style>
