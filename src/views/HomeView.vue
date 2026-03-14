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

    <!-- NO GROUP -->
    <div v-if="!groupsStore.currentGroup && !groupsStore.loading" class="empty-state">
      <div class="empty-icon">💝</div>
      <p class="empty-title">Ще немає групи</p>
      <button class="btn-accent" @click="showCreateGroup = true">Створити групу</button>
    </div>

    <div v-else>
      <!-- FAB: new day -->
      <button class="fab" @click="showCreateDay = true" title="Новий день">
        <IconPlus :size="22" />
      </button>

      <!-- LOADER -->
      <div v-if="loading && days.length === 0" class="loader-wrap">
        <div class="spinner"></div>
      </div>

      <!-- EMPTY DAYS -->
      <div v-else-if="days.length === 0" class="empty-state">
        <div class="empty-icon">📖</div>
        <p class="empty-title">Поки немає спогадів</p>
        <p class="empty-sub">Натисни + щоб додати перший день</p>
      </div>

      <!-- TIMELINE -->
      <div v-else class="timeline">

        <template v-for="(day, index) in days" :key="day.id">

          <!-- Year divider -->
          <div v-if="isNewYear(day, index)" class="year-divider">
            <span class="year-text">{{ getYear(day.date) }}</span>
          </div>

          <div class="timeline-row">
            <!-- Date stamp -->
            <div class="date-stamp">
              <span class="stamp-day">{{ getDay(day.date) }}</span>
              <span class="stamp-month">{{ getMonth(day.date) }}</span>
              <span class="stamp-weekday">{{ getWeekday(day.date) }}</span>
            </div>

            <!-- Spine -->
            <div class="spine">
              <div class="spine-dot"></div>
              <div class="spine-line"></div>
            </div>

            <!-- DAY CARD -->
            <div class="day-card">

              <!-- Card top bar -->
              <div class="card-topbar">
                <span class="card-date-full">{{ formatDateFull(day.date) }}</span>
                <button class="topbar-delete" @click="confirmDeleteDay(day.id)">
                  <IconClose :size="13" />
                </button>
              </div>

              <!-- DATES chip row -->
              <div v-if="day.dates?.length" class="chip-row">
                <div v-for="d in day.dates" :key="d.id" class="date-chip">
                  <span class="chip-icon">📅</span>
                  <div class="chip-body">
                    <span class="chip-name">{{ d.name }}</span>
                    <span v-if="d.description" class="chip-sub">{{ d.description }}</span>
                  </div>
                  <span class="chip-tag">{{ d.once ? 'раз' : '∞' }}</span>
                  <button class="chip-del" @click="deleteDate(day, d.id)"><IconClose :size="10" /></button>
                </div>
              </div>

              <!-- CONTENT list -->
              <div v-if="day.contents?.length" class="content-list">
                <div v-for="c in day.contents" :key="c.id" class="content-row">
                  <span :class="['ctype', ctypeClass(c.type)]">{{ contentLabel(c.type) }}</span>
                  <span class="content-name">{{ c.name }}</span>
                  <span v-if="c.watchedSeries" class="content-meta">ep.{{ c.watchedSeries }}<span v-if="c.season"> s{{ c.season }}</span></span>
                  <button class="row-del" @click="deleteContent(day, c.id)"><IconClose :size="10" /></button>
                </div>
              </div>

              <!-- POSTS -->
              <div class="posts-area">
                <div v-for="post in day.posts" :key="post.id" class="post-bubble">
                  <div class="bubble-meta">
                    <span class="bubble-vis">{{ post.visibility === 'GROUP' ? '👥' : '🔒' }}</span>
                    <span class="bubble-time">{{ formatTime(post.createAt) }}</span>
                    <button class="row-del" @click="deletePost(day, post.id)"><IconClose :size="10" /></button>
                  </div>
                  <p class="bubble-text">{{ post.text }}</p>
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

                <!-- Add post FAB on card -->
                <button class="card-plus" @click="openAddPost(day)" title="Новий пост">
                  <IconPlus :size="16" />
                </button>
              </div>

              <!-- Card action bar -->
              <div class="card-actions">
                <button class="card-action-btn" @click="openAddDate(day)">
                  <IconPlus :size="13" /><span>Дата</span>
                </button>
                <button class="card-action-btn" @click="openAddContent(day)">
                  <IconPlus :size="13" /><span>Контент</span>
                </button>
              </div>

            </div>
          </div>
        </template>

        <div v-if="hasMore" class="load-more-wrap">
          <button class="load-more-btn" @click="loadMore" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            <span v-else>Завантажити ще</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ DIALOGS ═══════════════ -->

    <!-- Add post dialog -->
    <teleport to="body">
      <transition name="sheet">
        <div v-if="activeDialog === 'post'" class="sheet-overlay" @click.self="closeDialog">
          <div class="sheet">
            <div class="sheet-handle"></div>
            <div class="sheet-header">
              <span>Новий пост</span>
              <button class="sheet-close" @click="closeDialog"><IconClose :size="18" /></button>
            </div>
            <div class="sheet-body">
              <textarea
                  v-model="dialogForms.post.text"
                  class="sheet-textarea"
                  placeholder="Що сталось цього дня..."
                  rows="4"
                  autofocus
              ></textarea>

              <input
                  ref="fileInput"
                  type="file" accept="image/*,video/*" multiple class="hidden"
                  @change="onFilesSelected"
              />

              <div v-if="dialogPendingFiles.length" class="pending-grid">
                <div v-for="(pf, i) in dialogPendingFiles" :key="i" class="pending-thumb">
                  <img v-if="pf.preview" :src="pf.preview" alt="" />
                  <div v-else class="thumb-video"><IconFilm :size="20" /></div>
                  <button class="thumb-remove" @click="removePendingFile(i)"><IconClose :size="11" /></button>
                  <div v-if="pf.uploading" class="thumb-uploading"><div class="spinner-sm"></div></div>
                </div>
              </div>

              <div class="sheet-row">
                <button class="sheet-media-btn" @click="$refs.fileInput.click()">
                  <IconImage :size="16" /><span>Медіа</span>
                </button>
                <select v-model="dialogForms.post.visibility" class="sheet-select">
                  <option value="GROUP">👥 Група</option>
                  <option value="PRIVATE">🔒 Приватний</option>
                </select>
              </div>
            </div>
            <div class="sheet-footer">
              <button class="btn-accent full" @click="submitPost" :disabled="!dialogForms.post.text || dialogLoading">
                <span v-if="dialogLoading" class="spinner-sm white"></span>
                <span v-else>Опублікувати</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Add content dialog -->
    <teleport to="body">
      <transition name="sheet">
        <div v-if="activeDialog === 'content'" class="sheet-overlay" @click.self="closeDialog">
          <div class="sheet">
            <div class="sheet-handle"></div>
            <div class="sheet-header">
              <span>Додати контент</span>
              <button class="sheet-close" @click="closeDialog"><IconClose :size="18" /></button>
            </div>
            <div class="sheet-body">
              <div class="type-tabs">
                <button
                    v-for="t in contentTypes" :key="t.value"
                    :class="['type-tab', { active: dialogForms.content.type === t.value }]"
                    @click="dialogForms.content.type = t.value"
                >{{ t.label }}</button>
              </div>
              <input v-model="dialogForms.content.name" class="sheet-input" placeholder="Назва" />
              <div class="sheet-row-2">
                <input v-model.number="dialogForms.content.watchedSeries" class="sheet-input" type="number" placeholder="Серія" />
                <input v-model.number="dialogForms.content.season" class="sheet-input" type="number" placeholder="Сезон" />
              </div>
            </div>
            <div class="sheet-footer">
              <button class="btn-accent full" @click="submitContent" :disabled="!dialogForms.content.name || dialogLoading">
                <span v-if="dialogLoading" class="spinner-sm white"></span>
                <span v-else>Додати</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Add date dialog -->
    <teleport to="body">
      <transition name="sheet">
        <div v-if="activeDialog === 'date'" class="sheet-overlay" @click.self="closeDialog">
          <div class="sheet">
            <div class="sheet-handle"></div>
            <div class="sheet-header">
              <span>Нова дата</span>
              <button class="sheet-close" @click="closeDialog"><IconClose :size="18" /></button>
            </div>
            <div class="sheet-body">
              <input v-model="dialogForms.date.name" class="sheet-input" placeholder="Назва дати" />
              <input v-model="dialogForms.date.description" class="sheet-input" placeholder="Опис (необов'язково)" />
              <label class="toggle-label">
                <div class="toggle-track" :class="{ on: dialogForms.date.once }" @click="dialogForms.date.once = !dialogForms.date.once">
                  <div class="toggle-thumb"></div>
                </div>
                <span>Одноразова подія</span>
              </label>
            </div>
            <div class="sheet-footer">
              <button class="btn-accent full" @click="submitDate" :disabled="!dialogForms.date.name || dialogLoading">
                <span v-if="dialogLoading" class="spinner-sm white"></span>
                <span v-else>Зберегти</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- New day dialog -->
    <teleport to="body">
      <transition name="sheet">
        <div v-if="showCreateDay" class="sheet-overlay" @click.self="showCreateDay = false">
          <div class="sheet">
            <div class="sheet-handle"></div>
            <div class="sheet-header">
              <span>Новий день</span>
              <button class="sheet-close" @click="showCreateDay = false"><IconClose :size="18" /></button>
            </div>
            <div class="sheet-body">
              <input v-model="newDayDate" type="date" class="sheet-input" />
            </div>
            <div class="sheet-footer">
              <button class="btn-accent full" @click="createDay" :disabled="!newDayDate || createLoading">
                <span v-if="createLoading" class="spinner-sm white"></span>
                <span v-else>Створити</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- New group dialog -->
    <teleport to="body">
      <transition name="sheet">
        <div v-if="showCreateGroup" class="sheet-overlay" @click.self="showCreateGroup = false">
          <div class="sheet">
            <div class="sheet-handle"></div>
            <div class="sheet-header">
              <span>Нова група</span>
              <button class="sheet-close" @click="showCreateGroup = false"><IconClose :size="18" /></button>
            </div>
            <div class="sheet-body">
              <input v-model="newGroupName" class="sheet-input" placeholder="Назва групи" />
              <div class="search-wrap">
                <input v-model="userQuery" class="sheet-input" placeholder="Знайти партнера..." @input="onUserSearch" />
                <transition name="fade">
                  <div v-if="userResults.length" class="search-drop">
                    <button v-for="u in userResults" :key="u.id" class="search-item" @click="selectPartner(u)">
                      <div class="avatar">{{ u.fullName?.charAt(0) || u.username?.charAt(0) }}</div>
                      <div>
                        <div class="search-name">{{ u.fullName }}</div>
                        <div class="search-sub">@{{ u.username }}</div>
                      </div>
                    </button>
                  </div>
                </transition>
              </div>
              <div v-if="selectedPartner" class="selected-pill">
                <div class="avatar sm">{{ selectedPartner.fullName?.charAt(0) }}</div>
                <span>{{ selectedPartner.fullName }}</span>
                <button @click="selectedPartner = null; userQuery = ''"><IconClose :size="13" /></button>
              </div>
            </div>
            <div class="sheet-footer">
              <button class="btn-accent full" @click="createGroup" :disabled="!newGroupName || !selectedPartner || createLoading">
                <span v-if="createLoading" class="spinner-sm white"></span>
                <span v-else>Створити</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Delete confirm -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="confirmDayId" class="confirm-overlay" @click.self="confirmDayId = null">
          <div class="confirm-box">
            <p class="confirm-text">Видалити цей день?</p>
            <div class="confirm-row">
              <button class="confirm-cancel" @click="confirmDayId = null">Скасувати</button>
              <button class="confirm-delete" @click="deleteDay(confirmDayId)">Видалити</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

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

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useGroupsStore } from '../stores/group.js'
import { memoriesApi } from '../api/memories.js'
import { groupsApi } from '../api/group.js'
import IconHeart from '../components/icons/IconHeart.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconClose from '../components/icons/IconClose.vue'
import IconCalendar from '../components/icons/IconCalendar.vue'
import IconTrash from '../components/icons/IconTrash.vue'
import IconImage from '../components/icons/IconImage.vue'
import IconFilm from '../components/icons/IconFilm.vue'
import IconEye from '../components/icons/IconEye.vue'
import IconLock from '../components/icons/IconLock.vue'

const groupsStore = useGroupsStore()

const days = ref([])
const loading = ref(false)
const page = ref(0)
const hasMore = ref(true)
const showCreateDay = ref(false)
const showCreateGroup = ref(false)
const newDayDate = ref(new Date().toISOString().split('T')[0])
const newGroupName = ref('')
const createLoading = ref(false)
const selectedGroupId = ref(null)
const lightboxMedia = ref(null)
const confirmDayId = ref(null)

const userQuery = ref('')
const userResults = ref([])
const selectedPartner = ref(null)
let searchTimeout = null

// Dialog state
const activeDialog = ref(null) // 'post' | 'content' | 'date'
const dialogTargetDay = ref(null)
const dialogLoading = ref(false)
const fileInput = ref(null)
const dialogPendingFiles = ref([])

const dialogForms = reactive({
  post: { text: '', visibility: 'GROUP' },
  content: { type: 'ANIME', name: '', watchedSeries: null, season: null },
  date: { name: '', description: '', once: false }
})

const contentTypes = [
  { value: 'ANIME', label: 'Аніме' },
  { value: 'HENTAI', label: 'Хентай' },
  { value: 'SERIES', label: 'Серіал' },
  { value: 'FILM', label: 'Фільм' }
]

const openAddPost = (day) => {
  dialogTargetDay.value = day
  dialogForms.post = { text: '', visibility: 'GROUP' }
  dialogPendingFiles.value = []
  activeDialog.value = 'post'
}

const openAddContent = (day) => {
  dialogTargetDay.value = day
  dialogForms.content = { type: 'ANIME', name: '', watchedSeries: null, season: null }
  activeDialog.value = 'content'
}

const openAddDate = (day) => {
  dialogTargetDay.value = day
  dialogForms.date = { name: '', description: '', once: false }
  activeDialog.value = 'date'
}

const closeDialog = () => { activeDialog.value = null; dialogTargetDay.value = null }

// File handling for dialog
const onFilesSelected = async (e) => {
  for (const file of Array.from(e.target.files)) {
    const entry = { file, preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null, uploading: true, mediaId: null }
    dialogPendingFiles.value.push(entry)
    try { const u = await memoriesApi.uploadMedia(file); entry.mediaId = u.id }
    finally { entry.uploading = false }
  }
}
const removePendingFile = (i) => dialogPendingFiles.value.splice(i, 1)

// Submit handlers
const submitPost = async () => {
  const day = dialogTargetDay.value
  if (!dialogForms.post.text || !day) return
  dialogLoading.value = true
  try {
    const mediaIds = dialogPendingFiles.value.filter(f => f.mediaId).map(f => f.mediaId)
    const post = await memoriesApi.addPost({ dayId: day.id, text: dialogForms.post.text, visibility: dialogForms.post.visibility, mediaIds })
    if (!day.posts) day.posts = []
    day.posts.unshift(post)
    closeDialog()
  } finally { dialogLoading.value = false }
}

const submitContent = async () => {
  const day = dialogTargetDay.value
  if (!dialogForms.content.name || !day) return
  dialogLoading.value = true
  try {
    const c = await memoriesApi.addContent({ dayId: day.id, ...dialogForms.content })
    if (!day.contents) day.contents = []
    day.contents.push(c)
    closeDialog()
  } finally { dialogLoading.value = false }
}

const submitDate = async () => {
  const day = dialogTargetDay.value
  if (!dialogForms.date.name || !day) return
  dialogLoading.value = true
  try {
    const d = await memoriesApi.addDate({ dayId: day.id, ...dialogForms.date })
    if (!day.dates) day.dates = []
    day.dates.push(d)
    closeDialog()
  } finally { dialogLoading.value = false }
}

// Day CRUD
const confirmDeleteDay = (id) => { confirmDayId.value = id }
const deleteDay = async (id) => {
  await memoriesApi.deleteDay(id)
  days.value = days.value.filter(d => d.id !== id)
  confirmDayId.value = null
}

const deleteDate = async (day, id) => {
  await memoriesApi.deleteDate(id)
  day.dates = day.dates.filter(d => d.id !== id)
}
const deleteContent = async (day, id) => {
  await memoriesApi.deleteContent(id)
  day.contents = day.contents.filter(c => c.id !== id)
}
const deletePost = async (day, id) => {
  await memoriesApi.deletePost(id)
  day.posts = day.posts.filter(p => p.id !== id)
}

// Load
onMounted(async () => {
  await groupsStore.fetchMyGroups()
  if (groupsStore.currentGroup) {
    selectedGroupId.value = groupsStore.currentGroup.id
    await loadDays()
  }
})

watch(() => groupsStore.currentGroup, async (g) => {
  if (g) {
    selectedGroupId.value = g.id
    days.value = []; page.value = 0; hasMore.value = true
    await loadDays()
  }
})

const onGroupChange = async () => {
  await groupsStore.fetchGroupById(selectedGroupId.value)
  days.value = []; page.value = 0; hasMore.value = true
  await loadDays()
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

const createDay = async () => {
  if (!newDayDate.value || !groupsStore.currentGroup) return
  createLoading.value = true
  try {
    const created = await memoriesApi.createDay({ groupId: groupsStore.currentGroup.id, date: newDayDate.value })
    const full = await memoriesApi.getDayById(created.id)
    days.value.unshift(full)
    showCreateDay.value = false
  } finally { createLoading.value = false }
}

// Groups
const onUserSearch = () => {
  clearTimeout(searchTimeout)
  if (!userQuery.value.trim() || selectedPartner.value) { userResults.value = []; return }
  searchTimeout = setTimeout(async () => {
    try { userResults.value = await groupsApi.searchUsers(userQuery.value.trim()) }
    catch { userResults.value = [] }
  }, 300)
}
const selectPartner = (u) => { selectedPartner.value = u; userQuery.value = ''; userResults.value = [] }
const createGroup = async () => {
  if (!newGroupName.value || !selectedPartner.value) return
  createLoading.value = true
  try {
    await groupsStore.createGroup({ name: newGroupName.value, memberIds: [selectedPartner.value.id] })
    showCreateGroup.value = false; newGroupName.value = ''; selectedPartner.value = null; userQuery.value = ''
    days.value = []; page.value = 0; await loadDays()
  } finally { createLoading.value = false }
}

// Helpers
const contentLabel = (type) => ({ ANIME: 'Аніме', HENTAI: 'Хентай', SERIES: 'Серіал', FILM: 'Фільм' }[type] || type)
const ctypeClass = (type) => ({ ANIME: 'anime', HENTAI: 'hentai', SERIES: 'series', FILM: 'film' }[type] || '')
const getYear = (d) => new Date(d).getFullYear()
const getDay = (d) => new Date(d).getDate()
const getMonth = (d) => new Date(d).toLocaleDateString('uk-UA', { month: 'short' })
const getWeekday = (d) => new Date(d).toLocaleDateString('uk-UA', { weekday: 'short' })
const formatDateFull = (d) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
const formatTime = (d) => new Date(d).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
const isNewYear = (day, index) => index === 0 || getYear(day.date) !== getYear(days.value[index - 1].date)
</script>

<style scoped>
/* ═══════════════════════════════════════════
   BASE
═══════════════════════════════════════════ */
.home {
  min-height: 100vh;
  padding-bottom: 100px;
}

/* ═══════════════════════════════════════════
   HEADER
═══════════════════════════════════════════ */
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-left { display: flex; align-items: center; gap: 9px; }
.logo-icon { color: var(--accent); }
.home-header h1 {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
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
  max-width: 130px;
  outline: none;
}
.group-name { font-size: 13px; color: var(--text-muted); font-weight: 500; }

/* ═══════════════════════════════════════════
   FAB
═══════════════════════════════════════════ */
.fab {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom));
  right: 20px;
  z-index: 40;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  transition: transform 0.2s, box-shadow 0.2s;
}
.fab:active { transform: scale(0.93); box-shadow: 0 2px 10px rgba(0,0,0,0.15); }

/* ═══════════════════════════════════════════
   EMPTY / LOADER
═══════════════════════════════════════════ */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 80px 20px; text-align: center;
}
.empty-icon { font-size: 48px; line-height: 1; margin-bottom: 4px; }
.empty-title { font-size: 17px; font-weight: 700; color: var(--text); }
.empty-sub { font-size: 14px; color: var(--text-muted); }

.loader-wrap { display: flex; justify-content: center; padding: 60px; }
.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
.spinner-sm {
  width: 16px; height: 16px; display: inline-block;
  border: 2px solid rgba(0,0,0,0.15);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  vertical-align: middle;
}
.spinner-sm.white { border-color: rgba(255,255,255,0.3); border-top-color: white; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════ */
.timeline {
  padding: 8px 16px 20px;
}

.year-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 12px 0;
  padding-left: 4px;
}
.year-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.year-text {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

.timeline-row {
  display: grid;
  grid-template-columns: 38px 28px 1fr;
  align-items: flex-start;
  margin-bottom: 16px;
}

/* Date stamp */
.date-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  gap: 0;
}
.stamp-day {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
}
.stamp-month {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.stamp-weekday {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: capitalize;
  margin-top: 1px;
}

/* Spine */
.spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
}
.spine-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--bg), 0 0 0 4px var(--accent);
  flex-shrink: 0;
  z-index: 1;
}
.spine-line {
  width: 2px;
  flex: 1;
  min-height: 30px;
  background: linear-gradient(to bottom, var(--accent) 0%, var(--border) 100%);
  margin-top: 6px;
  opacity: 0.4;
}

/* ═══════════════════════════════════════════
   DAY CARD
═══════════════════════════════════════════ */
.day-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.day-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}

/* Top bar */
.card-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px 9px;
  border-bottom: 1px solid var(--border);
}
.card-date-full {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: capitalize;
}
.topbar-delete {
  color: var(--text-muted);
  opacity: 0.5;
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
}
.topbar-delete:hover { opacity: 1; color: #e05555; background: rgba(224,85,85,0.08); }

/* Date chips */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 14px 4px;
}
.date-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 10px 4px 6px;
  transition: background 0.15s;
}
.chip-icon { font-size: 13px; }
.chip-body { display: flex; flex-direction: column; }
.chip-name { font-size: 12px; font-weight: 600; color: var(--text); line-height: 1.2; }
.chip-sub { font-size: 10px; color: var(--text-muted); }
.chip-tag { font-size: 10px; color: var(--accent); font-weight: 600; margin-left: 2px; }
.chip-del {
  color: var(--text-muted); display: flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%; transition: color 0.15s, background 0.15s;
  margin-left: 2px;
}
.chip-del:hover { color: #e05555; background: rgba(224,85,85,0.1); }

/* Content rows */
.content-list { padding: 4px 14px 4px; display: flex; flex-direction: column; gap: 4px; }
.content-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-radius: 10px;
  transition: background 0.15s;
}
.ctype {
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 7px;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}
.ctype.anime   { background: #e8f4ff; color: #1a73e8; }
.ctype.hentai  { background: #fde8f5; color: #c2185b; }
.ctype.series  { background: #e8f5e9; color: #2e7d32; }
.ctype.film    { background: #fff3e0; color: #e65100; }

.content-name { font-size: 13px; font-weight: 500; color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.content-meta { font-size: 11px; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
.row-del {
  color: var(--text-muted); opacity: 0.4;
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  transition: opacity 0.15s, color 0.15s; flex-shrink: 0;
}
.row-del:hover { opacity: 1; color: #e05555; }

/* Posts area */
.posts-area {
  padding: 8px 14px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.post-bubble {
  background: var(--bg-secondary);
  border-radius: 14px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  animation: fadeSlideIn 0.25s ease;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.bubble-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.bubble-vis { font-size: 13px; }
.bubble-time { font-size: 11px; color: var(--text-muted); flex: 1; }
.bubble-text { font-size: 13px; line-height: 1.65; color: var(--text); white-space: pre-wrap; margin: 0; }

.bubble-media {
  display: grid;
  gap: 3px;
  margin-top: 8px;
  border-radius: 10px;
  overflow: hidden;
}
.bubble-media.cols-1 { grid-template-columns: 1fr; }
.bubble-media.cols-2 { grid-template-columns: 1fr 1fr; }
.bubble-media.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.media-cell { aspect-ratio: 1; overflow: hidden; cursor: pointer; background: var(--bg); position: relative; }
.media-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
.media-cell:hover img { transform: scale(1.06); }
.media-video-wrap { width: 100%; height: 100%; position: relative; }
.media-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); color: white; }

/* Card plus button */
.card-plus {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  transition: transform 0.2s, background 0.2s;
}
.card-plus:active { transform: scale(0.9); }

/* Card action bar */
.card-actions {
  display: flex;
  gap: 6px;
  padding: 8px 14px 12px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}
.card-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 5px 12px;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.card-action-btn:hover {
  color: var(--accent);
  background: var(--accent-light);
  border-color: transparent;
}

/* ═══════════════════════════════════════════
   BOTTOM SHEET
═══════════════════════════════════════════ */
.sheet-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  backdrop-filter: blur(3px);
  z-index: 200;
}
.sheet {
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  width: 100%;
  max-width: 520px;
  padding: 0 0 calc(20px + env(safe-area-inset-bottom));
  max-height: 90vh;
}
.sheet-handle {
  width: 36px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 12px auto 0;
}
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  font-size: 16px;
  font-weight: 700;
}
.sheet-close {
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--bg-secondary);
  transition: background 0.15s;
}
.sheet-close:hover { background: var(--border); }

.sheet-body {
  padding: 4px 20px 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sheet-textarea {
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 15px;
  color: var(--text);
  width: 100%;
  resize: none;
  line-height: 1.55;
  transition: border-color 0.2s;
  font-family: inherit;
}
.sheet-textarea:focus { border-color: var(--accent); outline: none; }

.sheet-input {
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 15px;
  color: var(--text);
  width: 100%;
  transition: border-color 0.2s;
}
.sheet-input:focus { border-color: var(--accent); outline: none; }

.sheet-select {
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 14px;
  color: var(--text);
  outline: none;
}

.sheet-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.sheet-row-2 { display: flex; gap: 10px; }
.sheet-row-2 .sheet-input { flex: 1; }

.sheet-media-btn {
  display: flex; align-items: center; gap: 6px;
  color: var(--accent); font-size: 13px; font-weight: 600;
  padding: 8px 14px;
  background: var(--accent-light);
  border-radius: 10px;
  transition: opacity 0.2s;
}
.sheet-media-btn:hover { opacity: 0.8; }

.sheet-footer {
  padding: 12px 20px 0;
}
.btn-accent {
  background: var(--accent);
  color: white;
  border-radius: 14px;
  padding: 14px 22px;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.2s, transform 0.15s;
}
.btn-accent:hover:not(:disabled) { background: var(--accent-hover, var(--accent)); }
.btn-accent:active:not(:disabled) { transform: scale(0.98); }
.btn-accent:disabled { opacity: 0.5; }
.btn-accent.full { width: 100%; text-align: center; }

/* Type tabs */
.type-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.type-tab {
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  transition: all 0.15s;
}
.type-tab.active {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
}

/* Toggle */
.toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px 0; }
.toggle-track {
  width: 42px; height: 24px; border-radius: 12px;
  background: var(--border);
  position: relative;
  transition: background 0.2s;
}
.toggle-track.on { background: var(--accent); }
.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: white;
  transition: transform 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle-track.on .toggle-thumb { transform: translateX(18px); }
.toggle-label span { font-size: 14px; color: var(--text); }

/* Pending files */
.pending-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.pending-thumb {
  position: relative; width: 70px; height: 70px;
  border-radius: 12px; overflow: hidden; background: var(--bg-secondary);
}
.pending-thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-video { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.thumb-remove {
  position: absolute; top: 3px; right: 3px;
  background: rgba(0,0,0,0.55); color: white;
  border-radius: 50%; width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
}
.thumb-uploading { position: absolute; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; }

/* Search */
.search-wrap { position: relative; }
.search-drop {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  z-index: 10;
  max-height: 200px; overflow-y: auto;
}
.search-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; width: 100%; text-align: left;
  transition: background 0.15s;
}
.search-item:hover { background: var(--bg-secondary); }
.search-name { font-size: 14px; font-weight: 600; color: var(--text); }
.search-sub { font-size: 12px; color: var(--text-muted); }

.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent-light); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; flex-shrink: 0; text-transform: uppercase;
}
.avatar.sm { width: 28px; height: 28px; font-size: 11px; }

.selected-pill {
  display: flex; align-items: center; gap: 8px;
  background: var(--accent-light); border: 1px solid var(--border);
  border-radius: 20px; padding: 6px 10px 6px 6px;
}
.selected-pill span { font-size: 14px; font-weight: 600; flex: 1; }
.selected-pill button { color: var(--text-muted); display: flex; align-items: center; }

/* Confirm modal */
.confirm-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: 20px;
}
.confirm-box {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px 22px 20px;
  width: 100%; max-width: 300px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}
.confirm-text { font-size: 16px; font-weight: 600; text-align: center; margin-bottom: 20px; color: var(--text); }
.confirm-row { display: flex; gap: 10px; }
.confirm-cancel {
  flex: 1; padding: 12px; border-radius: 12px;
  background: var(--bg-secondary); color: var(--text);
  font-size: 14px; font-weight: 600;
  border: 1px solid var(--border);
}
.confirm-delete {
  flex: 1; padding: 12px; border-radius: 12px;
  background: #e05555; color: white;
  font-size: 14px; font-weight: 600;
}

/* Load more */
.load-more-wrap { display: flex; justify-content: center; padding: 16px 0; }
.load-more-btn {
  display: flex; align-items: center; gap: 8px;
  color: var(--accent); font-size: 14px; font-weight: 600;
  padding: 10px 22px;
  border: 1.5px solid var(--accent);
  border-radius: 20px;
  transition: background 0.15s;
}
.load-more-btn:hover { background: var(--accent-light); }
.load-more-btn:disabled { opacity: 0.5; }

/* Lightbox */
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.94);
  display: flex; align-items: center; justify-content: center;
  z-index: 400; padding: 20px;
}
.lightbox img, .lightbox video {
  max-width: 100%; max-height: 90vh;
  border-radius: 14px; object-fit: contain;
}
.lightbox-x {
  position: absolute; top: 16px; right: 16px;
  color: white; background: rgba(255,255,255,0.12);
  border-radius: 50%; width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.lightbox-x:hover { background: rgba(255,255,255,0.22); }

.hidden { display: none; }

/* ═══════════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════════ */
.sheet-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1);
}
.sheet-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease-in;
}
.sheet-enter-from, .sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet,


.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>