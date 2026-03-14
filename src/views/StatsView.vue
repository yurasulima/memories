<template>
  <div class="stats-view">
    <header class="page-header">
      <h1>Статистика</h1>
      <select v-if="groupsStore.groups.length > 1" v-model="selectedGroupId" class="group-select" @change="load">
        <option v-for="g in groupsStore.groups" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
    </header>

    <div v-if="loading" class="loader-wrap">
      <div class="loader"></div>
    </div>

    <div v-else-if="stats" class="stats-content">
      <div class="cards-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalDays }}</span>
          <span class="stat-label">Днів</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalPosts }}</span>
          <span class="stat-label">Постів</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalContents }}</span>
          <span class="stat-label">Контенту</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalDates }}</span>
          <span class="stat-label">Дат</span>
        </div>
      </div>

      <div class="section-card" v-if="stats.contentByType">
        <h2>Контент за типом</h2>
        <div class="bar-list">
          <div v-for="(val, type) in stats.contentByType" :key="type" class="bar-row">
            <span class="bar-label">{{ contentLabel(type) }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: barWidth(val, stats.contentByType) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <div class="section-card" v-if="stats.postsByMonth">
        <h2>Пости по місяцях</h2>
        <div class="bar-list">
          <div v-for="(val, month) in stats.postsByMonth" :key="month" class="bar-row">
            <span class="bar-label">{{ month }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: barWidth(val, stats.postsByMonth) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <div class="section-card" v-if="stats.daysByMonth">
        <h2>Дні по місяцях</h2>
        <div class="bar-list">
          <div v-for="(val, month) in stats.daysByMonth" :key="month" class="bar-row">
            <span class="bar-label">{{ month }}</span>
            <div class="bar-track">
              <div class="bar-fill bar-fill-alt" :style="{ width: barWidth(val, stats.daysByMonth) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <IconStats :size="48" />
      <p>Немає даних</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGroupsStore } from '../stores/group.js'
import { memoriesApi } from '../api/memories.js'
import IconStats from '../components/icons/IconStats.vue'

const groupsStore = useGroupsStore()
const stats = ref(null)
const loading = ref(false)
const selectedGroupId = ref(null)

onMounted(async () => {
  await groupsStore.fetchMyGroups()
  if (groupsStore.currentGroup) {
    selectedGroupId.value = groupsStore.currentGroup.id
    await load()
  }
})

const load = async () => {
  if (!selectedGroupId.value) return
  loading.value = true
  try {
    stats.value = await memoriesApi.getStats(selectedGroupId.value)
  } catch {
    stats.value = null
  } finally {
    loading.value = false
  }
}

const contentLabel = (type) => {
  const map = { ANIME: 'Аніме', HENTAI: 'Хентай', SERIES: 'Серіал', FILM: 'Фільм' }
  return map[type] || type
}

const barWidth = (val, obj) => {
  const max = Math.max(...Object.values(obj))
  return max === 0 ? 0 : Math.round((val / max) * 100)
}
</script>

<style scoped>
.stats-view {
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.group-select {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text);
}

.loader-wrap {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.stats-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 10px var(--shadow);
}

.stat-num {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: 0 2px 10px var(--shadow);
}

.section-card h2 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  font-size: 13px;
  color: var(--text);
  width: 70px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-fill-alt {
  background: var(--accent-hover);
  opacity: 0.75;
}

.bar-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  width: 24px;
  text-align: right;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 20px;
  color: var(--text-muted);
}
</style>
