<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGroupsStore } from '@/stores/group'
import { memoriesApi } from '@/api/memories'
import { mediaUrl } from '@/api/api'
import type { DayResponse, MediaResponse, PostResponse, ContentResponse, DateResponse, MemoriesContentType } from '@/api/models'
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

type DialogType = 'post' | 'content' | 'date'

interface Dialogs {
  post: boolean
  content: boolean
  date: boolean
}

interface CreateGroupPayload {
  name: string
  partner: { id: number }
}

const groupsStore = useGroupsStore()
const days = ref<DayResponse[]>([])
const loading = ref<boolean>(false)
const page = ref<number>(0)
const hasMore = ref<boolean>(true)
const showCreateDay = ref<boolean>(false)
const showCreateGroup = ref<boolean>(false)
const createLoading = ref<boolean>(false)
const selectedGroupId = ref<number | null>(null)
const lightboxMedia = ref<MediaResponse | null>(null)
const showConfirmDelete = ref<boolean>(false)
const pendingDeleteId = ref<number | null>(null)
const dialogs = ref<Dialogs>({ post: false, content: false, date: false })
const dialogTargetDay = ref<DayResponse | null>(null)
const dropdownOpen = ref<boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Search
const searchQuery = ref<string>('')
const searchResults = ref<DayResponse[]>([])
const searchLoading = ref<boolean>(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// ── Infinite scroll ──────────────────────────────────────────────────────────
const handleScroll = (): void => {
  if (loading.value || !hasMore.value || searchQuery.value) return
  const scrollY = window.scrollY
  const windowH = window.innerHeight
  const docH = document.documentElement.scrollHeight
  if (scrollY + windowH >= docH - 250) {
    loadMore()
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  await groupsStore.fetchMyGroups()
  if (groupsStore.currentGroup) {
    selectedGroupId.value = groupsStore.currentGroup.id
    await loadDays()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', onClickOutside)
  if (searchTimeout) clearTimeout(searchTimeout)
})

const onClickOutside = (e: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

const selectStream = async (g: any): Promise<void> => {
  dropdownOpen.value = false
  if (groupsStore.currentGroup?.id === g.id) return
  groupsStore.setCurrentGroup(g)
  selectedGroupId.value = g.id
  days.value = []
  page.value = 0
  hasMore.value = true
  await loadDays()
}

// ── Computed ─────────────────────────────────────────────────────────────────
const displayDays = computed<DayResponse[]>(() =>
    searchQuery.value ? searchResults.value : days.value
)

// ── Search ────────────────────────────────────────────────────────────────────
const onSearchInput = (): void => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(doSearch, 350)
}

const doSearch = async (): Promise<void> => {
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

const clearSearch = (): void => {
  searchQuery.value = ''
  searchResults.value = []
  if (searchTimeout) clearTimeout(searchTimeout)
}

const highlight = (text: string): string => {
  if (!searchQuery.value || !text) return text
  const escaped = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

const pluralDays = (n: number): string => {
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дні'
  return 'днів'
}

// ── Dialogs ───────────────────────────────────────────────────────────────────
const openDialog = (type: DialogType, day: DayResponse): void => {
  dialogTargetDay.value = day
  dialogs.value[type] = true
}

const onPosted = (post: PostResponse): void => {
  if (!dialogTargetDay.value) return
  if (!dialogTargetDay.value.posts) dialogTargetDay.value.posts = []
  dialogTargetDay.value.posts.unshift(post)
}

const onContentAdded = (c: ContentResponse): void => {
  if (!dialogTargetDay.value) return
  if (!dialogTargetDay.value.contents) dialogTargetDay.value.contents = []
  dialogTargetDay.value.contents.push(c)
}

const onDateAdded = (d: DateResponse): void => {
  if (!dialogTargetDay.value) return
  if (!dialogTargetDay.value.dates) dialogTargetDay.value.dates = []
  dialogTargetDay.value.dates.push(d)
}

// ── Delete ─────────────────────────────────────────────────────────────────────
const confirmDeleteDay = (id: number): void => {
  pendingDeleteId.value = id
  showConfirmDelete.value = true
}

const deleteDay = async (): Promise<void> => {
  if (pendingDeleteId.value === null) return
  await memoriesApi.deleteDay(pendingDeleteId.value)
  days.value = days.value.filter(d => d.id !== pendingDeleteId.value)
  searchResults.value = searchResults.value.filter(d => d.id !== pendingDeleteId.value)
  showConfirmDelete.value = false
  pendingDeleteId.value = null
}

const deleteDate = async (day: DayResponse, id: number): Promise<void> => {
  await memoriesApi.deleteDate(id)
  day.dates = day.dates.filter(d => d.id !== id)
}

const deleteContent = async (day: DayResponse, id: number): Promise<void> => {
  await memoriesApi.deleteContent(id)
  day.contents = day.contents.filter(c => c.id !== id)
}

const deletePost = async (day: DayResponse, id: number): Promise<void> => {
  await memoriesApi.deletePost(id)
  day.posts = day.posts.filter(p => p.id !== id)
}

// ── Data loading ──────────────────────────────────────────────────────────────
watch(() => groupsStore.currentGroup, async (g) => {
  if (g) {
    selectedGroupId.value = g.id
    days.value = []
    page.value = 0
    hasMore.value = true
    clearSearch()
    await loadDays()
  }
})

const onGroupChange = async (): Promise<void> => {
  if (selectedGroupId.value === null) return
  await groupsStore.fetchGroupById(selectedGroupId.value)
  days.value = []
  page.value = 0
  hasMore.value = true
  clearSearch()
  await loadDays()
}

const loadDays = async (): Promise<void> => {
  if (!groupsStore.currentGroup || loading.value) return
  loading.value = true
  try {
    const result = await memoriesApi.getGroupDays(groupsStore.currentGroup.id, page.value, 10)
    const items = Array.isArray(result) ? result : result.content ?? []
    const full = await Promise.all(items.map(d => memoriesApi.getDayById(d.id)))
    days.value.push(...full)
    hasMore.value = items.length === 10
  } finally {
    loading.value = false
  }
}

const loadMore = async (): Promise<void> => {
  page.value++
  await loadDays()
}

const createDay = async (date: string): Promise<void> => {
  if (!groupsStore.currentGroup) return
  createLoading.value = true
  try {
    const created = await memoriesApi.createDay({ groupId: groupsStore.currentGroup.id, date })
    const full = await memoriesApi.getDayById(created.id)
    days.value.unshift(full)
    showCreateDay.value = false
  } finally {
    createLoading.value = false
  }
}

const createGroup = async ({ name, partner }: CreateGroupPayload): Promise<void> => {
  createLoading.value = true
  try {
    const memberIds = partner ? [partner.id] : []
    await groupsStore.createGroup({ name, memberIds })
    showCreateGroup.value = false
    days.value = []
    page.value = 0
    await loadDays()
  } finally {
    createLoading.value = false
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const CONTENT_LABELS: Record<MemoriesContentType, string> = {
  ANIME: 'Аніме', CARTOON: 'Мультик', SERIES: 'Серіал', FILM: 'Фільм', HENTAI: 'Хентай'
}
const CONTENT_CLASSES: Record<MemoriesContentType, string> = {
  ANIME: 'anime', CARTOON: 'cartoon', SERIES: 'series', FILM: 'film', HENTAI: 'hentai'
}

const contentLabel = (type: MemoriesContentType): string => CONTENT_LABELS[type] ?? type
const ctypeClass   = (type: MemoriesContentType): string => CONTENT_CLASSES[type] ?? ''

const getYear        = (d: string): number => new Date(d).getFullYear()
const getDay         = (d: string): number => new Date(d).getDate()
const getMonth       = (d: string): string => new Date(d).toLocaleDateString('uk-UA', { month: 'short' })
const getWeekday     = (d: string): string => new Date(d).toLocaleDateString('uk-UA', { weekday: 'short' })
const formatDateFull = (d: string): string => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
const formatTime     = (d: string): string => new Date(d).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
const isNewYear      = (day: DayResponse, index: number): boolean =>
    index === 0 || getYear(day.date) !== getYear(displayDays.value[index - 1].date)
</script>



<template>
  <div class="home">

    <!-- HEADER -->
    <header class="home-header">
      <div class="header-left">
        <IconHeart :size="20" :filled="true" class="logo-icon" />
        <h1>Memories</h1>
      </div>
      <div class="header-right">
        <!-- Кнопка створення коли стрічок немає -->
        <button
            v-if="groupsStore.groups.length === 0 && !groupsStore.loading"
            class="stream-pill new-stream-btn"
            @click="showCreateGroup = true"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
          <span>{{ $t('home.createGroup') }}</span>
        </button>

        <!-- Dropdown для вибору стрічки -->
        <div v-if="groupsStore.groups.length > 0" class="stream-dropdown-wrap" ref="dropdownRef">
          <button class="stream-pill" @click="dropdownOpen = !dropdownOpen">
            <span class="stream-pill-name">{{ groupsStore.currentGroup?.name }}</span>
            <svg class="stream-pill-chevron" :class="{ open: dropdownOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 4l4 4 4-4"/></svg>
          </button>
          <transition name="dropdown-fade">
            <div v-if="dropdownOpen" class="stream-dropdown">
              <button
                  v-for="g in groupsStore.groups"
                  :key="g.id"
                  class="stream-dropdown-item"
                  :class="{ active: groupsStore.currentGroup?.id === g.id }"
                  @click="selectStream(g)"
              >
                <span class="stream-dot"></span>
                <span>{{ g.name }}</span>
                <svg v-if="groupsStore.currentGroup?.id === g.id" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M2 7l3.5 3.5L12 3"/></svg>
              </button>
              <div class="stream-dropdown-divider"></div>
              <button class="stream-dropdown-item new" @click="dropdownOpen = false; showCreateGroup = true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                <span>{{ $t('home.createGroup') }}</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- SEARCH BAR -->
    <div v-if="groupsStore.currentGroup" class="search-bar-wrap">
      <div class="search-bar" :class="{ active: searchQuery }">
        <span class="search-bar-icon">🔍</span>
        <input
            v-model="searchQuery"
            class="search-bar-input"
            :placeholder="$t('home.searchPlaceholder')"
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
      <p class="empty-title">{{ $t('home.noGroup') }}</p>
      <button class="btn-accent" @click="showCreateGroup = true">{{ $t('home.createGroup') }}</button>
    </div>

    <div v-else>
      <button class="fab" @click="showCreateDay = true" title="Новий день">
        <IconPlus :size="22" />
      </button>

      <!-- INITIAL LOADER -->
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
        <p class="empty-title">{{ $t('home.noResults') }}</p>
        <p class="empty-sub">{{ $t('home.noResultsSub') }}</p>
      </div>

      <!-- EMPTY DAYS -->
      <div v-else-if="!searchQuery && days.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📖</div>
        <p class="empty-title">{{ $t('home.noMemories') }}</p>
        <p class="empty-sub">{{ $t('home.noMemoriesSub') }}</p>
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
                    <div
                        v-for="m in post.media"
                        :key="m.id"
                        class="media-cell"
                        @click="() => { console.log(m);  }"
                    >
                      <img v-if="m.type === 'MEMORIES'" :src="mediaUrl(m.url)" alt="" loading="lazy" />
                      <div v-else class="media-video-wrap">
                        <video :src="mediaUrl(m.url)" />
                        <div class="play-overlay"><IconFilm :size="20" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button class="card-action-btn" @click="openDialog('post', day)"><IconPlus :size="13" /><span>{{ $t('home.addPost') }}</span></button>
                <button class="card-action-btn" @click="openDialog('date', day)"><IconPlus :size="13" /><span>{{ $t('home.addDate') }}</span></button>
                <button class="card-action-btn" @click="openDialog('content', day)"><IconPlus :size="13" /><span>{{ $t('home.addContent') }}</span></button>
              </div>
            </div>
          </div>
        </template>

        <!-- PAGINATION LOADING INDICATOR (dots) -->
        <div v-if="loading && displayDays.length > 0" class="load-more-indicator">
          <div class="lmi-dot"></div>
          <div class="lmi-dot"></div>
          <div class="lmi-dot"></div>
        </div>

        <!-- END OF LIST -->
        <div v-if="!hasMore && !loading && !searchQuery && days.length > 0" class="end-of-list">
          <span>{{ $t('home.endContent') }}</span>
        </div>

      </div>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="lightboxMedia" class="lightbox" @click="lightboxMedia = null">
          <img v-if="lightboxMedia?.type?.startsWith('image')" :src="mediaUrl(lightboxMedia.url)" alt="" />
          <video v-else :src="mediaUrl(lightboxMedia.url)" controls autoplay />
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



<style scoped>
.home { min-height: 100vh; padding-bottom: 100px; }
.home-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 14px; position: sticky; top: 0; z-index: 50; background: var(--bg); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.header-left { display: flex; align-items: center; gap: 9px; }
.logo-icon { color: var(--accent); }
.home-header h1 { font-size: 19px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg, var(--accent), var(--accent-hover, var(--accent))); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
/* ── Stream dropdown ── */
.stream-dropdown-wrap { position: relative; }

.stream-pill {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: 20px; padding: 6px 12px;
  font-size: 13px; font-weight: 600; color: var(--text);
  transition: background 0.15s, border-color 0.15s;
  max-width: 160px;
}
.stream-pill:hover { border-color: var(--accent); }
.new-stream-btn { color: var(--accent); border-color: var(--accent); background: var(--accent-light); }
.new-stream-btn:hover { background: var(--accent); color: white; }
.stream-pill-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 110px; }
.stream-pill-chevron { flex-shrink: 0; color: var(--text-muted); transition: transform 0.2s; }
.stream-pill-chevron.open { transform: rotate(180deg); }

.stream-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 180px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  z-index: 50; overflow: hidden; padding: 6px;
}

.stream-dropdown-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px; border-radius: 10px;
  font-size: 14px; font-weight: 500; color: var(--text);
  transition: background 0.15s; text-align: left;
}

.stream-dropdown-item:hover { background: var(--bg-secondary); }
.stream-dropdown-item.active { color: var(--accent); font-weight: 700; }
.stream-dropdown-item.new { color: var(--text-muted); font-size: 13px; }
.stream-dropdown-item.new:hover { color: var(--accent); background: var(--accent-light); }
.stream-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
.stream-dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }

.dropdown-fade-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-fade-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-6px); }

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
  border: 2px solid var(--border);
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
  letter-spacing: 1px;
}

/* ── FAB ── */
.fab { position: fixed; bottom: calc(80px + env(safe-area-inset-bottom)); right: 20px; z-index: 40; width: 52px; height: 52px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.18); transition: transform 0.2s, box-shadow 0.2s; }
.fab:active { transform: scale(0.93); }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 80px 20px; text-align: center; }
.empty-icon { font-size: 48px; line-height: 1; margin-bottom: 4px; }
.empty-title { font-size: 17px; font-weight: 700; color: var(--text); }
.empty-sub { font-size: 14px; color: var(--text-muted); }
.loader-wrap { display: flex; justify-content: center; padding: 60px; }
.spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.timeline { padding: 6px 14px 20px; }
.year-divider { display: flex; align-items: center; gap: 10px; margin: 16px 0 8px; padding-left: 4px; }
.year-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.year-text { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.timeline-row { display: grid; grid-template-columns: 34px 22px 1fr; align-items: stretch; margin-bottom: 10px; }
.date-stamp { display: flex; flex-direction: column; align-items: center; padding-top: 12px; }
.stamp-day { font-size: 17px; font-weight: 800; color: var(--text); line-height: 1; }
.stamp-month { font-size: 9px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
.stamp-weekday { font-size: 9px; color: var(--text-muted); text-transform: capitalize; margin-top: 0; }
.spine { display: flex; flex-direction: column; align-items: center; padding-top: 12px; padding-bottom: 5%; }
.spine-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 2px var(--bg), 0 0 0 3px var(--accent); flex-shrink: 0; z-index: 1; }
.spine-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--accent) 0%, var(--border) 100%); margin-top: 6px; opacity: 0.4; }
.day-content { display: flex; flex-direction: column; min-width: 0; }
.day-header-card { display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 0 2px 0 10px; margin-bottom: 4px; }
.card-date-full { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: capitalize; flex: 1; }
.topbar-delete { color: var(--text-muted); opacity: 0.5; display: flex; align-items: center; justify-content: center; min-width: 30px; min-height: 30px; border-radius: 8px; transition: opacity 0.15s, color 0.15s, background 0.15s; flex-shrink: 0; }
.topbar-delete:hover { opacity: 1; color: #e05555; background: rgba(224,85,85,0.08); }
.sub-cards-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px; }
.sub-cards-col { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }
.mini-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; animation: fadeSlideIn 0.22s ease; transition: box-shadow 0.18s; }
.mini-card:hover { box-shadow: 0 3px 14px rgba(0,0,0,0.06); }
@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.mini-del { display: flex; align-items: center; justify-content: center; min-width: 28px; min-height: 28px; border-radius: 8px; color: var(--text-muted); opacity: 0.45; flex-shrink: 0; transition: opacity 0.15s, color 0.15s, background 0.15s; }
.mini-del:hover { opacity: 1; color: #e05555; background: rgba(224,85,85,0.09); }
.date-mini-card { display: flex; align-items: center; gap: 5px; padding: 5px 2px 5px 8px; }
.chip-icon { font-size: 14px; flex-shrink: 0; }
.chip-body { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.chip-name { font-size: 11px; font-weight: 700; color: var(--text); line-height: 1.2; }
.chip-sub { font-size: 9px; color: var(--text-muted); }
.chip-tag { font-size: 9px; color: var(--accent); font-weight: 700; white-space: nowrap; }
.content-mini-card { display: flex; align-items: center; gap: 6px; padding: 5px 2px 5px 8px; }
.ctype {
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 7px;
  letter-spacing: 1px;
  flex-shrink: 0;
  color: var(--ctype-text, #000);
  background: var(--ctype-bg, #eee);
}
.ctype.anime   { --ctype-bg: var(--anime-bg, #d0e7ff);   --ctype-text: var(--anime-text, #1a73e8); }
.ctype.hentai  { --ctype-bg: var(--hentai-bg, #f4d0e0);  --ctype-text: var(--hentai-text, #c2185b); }
.ctype.cartoon { --ctype-bg: var(--cartoon-bg, #f4d0e0); --ctype-text: var(--cartoon-text, #c2185b); }
.ctype.series  { --ctype-bg: var(--series-bg, #dff0d8);  --ctype-text: var(--series-text, #2e7d32); }
.ctype.film    { --ctype-bg: var(--film-bg, #fff3e0);    --ctype-text: var(--film-text, #e65100); }
.content-name { font-size: 12px; font-weight: 500; color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.content-meta { font-size: 10px; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
.post-mini-card { padding: 7px 2px 7px 10px; }
.bubble-meta { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
.bubble-vis  { font-size: 13px; }
.bubble-time { font-size: 10px; color: var(--text-muted); flex: 1; }
.bubble-text { font-size: 12px; line-height: 1.6; color: var(--text); white-space: pre-wrap; margin: 0; padding-right: 6px; }
.bubble-text :deep(mark) { background: var(--accent-light); color: var(--accent); border-radius: 3px; padding: 0 2px; font-weight: 600; }
.bubble-media { display: grid; gap: 2px; margin-top: 6px; margin-right: 6px; border-radius: 8px; overflow: hidden; }
.bubble-media.cols-1 { grid-template-columns: 1fr; }
.bubble-media.cols-2 { grid-template-columns: 1fr 1fr; }
.bubble-media.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.media-cell { aspect-ratio: 1; overflow: hidden; cursor: pointer; background: var(--bg); position: relative; }
.media-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
.media-cell:hover img { transform: scale(1.06); }
.media-video-wrap { width: 100%; height: 100%; position: relative; }
.media-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); color: white; }
.card-actions { display: flex; gap: 4px; padding: 2px 0 6px; }
.card-action-btn { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 4px 10px; transition: color 0.15s, background 0.15s, border-color 0.15s; }
.card-action-btn:hover { color: var(--accent); background: var(--accent-light); border-color: transparent; }
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.94); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 20px; }
.lightbox img, .lightbox video { max-width: 100%; max-height: 90vh; border-radius: 14px; object-fit: contain; }
.lightbox-x { position: absolute; top: 16px; right: 16px; color: white; background: rgba(255,255,255,0.12); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.lightbox-x:hover { background: rgba(255,255,255,0.22); }
.btn-accent { background: var(--accent); color: white; border-radius: 14px; padding: 14px 22px; font-size: 15px; font-weight: 700; transition: background 0.2s, transform 0.15s; }
.btn-accent:hover:not(:disabled) { background: var(--accent-hover, var(--accent)); }

/* noinspection CssUnusedSymbol */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }

/* noinspection CssUnusedSymbol */
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>