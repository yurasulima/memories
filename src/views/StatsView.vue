<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroupsStore } from '@/stores/group'
import { memoriesApi } from '@/api/memories'
import type { StatsResponse, MemoriesContentType } from '@/api/models'

const { t } = useI18n()

const groupsStore = useGroupsStore()
const stats = ref<StatsResponse | null>(null)
const loading = ref<boolean>(false)
const selectedGroupId = ref<number | null>(null)

onMounted(async () => {
  await groupsStore.fetchMyGroups()
  if (groupsStore.currentGroup) {
    selectedGroupId.value = groupsStore.currentGroup.id
    await load()
  }
})

// Оновлюємо статистику щоразу при поверненні на екран
onActivated(async () => {
  if (groupsStore.currentGroup) {
    await load()
  }
})

const load = async (): Promise<void> => {
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

const CONTENT_LABELS: Record<MemoriesContentType, string> = {
  ANIME: 'ANIME', CARTOON: 'CARTOON', SERIES: 'SERIES', FILM: 'FILM', HENTAI: 'HENTAI'
}
const contentLabel = (type: MemoriesContentType): string => t(`stats.contentTypes.${type}`) ?? type

const barWidth = (val: number, obj: Record<string, number>): number => {
  const max = Math.max(...Object.values(obj))
  return max === 0 ? 0 : Math.round((val / max) * 100)
}

const weekdayHeight = (val: number, obj: Record<string, number>): number => {
  const max = Math.max(...Object.values(obj))
  return max === 0 ? 4 : Math.max(4, Math.round((val / max) * 56))
}

const formatMonth = (ym: string): string => {
  const [year, month] = ym.split('-')
  const months = t('stats.months') as unknown as string[]
  return `${months[parseInt(month) - 1]} ${year}`
}
</script>

<template>
  <div class="stats-view">
    <header class="page-header">
      <h1>{{ $t('stats.title') }}</h1>
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
          <span class="stat-label">{{ $t('stats.totalRecords') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalPosts }}</span>
          <span class="stat-label">{{ $t('stats.posts') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalContents }}</span>
          <span class="stat-label">{{ $t('stats.watched') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalMedia }}</span>
          <span class="stat-label">{{ $t('stats.photos') }}</span>
        </div>
      </div>

      <!-- Streak -->
      <div class="streak-row">
        <div class="streak-card accent">
          <span class="streak-icon">🔥</span>
          <div class="streak-body">
            <span class="streak-num">{{ stats.currentStreak }}</span>
            <span class="streak-label">{{ $t('stats.currentStreak') }}</span>
          </div>
        </div>
        <div class="streak-card">
          <span class="streak-icon">🏆</span>
          <div class="streak-body">
            <span class="streak-num">{{ stats.longestStreak }}</span>
            <span class="streak-label">{{ $t('stats.longestStreak') }}</span>
          </div>
        </div>
      </div>

      <!-- Дати та пости -->
      <div class="cards-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalOnceDates }}</span>
          <span class="stat-label">{{ $t('stats.oneTimeDates') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalRecurringDates }}</span>
          <span class="stat-label">{{ $t('stats.yearlyDates') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalGroupPosts }}</span>
          <span class="stat-label">{{ $t('stats.sharedPosts') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalPrivatePosts }}</span>
          <span class="stat-label">{{ $t('stats.personalPosts') }}</span>
        </div>
      </div>

      <!-- Топ контент -->
      <div class="section-card" v-if="stats.topContent?.length">
        <h2 class="section-title">{{ $t('stats.topContent') }}</h2>
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
        <h2 class="section-title">{{ $t('stats.contentByType') }}</h2>
        <div class="bar-list">
          <div v-for="(val, type) in stats.contentByType" :key="type" class="bar-row">
            <span class="bar-label">{{ contentLabel(type as MemoriesContentType) }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: barWidth(val, stats.contentByType) + '%' }"></div>
            </div>
            <span class="bar-val">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- Записів по місяцях -->
      <div class="section-card" v-if="stats.daysByMonth && Object.keys(stats.daysByMonth).length">
        <h2 class="section-title">{{ $t('stats.recordsByMonth') }}</h2>
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
        <h2 class="section-title">{{ $t('stats.postsByMonth') }}</h2>
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
        <h2 class="section-title">{{ $t('stats.activityByDay') }}</h2>
        <div class="weekday-grid">
          <div v-for="(val, wd) in stats.daysByWeekday" :key="wd" class="weekday-col">
            <span class="weekday-val">{{ val }}</span>
            <div class="weekday-bar-wrap">
              <div class="weekday-bar" :style="{ height: weekdayHeight(val, stats.daysByWeekday) + 'px' }"></div>
            </div>
            <span class="weekday-label">{{ wd }}</span>
          </div>
        </div>
      </div>

      <!-- Найближчі річниці -->
      <div class="section-card" v-if="stats.upcomingDates?.length">
        <h2 class="section-title">{{ $t('stats.upcomingAnniversaries') }}</h2>
        <div class="anniversary-list">
          <div v-for="(d, i) in stats.upcomingDates" :key="i" class="anniversary-item">
            <div class="anniversary-days">
              <span class="days-num">{{ d.daysUntil }}</span>
              <span class="days-label">{{ $t('stats.days') }}</span>
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
      <p>{{ $t('stats.noData') }}</p>
    </div>
  </div>
</template>

<style scoped>
.stats-view {
  padding-bottom: 32px;
  min-height: 100vh;
  background: var(--bg);
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.group-select {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text);
  outline: none;
}

/* ── Loader ── */
.loader-wrap { display: flex; justify-content: center; padding: 80px; }
.loader {
  width: 32px; height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Layout ── */
.stats-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Сітка карток ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 12px var(--shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow);
}
.stat-num {
  font-size: 34px;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -1px;
}
.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Streak ── */
.streak-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.streak-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 12px var(--shadow);
  transition: transform 0.18s ease;
}
.streak-card:hover { transform: translateY(-2px); }
.streak-card.accent {
  border-color: var(--accent);
  background: var(--accent-light, rgba(var(--accent-rgb, 255,90,130), 0.08));
}
.streak-icon { font-size: 30px; line-height: 1; flex-shrink: 0; }
.streak-body { display: flex; flex-direction: column; gap: 2px; }
.streak-num {
  font-size: 30px;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -1px;
}
.streak-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Section card ── */
.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px 18px;
  box-shadow: 0 2px 12px var(--shadow);
}
.section-title {
  font-size: 10px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Топ контент ── */
.top-list { display: flex; flex-direction: column; gap: 12px; }
.top-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: 14px;
  transition: background 0.15s;
}
.top-item:hover { background: var(--border); }
.top-rank {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent);
  width: 24px;
  flex-shrink: 0;
}
.top-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.top-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-meta { display: flex; align-items: center; gap: 6px; }
.top-series { font-size: 11px; color: var(--text-muted); }
.top-count {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ── Ctype badges ── */
.ctype {
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 7px;
  flex-shrink: 0;
  letter-spacing: 1px;
}
.ctype.anime   { background: #d0e7ff; color: #1a73e8; }
.ctype.hentai  { background: #f4d0e0; color: #c2185b; }
.ctype.cartoon { background: #f4d0e0; color: #c2185b; }
.ctype.series  { background: #dff0d8; color: #2e7d32; }
.ctype.film    { background: #fff3e0; color: #e65100; }

/* ── Бари ── */
.bar-list { display: flex; flex-direction: column; gap: 10px; }
.bar-row { display: flex; align-items: center; gap: 10px; }
.bar-label {
  font-size: 12px;
  color: var(--text);
  font-weight: 500;
  width: 68px;
  flex-shrink: 0;
}
.bar-track {
  flex: 1;
  height: 7px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.bar-fill-alt {
  background: var(--accent-hover, var(--accent));
  opacity: 0.7;
}
.bar-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

/* ── Дні тижня ── */
.weekday-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4px;
  padding-top: 4px;
}
.weekday-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 4px;
}
.weekday-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  min-height: 16px;
}
.weekday-bar-wrap {
  height: 60px;
  display: flex;
  align-items: flex-end;
  width: 100%;
}
.weekday-bar {
  width: 100%;
  min-height: 4px;
  background: var(--accent);
  border-radius: 4px 4px 0 0;
  opacity: 0.8;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.weekday-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Річниці ── */
.anniversary-list { display: flex; flex-direction: column; gap: 8px; }
.anniversary-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: var(--bg-secondary);
  border-radius: 14px;
  transition: background 0.15s;
}
.anniversary-item:hover { background: var(--border); }
.anniversary-days {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 38px;
}
.days-num {
  font-size: 22px;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -0.5px;
}
.days-label { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
.anniversary-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.anniversary-name { font-size: 13px; font-weight: 700; color: var(--text); }
.anniversary-desc {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.anniversary-years {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ── Empty ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 20px;
  color: var(--text-muted);
}
.empty-icon { font-size: 52px; }
</style>