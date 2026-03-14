<template>
  <div class="home">

    <!-- HEADER -->
    <header class="home-header">
      <div class="header-left">
        <IconHeart :size="20" :filled="true" class="logo-icon" />
        <h1>Memories</h1>
      </div>
      <div class="header-right">
        <select v-if="groupsStore.groups.length > 1" v-model="selectedGroupId" class="group-select" @change="onGroupChange">
          <option v-for="g in groupsStore.groups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
        <span v-else-if="groupsStore.currentGroup" class="group-name">{{ groupsStore.currentGroup.name }}</span>
      </div>
    </header>

    <!-- SEARCH BAR -->
    <div v-if="groupsStore.currentGroup" class="search-bar-wrap">
      <div class="search-bar" :class="{ active: searchQuery }">
        <span class="search-bar-icon">🔍</span>
        <input
            v-model="searchQuery"
            class="search-bar-input"
            placeholder="Пошук постів, контенту, дат..."
            @input="onSearchInput"
        />
        <button v-if="searchQuery" class="search-bar-clear" @click="clearSearch">
          <IconClose :size="14" />
        </button>
      </div>
    </div>

    <!-- NO GROUP -->
    <div v-if="!groupsStore.currentGroup && !groupsStore.loading" class="empty-state">
      <div class="empty-icon">💝</div>
      <p class="empty-title">Ще немає групи</p>
      <button class="btn-accent" @click="showCreateGroup = true">Створити групу</button>
    </div>

    <div v-else>
      <button class="fab" @click="showCreateDay = true" title="Новий день">
        <IconPlus :size="22" />
      </button>

      <!-- LOADER -->
      <div v-if="loading && displayDays.length === 0" class="loader-wrap">
        <div class="spinner"></div>
      </div>

      <!-- SEARCH LOADING -->
      <div v-else-if="searchLoading" class="loader-wrap">
        <div class="spinner"></div>
      </div>

      <!-- NO RESULTS -->
      <div v-else-if="searchQuery && searchResults.length === 0 && !searchLoading" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-title">Нічого не знайдено</p>
        <p class="empty-sub">Спробуй інший запит</p>
      </div>

      <!-- EMPTY DAYS -->
      <div v-else-if="!searchQuery && days.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📖</div>
        <p class="empty-title">Поки немає спогадів</p>
        <p class="empty-sub">Натисни + щоб додати перший день</p>
      </div>

      <!-- TIMELINE -->
      <div v-else-if="displayDays.length > 0" class="timeline">

        <!-- Search results label -->
        <div v-if="searchQuery" class="search-results-label">
          Знайдено: {{ searchResults.length }} {{ pluralDays(searchResults.length) }}
        </div>

        <template v-for="(day, index) in displayDays" :key="day.id">
          <div v-if="isNewYear(day, index)" class="year-divider">
            <span class="year-text">{{ getYear(day.date) }}</span>
          </div>

          <div class="timeline-row" :id="`day-${day.id}`">
            <div class="date-stamp">
              <span class="stamp-day">{{ getDay(day.date) }}</span>
              <span class="stamp-month">{{ getMonth(day.date) }}</span>
              <span class="stamp-weekday">{{ getWeekday(day.date) }}</span>
            </div>
            <div class="spine">
              <div class="spine-dot"></div>
              <div class="spine-line"></div>
            </div>
            <div class="day-content">
              <div class="day-header-card">
                <span class="card-date-full">{{ formatDateFull(day.date) }}</span>
                <button class="topbar-delete" @click="confirmDeleteDay(day.id)" aria-label="Видалити день">
                  <IconClose :size="16" />
                </button>
              </div>

              <div v-if="day.dates?.length" class="sub-cards-row">
                <div v-for="d in day.dates" :key="d.id" class="mini-card date-mini-card">
                  <span class="chip-icon">📅</span>
                  <div class="chip-body">
                    <span class="chip-name">{{ d.name }}</span>
                    <span v-if="d.description" class="chip-sub">{{ d.description }}</span>
                  </div>
                  <span class="chip-tag">{{ d.once ? 'раз' : '∞' }}</span>
                  <button class="mini-del" @click="deleteDate(day, d.id)" aria-label="Видалити дату">
                    <IconClose :size="16" />
                  </button>
                </div>
              </div>

              <div v-if="day.contents?.length" class="sub-cards-col">
                <div v-for="c in day.contents" :key="c.id" class="mini-card content-mini-card">
                  <span :class="['ctype', ctypeClass(c.type)]">{{ contentLabel(c.type) }}</span>
                  <span class="content-name">{{ c.name }}</span>
                  <span v-if="c.watchedSeries" class="content-meta">ep.{{ c.watchedSeries }}<span v-if="c.season"> s{{ c.season }}</span></span>
                  <button class="mini-del" @click="deleteContent(day, c.id)" aria-label="Видалити контент">
                    <IconClose :size="16" />
                  </button>
                </div>
              </div>

              <div v-if="day.posts?.length" class="sub-cards-col">
                <div v-for="post in day.posts" :key="post.id" class="mini-card post-mini-card">
                  <div class="bubble-meta">
                    <span class="bubble-vis">{{ post.visibility === 'GROUP' ? '👥' : '🔒' }}</span>
                    <span class="bubble-time">{{ formatTime(post.createAt) }}</span>
                    <button class="mini-del" @click="deletePost(day, post.id)" aria-label="Видалити пост">
                      <IconClose :size="16" />
                    </button>
                  </div>
                  <p class="bubble-text" v-html="highlight(post.text)"></p>
                  <div v-if="post.media?.length" class="bubble-media" :class="'cols-' + Math.min(post.media.length, 3)">
                    <div v-for="m in post.media" :key="m.id" class="media-cell" @click="lightboxMedia = m">
                      <img v-if="m.type?.startsWith('image')" :src="m.url" alt="" loading="lazy" />
                      <div v-else class="media-video-wrap">
                        <video :src="m.url" />
                        <div class="play-overlay"><IconFilm :size="20" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button class="card-action-btn" @click="openDialog('post', day)"><IconPlus :size="13" /><span>Пост</span></button>
                <button class="card-action-btn" @click="openDialog('date', day)"><IconPlus :size="13" /><span>Дата</span></button>
                <button class="card-action-btn" @click="openDialog('content', day)"><IconPlus :size="13" /><span>Контент</span></button>
              </div>
            </div>
          </div>
        </template>

        <!-- Load more — тільки коли не в режимі пошуку -->
        <div v-if="!searchQuery && hasMore" class="load-more-wrap">
          <button class="load-more-btn" @click="loadMore" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            <span v-else>Завантажити ще</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="lightboxMedia" class="lightbox" @click="lightboxMedia = null">
          <img v-if="lightboxMedia.type?.startsWith('image')" :src="lightboxMedia.url" alt="" />
          <video v-else :src="lightboxMedia.url" controls autoplay />
          <button class="lightbox-x" @click="lightboxMedia = null"><IconClose :size="22" /></button>
        </div>
      </transition>
    </teleport>

    <!-- DIALOGS -->
    <PostDialog      v-model="dialogs.post"    :day="dialogTargetDay" @posted="onPosted" />
    <ContentDialog   v-model="dialogs.content" :day="dialogTargetDay" @added="onContentAdded" />
    <DateDialog      v-model="dialogs.date"    :day="dialogTargetDay" @added="onDateAdded" />
    <CreateDayDialog v-model="showCreateDay"   :loading="createLoading" @create="createDay" />
    <CreateGroupDialog v-model="showCreateGroup" :loading="createLoading" @create="createGroup" />
    <ConfirmDeleteDialog v-model="showConfirmDelete" message="Видалити цей день?" @confirm="deleteDay" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGroupsStore } from '../stores/group.js'
import { memoriesApi } from '../api/memories.js'
import IconHeart from '../components/icons/IconHeart.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconClose from '../components/icons/IconClose.vue'
import IconFilm from '../components/icons/IconFilm.vue'
import PostDialog from '../components/dialogs/PostDialog.vue'
import ContentDialog from '../components/dialogs/ContentDialog.vue'
import DateDialog from '../components/dialogs/DateDialog.vue'
import CreateDayDialog from '../components/dialogs/CreateDayDialog.vue'
import CreateGroupDialog from '../components/dialogs/CreateGroupDialog.vue'
import ConfirmDeleteDialog from '../components/dialogs/ConfirmDeleteDialog.vue'

const groupsStore = useGroupsStore()
const days = ref([])
const loading = ref(false)
const page = ref(0)
const hasMore = ref(true)
const showCreateDay = ref(false)
const showCreateGroup = ref(false)
const createLoading = ref(false)
const selectedGroupId = ref(null)
const lightboxMedia = ref(null)
const showConfirmDelete = ref(false)
const pendingDeleteId = ref(null)
const dialogs = ref({ post: false, content: false, date: false })
const dialogTargetDay = ref(null)

// Search
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
let searchTimeout = null

// Показуємо результати пошуку або звичайний список
const displayDays = computed(() => searchQuery.value ? searchResults.value : days.value)

const onSearchInput = () => {
  clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(doSearch, 350)
}

const doSearch = async () => {
  if (!groupsStore.currentGroup || !searchQuery.value.trim()) return
  searchLoading.value = true
  try {
    searchResults.value = await memoriesApi.searchDays(
        groupsStore.currentGroup.id,
        searchQuery.value.trim()
    )
  } catch {
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  clearTimeout(searchTimeout)
}

// Підсвічування тексту в результатах пошуку
const highlight = (text) => {
  if (!searchQuery.value || !text) return text
  const escaped = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

const pluralDays = (n) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дні'
  return 'днів'
}

const openDialog = (type, day) => { dialogTargetDay.value = day; dialogs.value[type] = true }

const onPosted = (post) => { if (!dialogTargetDay.value.posts) dialogTargetDay.value.posts = []; dialogTargetDay.value.posts.unshift(post) }
const onContentAdded = (c) => { if (!dialogTargetDay.value.contents) dialogTargetDay.value.contents = []; dialogTargetDay.value.contents.push(c) }
const onDateAdded = (d) => { if (!dialogTargetDay.value.dates) dialogTargetDay.value.dates = []; dialogTargetDay.value.dates.push(d) }

const confirmDeleteDay = (id) => { pendingDeleteId.value = id; showConfirmDelete.value = true }
const deleteDay = async () => {
  await memoriesApi.deleteDay(pendingDeleteId.value)
  days.value = days.value.filter(d => d.id !== pendingDeleteId.value)
  searchResults.value = searchResults.value.filter(d => d.id !== pendingDeleteId.value)
  showConfirmDelete.value = false; pendingDeleteId.value = null
}
const deleteDate    = async (day, id) => { await memoriesApi.deleteDate(id);   day.dates    = day.dates.filter(d => d.id !== id) }
const deleteContent = async (day, id) => { await memoriesApi.deleteContent(id); day.contents = day.contents.filter(c => c.id !== id) }
const deletePost    = async (day, id) => { await memoriesApi.deletePost(id);   day.posts    = day.posts.filter(p => p.id !== id) }

onMounted(async () => {
  await groupsStore.fetchMyGroups()
  if (groupsStore.currentGroup) { selectedGroupId.value = groupsStore.currentGroup.id; await loadDays() }
})
watch(() => groupsStore.currentGroup, async (g) => {
  if (g) { selectedGroupId.value = g.id; days.value = []; page.value = 0; hasMore.value = true; clearSearch(); await loadDays() }
})
const onGroupChange = async () => {
  await groupsStore.fetchGroupById(selectedGroupId.value)
  days.value = []; page.value = 0; hasMore.value = true; clearSearch(); await loadDays()
}
const loadDays = async () => {
  if (!groupsStore.currentGroup || loading.value) return
  loading.value = true
  try {
    const result = await memoriesApi.getGroupDays(groupsStore.currentGroup.id, page.value, 10)
    const items = Array.isArray(result) ? result : result.content || []
    const full = await Promise.all(items.map(d => memoriesApi.getDayById(d.id)))
    days.value.push(...full)
    hasMore.value = items.length === 10
  } finally { loading.value = false }
}
const loadMore = async () => { page.value++; await loadDays() }
const createDay = async (date) => {
  if (!groupsStore.currentGroup) return
  createLoading.value = true
  try {
    const created = await memoriesApi.createDay({ groupId: groupsStore.currentGroup.id, date })
    const full = await memoriesApi.getDayById(created.id)
    days.value.unshift(full); showCreateDay.value = false
  } finally { createLoading.value = false }
}
const createGroup = async ({ name, partner }) => {
  createLoading.value = true
  try {
    await groupsStore.createGroup({ name, memberIds: [partner.id] })
    showCreateGroup.value = false; days.value = []; page.value = 0; await loadDays()
  } finally { createLoading.value = false }
}

const contentLabel   = (type) => ({ ANIME: 'Аніме', CARTOON: 'Мультик', SERIES: 'Серіал', FILM: 'Фільм', HENTAI: 'Хентай' }[type] || type)
const ctypeClass     = (type) => ({ ANIME: 'anime', CARTOON: 'hentai', SERIES: 'series', FILM: 'film', HENTAI: 'hentai' }[type] || '')
const getYear        = (d) => new Date(d).getFullYear()
const getDay         = (d) => new Date(d).getDate()
const getMonth       = (d) => new Date(d).toLocaleDateString('uk-UA', { month: 'short' })
const getWeekday     = (d) => new Date(d).toLocaleDateString('uk-UA', { weekday: 'short' })
const formatDateFull = (d) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
const formatTime     = (d) => new Date(d).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
const isNewYear      = (day, index) => index === 0 || getYear(day.date) !== getYear(displayDays.value[index - 1].date)
</script>

<style scoped>
.home { min-height: 100vh; padding-bottom: 100px; }
.home-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 14px; position: sticky; top: 0; z-index: 50; background: var(--bg); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.header-left { display: flex; align-items: center; gap: 9px; }
.logo-icon { color: var(--accent); }
.home-header h1 { font-size: 19px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg, var(--accent), var(--accent-hover, var(--accent))); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.group-select { background: var(--input-bg); border: 1px solid var(--border); border-radius: 10px; padding: 6px 10px; font-size: 13px; color: var(--text); max-width: 130px; outline: none; }
.group-name { font-size: 13px; color: var(--text-muted); font-weight: 500; }

/* ── Search bar ── */
.search-bar-wrap {
  padding: 10px 16px 6px;
  position: sticky;
  top: 57px;
  z-index: 40;
  background: var(--bg);
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}
.search-bar.active { border-color: var(--accent); }
.search-bar-icon { font-size: 15px; flex-shrink: 0; }
.search-bar-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text);
  min-width: 0;
}
.search-bar-input::placeholder { color: var(--text-muted); }
.search-bar-clear {
  display: flex; align-items: center; justify-content: center;
  min-width: 28px; min-height: 28px;
  border-radius: 50%;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.search-bar-clear:hover { background: var(--bg-secondary); color: var(--text); }

.search-results-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  padding: 4px 4px 8px;
  letter-spacing: 0.3px;
}

/* ── FAB ── */
.fab { position: fixed; bottom: calc(80px + env(safe-area-inset-bottom)); right: 20px; z-index: 40; width: 52px; height: 52px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.18); transition: transform 0.2s, box-shadow 0.2s; }
.fab:active { transform: scale(0.93); }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 80px 20px; text-align: center; }
.empty-icon { font-size: 48px; line-height: 1; margin-bottom: 4px; }
.empty-title { font-size: 17px; font-weight: 700; color: var(--text); }
.empty-sub { font-size: 14px; color: var(--text-muted); }
.loader-wrap { display: flex; justify-content: center; padding: 60px; }
.spinner { width: 28px; height: 28px; border: 2.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.65s linear infinite; }
.spinner-sm { width: 16px; height: 16px; display: inline-block; border: 2px solid rgba(0,0,0,0.15); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.65s linear infinite; vertical-align: middle; }
@keyframes spin { to { transform: rotate(360deg); } }
.timeline { padding: 8px 16px 20px; }
.year-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; padding-left: 4px; }
.year-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.year-text { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.timeline-row { display: grid; grid-template-columns: 38px 28px 1fr; align-items: stretch; margin-bottom: 16px; }
.date-stamp { display: flex; flex-direction: column; align-items: center; padding-top: 12px; }
.stamp-day { font-size: 20px; font-weight: 800; color: var(--text); line-height: 1; }
.stamp-month { font-size: 11px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.3px; }
.stamp-weekday { font-size: 10px; color: var(--text-muted); text-transform: capitalize; margin-top: 1px; }
.spine { display: flex; flex-direction: column; align-items: center; padding-top: 16px; padding-bottom: 5%; }
.spine-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--bg), 0 0 0 4px var(--accent); flex-shrink: 0; z-index: 1; }
.spine-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--accent) 0%, var(--border) 100%); margin-top: 6px; opacity: 0.4; }
.day-content { display: flex; flex-direction: column; min-width: 0; }
.day-header-card { display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 0 10px 0 14px; margin-bottom: 6px; }
.card-date-full { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: capitalize; flex: 1; }
.topbar-delete { color: var(--text-muted); opacity: 0.5; display: flex; align-items: center; justify-content: center; min-width: 36px; min-height: 36px; border-radius: 10px; transition: opacity 0.15s, color 0.15s, background 0.15s; flex-shrink: 0; }
.topbar-delete:hover { opacity: 1; color: #e05555; background: rgba(224,85,85,0.08); }
.sub-cards-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.sub-cards-col { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; }
.mini-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; animation: fadeSlideIn 0.22s ease; transition: box-shadow 0.18s; }
.mini-card:hover { box-shadow: 0 3px 14px rgba(0,0,0,0.06); }
@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.mini-del { display: flex; align-items: center; justify-content: center; min-width: 36px; min-height: 36px; border-radius: 10px; color: var(--text-muted); opacity: 0.45; flex-shrink: 0; transition: opacity 0.15s, color 0.15s, background 0.15s; }
.mini-del:hover { opacity: 1; color: #e05555; background: rgba(224,85,85,0.09); }
.date-mini-card { display: flex; align-items: center; gap: 6px; padding: 8px 4px 8px 10px; }
.chip-icon { font-size: 14px; flex-shrink: 0; }
.chip-body { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.chip-name { font-size: 12px; font-weight: 700; color: var(--text); line-height: 1.2; }
.chip-sub { font-size: 10px; color: var(--text-muted); }
.chip-tag { font-size: 10px; color: var(--accent); font-weight: 700; white-space: nowrap; }
.content-mini-card { display: flex; align-items: center; gap: 8px; padding: 8px 4px 8px 10px; }
.ctype { font-size: 10px; font-weight: 700; border-radius: 6px; padding: 2px 7px; letter-spacing: 0.3px; flex-shrink: 0; }
.ctype.anime  { background: #e8f4ff; color: #1a73e8; }
.ctype.hentai { background: #fde8f5; color: #c2185b; }
.ctype.series { background: #e8f5e9; color: #2e7d32; }
.ctype.film   { background: #fff3e0; color: #e65100; }
.content-name { font-size: 13px; font-weight: 500; color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.content-meta { font-size: 11px; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
.post-mini-card { padding: 10px 4px 10px 12px; }
.bubble-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.bubble-vis  { font-size: 13px; }
.bubble-time { font-size: 11px; color: var(--text-muted); flex: 1; }
.bubble-text { font-size: 13px; line-height: 1.65; color: var(--text); white-space: pre-wrap; margin: 0; padding-right: 8px; }
.bubble-text :deep(mark) { background: var(--accent-light); color: var(--accent); border-radius: 3px; padding: 0 2px; font-weight: 600; }
.bubble-media { display: grid; gap: 3px; margin-top: 8px; margin-right: 8px; border-radius: 10px; overflow: hidden; }
.bubble-media.cols-1 { grid-template-columns: 1fr; }
.bubble-media.cols-2 { grid-template-columns: 1fr 1fr; }
.bubble-media.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.media-cell { aspect-ratio: 1; overflow: hidden; cursor: pointer; background: var(--bg); position: relative; }
.media-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
.media-cell:hover img { transform: scale(1.06); }
.media-video-wrap { width: 100%; height: 100%; position: relative; }
.media-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); color: white; }
.card-actions { display: flex; gap: 6px; padding: 2px 0 10px; }
.card-action-btn { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 6px 13px; transition: color 0.15s, background 0.15s, border-color 0.15s; }
.card-action-btn:hover { color: var(--accent); background: var(--accent-light); border-color: transparent; }
.load-more-wrap { display: flex; justify-content: center; padding: 16px 0; }
.load-more-btn { display: flex; align-items: center; gap: 8px; color: var(--accent); font-size: 14px; font-weight: 600; padding: 10px 22px; border: 1.5px solid var(--accent); border-radius: 20px; transition: background 0.15s; }
.load-more-btn:hover { background: var(--accent-light); }
.load-more-btn:disabled { opacity: 0.5; }
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.94); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 20px; }
.lightbox img, .lightbox video { max-width: 100%; max-height: 90vh; border-radius: 14px; object-fit: contain; }
.lightbox-x { position: absolute; top: 16px; right: 16px; color: white; background: rgba(255,255,255,0.12); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.lightbox-x:hover { background: rgba(255,255,255,0.22); }
.btn-accent { background: var(--accent); color: white; border-radius: 14px; padding: 14px 22px; font-size: 15px; font-weight: 700; transition: background 0.2s, transform 0.15s; }
.btn-accent:hover:not(:disabled) { background: var(--accent-hover, var(--accent)); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>