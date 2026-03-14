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

      <!-- Основні числа -->
      <div class="cards-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalDays }}</span>
          <span class="stat-label">Всього записів</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalPosts }}</span>
          <span class="stat-label">Всього постів</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalContents }}</span>
          <span class="stat-label">Записів про перегляд контенту</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalMedia }}</span>
          <span class="stat-label">Опубліковано фото</span>
        </div>
      </div>

      <!-- Streak -->
      <div class="streak-row">
        <div class="streak-card accent">
          <span class="streak-icon">🔥</span>
          <div class="streak-body">
            <span class="streak-num">{{ stats.currentStreak }}</span>
            <span class="streak-label">Поточний стрік</span>
          </div>
        </div>
        <div class="streak-card">
          <span class="streak-icon">🏆</span>
          <div class="streak-body">
            <span class="streak-num">{{ stats.longestStreak }}</span>
            <span class="streak-label">Найдовший стрік</span>
          </div>
        </div>
      </div>

      <!-- Серії та дати -->
      <div class="cards-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalWatchedSeries }}</span>
          <span class="stat-label">Серій переглянуто</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalDates }}</span>
          <span class="stat-label">Важливих дат</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalGroupPosts }}</span>
          <span class="stat-label">Спільних постів</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalPrivatePosts }}</span>
          <span class="stat-label">Особистих постів</span>
        </div>
      </div>

      <!-- Топ контент -->
      <div class="section-card" v-if="stats.topContent?.length">
        <h2>Топ контент</h2>
        <div class="top-list">
          <div v-for="(item, i) in stats.topContent" :key="i" class="top-item">
            <span class="top-rank">#{{ i + 1 }}</span>
            <div class="top-body">
              <span class="top-name">{{ item.name }}</span>
              <span class="top-meta">
                <span :class="['ctype', item.type.toLowerCase()]">{{ contentLabel(item.type) }}</span>
                <span v-if="item.totalSeries > 0" class="top-series">{{ item.totalSeries }} серій</span>
              </span>
            </div>
            <span class="top-count">× {{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Контент за типом -->
      <div class="section-card" v-if="stats.contentByType && Object.keys(stats.contentByType).length">
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

      <!-- Активність по місяцях -->
      <div class="section-card" v-if="stats.daysByMonth && Object.keys(stats.daysByMonth).length">
        <h2>Записів по місяцях</h2>
        <div class="bar-list">
          <div v-for="(val, month) in stats.daysByMonth" :key="month" class="bar-row">
            <span class="bar-label">{{ formatMonth(month) }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: barWidth(val, stats.daysByMonth) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- Пости по місяцях -->
      <div class="section-card" v-if="stats.postsByMonth && Object.keys(stats.postsByMonth).length">
        <h2>Пости по місяцях</h2>
        <div class="bar-list">
          <div v-for="(val, month) in stats.postsByMonth" :key="month" class="bar-row">
            <span class="bar-label">{{ formatMonth(month) }}</span>
            <div class="bar-track">
              <div class="bar-fill bar-fill-alt" :style="{ width: barWidth(val, stats.postsByMonth) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- Активність по днях тижня -->
      <div class="section-card" v-if="stats.daysByWeekday">
        <h2>Активність по днях тижня</h2>
        <div class="weekday-grid">
          <div v-for="(val, wd) in stats.daysByWeekday" :key="wd" class="weekday-col">
            <div class="weekday-bar-wrap">
              <div
                  class="weekday-bar"
                  :style="{ height: weekdayHeight(val, stats.daysByWeekday) + 'px' }"
              ></div>
            </div>
            <span class="weekday-label">{{ wd }}</span>
            <span class="weekday-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- Найближчі річниці -->
      <div class="section-card" v-if="stats.upcomingDates?.length">
        <h2>Найближчі річниці</h2>
        <div class="anniversary-list">
          <div v-for="(d, i) in stats.upcomingDates" :key="i" class="anniversary-item">
            <div class="anniversary-days">
              <span class="days-num">{{ d.daysUntil }}</span>
              <span class="days-label">дн.</span>
            </div>
            <div class="anniversary-body">
              <span class="anniversary-name">{{ d.name }}</span>
              <span v-if="d.description" class="anniversary-desc">{{ d.description }}</span>
            </div>
            <span class="anniversary-years">{{ d.yearsCount }} р.</span>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📊</span>
      <p>Немає даних</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGroupsStore } from '../stores/group.js'
import { memoriesApi } from '../api/memories.js'

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

const contentLabel = (type) =>
    ({ ANIME: 'Аніме', HENTAI: 'Хентай', SERIES: 'Серіал', FILM: 'Фільм' }[type] || type)

const barWidth = (val, obj) => {
  const max = Math.max(...Object.values(obj))
  return max === 0 ? 0 : Math.round((val / max) * 100)
}

const weekdayHeight = (val, obj) => {
  const max = Math.max(...Object.values(obj))
  return max === 0 ? 4 : Math.max(4, Math.round((val / max) * 56))
}

const formatMonth = (ym) => {
  const [year, month] = ym.split('-')
  const months = ['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру']
  return `${months[parseInt(month) - 1]} ${year}`
}
</script>

<style scoped>
.stats-view { padding-bottom: 20px; }

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px 12px;
  position: sticky; top: 0;
  background: var(--bg); z-index: 10;
  border-bottom: 1px solid var(--border);
}
.page-header h1 { font-size: 18px; font-weight: 700; }
.group-select {
  background: var(--input-bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 6px 10px; font-size: 13px; color: var(--text);
}

.loader-wrap { display: flex; justify-content: center; padding: 60px; }
.loader {
  width: 32px; height: 32px;
  border: 3px solid var(--border); border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.stats-content { padding: 16px; display: flex; flex-direction: column; gap: 14px; }

/* ── Сітка карток ── */
.cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.stat-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 18px; padding: 20px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: 0 2px 10px var(--shadow);
}
.stat-num { font-size: 32px; font-weight: 800; color: var(--accent); line-height: 1; }
.stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; text-align: center; }

/* ── Streak ── */
.streak-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.streak-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 18px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 10px var(--shadow);
}
.streak-card.accent { border-color: var(--accent); background: var(--accent-light); }
.streak-icon { font-size: 28px; line-height: 1; }
.streak-body { display: flex; flex-direction: column; }
.streak-num { font-size: 28px; font-weight: 800; color: var(--accent); line-height: 1; }
.streak-label { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }

/* ── Секція-картка ── */
.section-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 18px; padding: 18px 16px;
  box-shadow: 0 2px 10px var(--shadow);
}
.section-card h2 {
  font-size: 11px; font-weight: 700; margin-bottom: 14px;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.7px;
}

/* ── Топ контент ── */
.top-list { display: flex; flex-direction: column; gap: 10px; }
.top-item { display: flex; align-items: center; gap: 10px; }
.top-rank { font-size: 13px; font-weight: 800; color: var(--text-muted); width: 22px; flex-shrink: 0; }
.top-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.top-name { font-size: 14px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-meta { display: flex; align-items: center; gap: 6px; }
.top-series { font-size: 11px; color: var(--text-muted); }
.top-count { font-size: 13px; font-weight: 700; color: var(--accent); flex-shrink: 0; }

.ctype { font-size: 10px; font-weight: 700; border-radius: 6px; padding: 2px 7px; flex-shrink: 0; }
.ctype.anime  { background: #e8f4ff; color: #1a73e8; }
.ctype.hentai { background: #fde8f5; color: #c2185b; }
.ctype.series { background: #e8f5e9; color: #2e7d32; }
.ctype.film   { background: #fff3e0; color: #e65100; }

/* ── Бари ── */
.bar-list { display: flex; flex-direction: column; gap: 10px; }
.bar-row { display: flex; align-items: center; gap: 10px; }
.bar-label { font-size: 12px; color: var(--text); width: 68px; flex-shrink: 0; }
.bar-track { flex: 1; height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
.bar-fill-alt { background: var(--accent-hover); opacity: 0.8; }
.bar-val { font-size: 12px; font-weight: 600; color: var(--text-muted); width: 22px; text-align: right; }

/* ── Дні тижня (стовпчики) ── */
.weekday-grid { display: flex; justify-content: space-between; align-items: flex-end; gap: 6px; }
.weekday-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 4px; }
.weekday-bar-wrap { height: 60px; display: flex; align-items: flex-end; }
.weekday-bar {
  width: 100%; min-height: 4px;
  background: var(--accent); border-radius: 4px 4px 0 0; opacity: 0.85;
  transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
}
.weekday-label { font-size: 10px; color: var(--text-muted); font-weight: 600; }
.weekday-val { font-size: 11px; color: var(--accent); font-weight: 700; }

/* ── Річниці ── */
.anniversary-list { display: flex; flex-direction: column; gap: 10px; }
.anniversary-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  background: var(--bg-secondary); border-radius: 12px;
}
.anniversary-days { display: flex; flex-direction: column; align-items: center; min-width: 36px; }
.days-num { font-size: 20px; font-weight: 800; color: var(--accent); line-height: 1; }
.days-label { font-size: 10px; color: var(--text-muted); }
.anniversary-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.anniversary-name { font-size: 13px; font-weight: 700; color: var(--text); }
.anniversary-desc { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.anniversary-years { font-size: 12px; font-weight: 600; color: var(--text-muted); flex-shrink: 0; }

/* ── Empty ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; padding: 60px 20px; color: var(--text-muted);
}
.empty-icon { font-size: 48px; }
</style>