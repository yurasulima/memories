<template>
  <div class="day-view">
    <header class="day-header">
      <button class="back-btn" @click="router.back()">
        <IconChevron direction="left" :size="22" />
      </button>
      <div class="day-title">
        <span class="day-date-label" v-if="day">{{ formatDate(day.date) }}</span>
      </div>
    </header>

    <div v-if="loading" class="loader-wrap">
      <div class="loader"></div>
    </div>

    <div v-else-if="day" class="day-content">
      <section v-if="day.dates?.length || showAddDate" class="section">
        <div class="section-header">
          <h2>Дати</h2>
          <button class="add-btn" @click="showAddDate = !showAddDate">
            <IconPlus :size="16" />
          </button>
        </div>
        <div class="dates-list">
          <div v-for="d in day.dates" :key="d.id" class="date-item">
            <div class="date-info">
              <span class="date-name">{{ d.name }}</span>
              <span class="date-desc">{{ d.description }}</span>
              <span class="date-once">{{ d.once ? 'Одноразова' : 'Щорічна' }}</span>
            </div>
            <button class="icon-btn" @click="deleteDate(d.id)">
              <IconTrash :size="15" />
            </button>
          </div>
        </div>
        <div v-if="showAddDate" class="add-form">
          <input v-model="newDate.name" class="input" placeholder="Назва дати" />
          <input v-model="newDate.description" class="input" placeholder="Опис" />
          <label class="checkbox-label">
            <input type="checkbox" v-model="newDate.once" />
            Одноразова
          </label>
          <button class="btn-accent-sm" @click="addDate" :disabled="!newDate.name">Додати</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2>Контент</h2>
          <button class="add-btn" @click="showAddContent = !showAddContent">
            <IconPlus :size="16" />
          </button>
        </div>
        <div v-if="day.contents?.length" class="content-list">
          <div v-for="c in day.contents" :key="c.id" class="content-item">
            <div class="content-type-badge">{{ contentLabel(c.type) }}</div>
            <div class="content-info">
              <span class="content-name">{{ c.name }}</span>
              <span v-if="c.watchedSeries" class="content-meta">Серія {{ c.watchedSeries }}<span v-if="c.season"> • Сезон {{ c.season }}</span></span>
            </div>
            <button class="icon-btn" @click="deleteContent(c.id)">
              <IconTrash :size="15" />
            </button>
          </div>
        </div>
        <div v-if="showAddContent" class="add-form">
          <select v-model="newContent.type" class="input">
            <option value="ANIME">Аніме</option>
            <option value="HENTAI">Хентай</option>
            <option value="SERIES">Серіал</option>
            <option value="FILM">Фільм</option>
          </select>
          <input v-model="newContent.name" class="input" placeholder="Назва" />
          <div class="row-inputs">
            <input v-model.number="newContent.watchedSeries" class="input" type="number" placeholder="Серія" />
            <input v-model.number="newContent.season" class="input" type="number" placeholder="Сезон" />
          </div>
          <button class="btn-accent-sm" @click="addContent" :disabled="!newContent.name">Додати</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2>Пости</h2>
          <button class="add-btn" @click="showAddPost = !showAddPost">
            <IconPlus :size="16" />
          </button>
        </div>

        <div v-if="showAddPost" class="post-form">
          <textarea v-model="newPost.text" class="textarea" placeholder="Що сталось цього дня..." rows="3"></textarea>

          <div class="media-section">
            <input
              ref="fileInput"
              type="file"
              accept="image/*,video/*"
              multiple
              class="hidden"
              @change="onFilesSelected"
            />
            <button class="media-btn" @click="fileInput.click()">
              <IconImage :size="18" />
              <span>Додати фото/відео</span>
            </button>
            <div v-if="pendingFiles.length" class="media-preview">
              <div v-for="(pf, i) in pendingFiles" :key="i" class="media-thumb">
                <img v-if="pf.preview" :src="pf.preview" alt="" />
                <div v-else class="video-thumb">
                  <IconFilm :size="20" />
                </div>
                <button class="remove-media" @click="removePendingFile(i)">
                  <IconClose :size="12" :strokeWidth="2.5" />
                </button>
                <div v-if="pf.uploading" class="upload-overlay">
                  <div class="loader-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="post-form-row">
            <select v-model="newPost.visibility" class="input input-sm">
              <option value="GROUP">Група</option>
              <option value="PRIVATE">Приватний</option>
            </select>
            <button class="btn-accent-sm" @click="addPost" :disabled="!newPost.text || postLoading">
              {{ postLoading ? '...' : 'Опублікувати' }}
            </button>
          </div>
        </div>

        <div class="posts-list">
          <div v-for="post in day.posts" :key="post.id" class="post-card">
            <div class="post-header">
              <div class="visibility-badge">
                <IconEye v-if="post.visibility === 'GROUP'" :size="12" />
                <IconLock v-else :size="12" />
                <span>{{ post.visibility === 'GROUP' ? 'Група' : 'Приватний' }}</span>
              </div>
              <span class="post-time">{{ formatTime(post.createAt) }}</span>
              <button class="icon-btn" @click="deletePost(post.id)">
                <IconTrash :size="15" />
              </button>
            </div>
            <p class="post-text">{{ post.text }}</p>
            <div v-if="post.media?.length" class="post-media">
              <div
                v-for="m in post.media"
                :key="m.id"
                class="post-media-item"
                @click="openMedia(m)"
              >
                <img v-if="m.type?.startsWith('image')" :src="m.url" alt="" loading="lazy" />
                <div v-else class="video-preview">
                  <video :src="m.url" />
                  <div class="play-icon">
                    <IconFilm :size="20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <transition name="fade">
      <div v-if="lightboxMedia" class="lightbox" @click="lightboxMedia = null">
        <img v-if="lightboxMedia.type?.startsWith('image')" :src="lightboxMedia.url" alt="" />
        <video v-else :src="lightboxMedia.url" controls autoplay />
        <button class="lightbox-close" @click="lightboxMedia = null">
          <IconClose :size="24" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { memoriesApi } from '../api/memories.js'
import IconChevron from '../components/icons/IconChevron.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconTrash from '../components/icons/IconTrash.vue'
import IconImage from '../components/icons/IconImage.vue'
import IconFilm from '../components/icons/IconFilm.vue'
import IconClose from '../components/icons/IconClose.vue'
import IconEye from '../components/icons/IconEye.vue'
import IconLock from '../components/icons/IconLock.vue'

const route = useRoute()
const router = useRouter()

const day = ref(null)
const loading = ref(true)
const showAddPost = ref(false)
const showAddContent = ref(false)
const showAddDate = ref(false)
const postLoading = ref(false)
const lightboxMedia = ref(null)
const fileInput = ref(null)

const pendingFiles = ref([])

const newPost = ref({ text: '', visibility: 'GROUP' })
const newContent = ref({ type: 'ANIME', name: '', watchedSeries: null, season: null })
const newDate = ref({ name: '', description: '', once: false })

onMounted(async () => {
  try {
    day.value = await memoriesApi.getDayById(route.params.id)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

const contentLabel = (type) => {
  const map = { ANIME: 'Аніме', HENTAI: 'Хентай', SERIES: 'Серіал', FILM: 'Фільм' }
  return map[type] || type
}

const onFilesSelected = async (e) => {
  const files = Array.from(e.target.files)
  for (const file of files) {
    const entry = {
      file,
      preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null,
      uploading: true,
      mediaId: null
    }
    pendingFiles.value.push(entry)
    try {
      const uploaded = await memoriesApi.uploadMedia(file)
      entry.mediaId = uploaded.id
    } finally {
      entry.uploading = false
    }
  }
}

const removePendingFile = (i) => {
  pendingFiles.value.splice(i, 1)
}

const addPost = async () => {
  if (!newPost.value.text || postLoading.value) return
  postLoading.value = true
  try {
    const mediaIds = pendingFiles.value.filter(f => f.mediaId).map(f => f.mediaId)
    const post = await memoriesApi.addPost({
      dayId: day.value.id,
      text: newPost.value.text,
      visibility: newPost.value.visibility,
      mediaIds
    })
    day.value.posts.unshift(post)
    newPost.value = { text: '', visibility: 'GROUP' }
    pendingFiles.value = []
    showAddPost.value = false
  } finally {
    postLoading.value = false
  }
}

const deletePost = async (id) => {
  await memoriesApi.deletePost(id)
  day.value.posts = day.value.posts.filter(p => p.id !== id)
}

const addContent = async () => {
  if (!newContent.value.name) return
  const content = await memoriesApi.addContent({
    dayId: day.value.id,
    ...newContent.value
  })
  day.value.contents.push(content)
  newContent.value = { type: 'ANIME', name: '', watchedSeries: null, season: null }
  showAddContent.value = false
}

const deleteContent = async (id) => {
  await memoriesApi.deleteContent(id)
  day.value.contents = day.value.contents.filter(c => c.id !== id)
}

const addDate = async () => {
  if (!newDate.value.name) return
  const d = await memoriesApi.addDate({ dayId: day.value.id, ...newDate.value })
  day.value.dates.push(d)
  newDate.value = { name: '', description: '', once: false }
  showAddDate.value = false
}

const deleteDate = async (id) => {
  await memoriesApi.deleteDate(id)
  day.value.dates = day.value.dates.filter(d => d.id !== id)
}

const openMedia = (m) => {
  lightboxMedia.value = m
}
</script>

<style scoped>
.day-view {
  padding-bottom: 20px;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  border-bottom: 1px solid var(--border);
}

.back-btn {
  color: var(--text);
  display: flex;
  align-items: center;
  padding: 4px;
}

.day-date-label {
  font-size: 15px;
  font-weight: 600;
  text-transform: capitalize;
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

.day-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.section-header h2 {
  font-size: 15px;
  font-weight: 700;
}

.add-btn {
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dates-list, .content-list, .posts-list {
  padding: 8px 0;
}

.date-item, .content-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
}

.date-item:last-child, .content-item:last-child {
  border-bottom: none;
}

.date-info, .content-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-name, .content-name {
  font-size: 14px;
  font-weight: 600;
}

.date-desc, .content-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.date-once {
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

.content-type-badge {
  font-size: 11px;
  font-weight: 600;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 8px;
  padding: 3px 8px;
  white-space: nowrap;
}

.icon-btn {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #e05555;
}

.add-form {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

.input {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 14px;
  color: var(--text);
  width: 100%;
}

.input:focus {
  border-color: var(--accent);
}

.input-sm {
  padding: 8px 10px;
  font-size: 13px;
}

.row-inputs {
  display: flex;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
}

.btn-accent-sm {
  background: var(--accent);
  color: white;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  align-self: flex-end;
  transition: background 0.2s, opacity 0.2s;
}

.btn-accent-sm:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-accent-sm:disabled {
  opacity: 0.5;
}

.post-form {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.textarea {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  color: var(--text);
  width: 100%;
  resize: none;
  line-height: 1.5;
}

.textarea:focus {
  border-color: var(--accent);
}

.media-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.media-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  background: var(--accent-light);
  border-radius: 10px;
  align-self: flex-start;
}

.hidden {
  display: none;
}

.media-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumb {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.remove-media {
  position: absolute;
  top: 3px;
  right: 3px;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-sm {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.post-form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.post-card {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.post-card:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.visibility-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 2px 6px;
}

.post-time {
  font-size: 12px;
  color: var(--text-muted);
  flex: 1;
}

.post-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.post-media {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  border-radius: 10px;
  overflow: hidden;
}

.post-media-item {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: var(--bg-secondary);
}

.post-media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.post-media-item:hover img {
  transform: scale(1.04);
}

.video-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  color: white;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}

.lightbox img, .lightbox video {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 12px;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
