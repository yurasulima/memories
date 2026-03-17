<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// ─── Swipe to close ──────────────────────────────────────────────────────────
const sheetEl = ref<HTMLElement | null>(null)
let touchStartY = 0
let touchCurrentY = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
  touchCurrentY = touchStartY
  if (sheetEl.value) sheetEl.value.style.transition = 'none'
}

const onTouchMove = (e: TouchEvent) => {
  touchCurrentY = e.touches[0].clientY
  const delta = touchCurrentY - touchStartY
  if (delta > 0 && sheetEl.value) {
    sheetEl.value.style.transform = `translateY(${delta}px)`
  }
}

const onTouchEnd = () => {
  const delta = touchCurrentY - touchStartY
  if (sheetEl.value) {
    sheetEl.value.style.transition = ''
    sheetEl.value.style.transform = ''
  }
  if (delta > 80) {
    emit('update:modelValue', false)
  }
}

import { memoriesApi } from '@/api/memories'
import { uploadApi } from '@/api/upload'
import type { PostMediaRequest, MediaType, PostResponse, DayResponse } from '@/api/models'
import IconClose from '@/components/icons/IconClose.vue'
import IconImage from '@/components/icons/IconImage.vue'
import IconFilm from '@/components/icons/IconFilm.vue'

interface PendingFile {
  file: File
  preview: string | null
  mediaType: MediaType
  uploading: boolean
  error: boolean
  media: PostMediaRequest | null
}

const props = defineProps<{
  modelValue: boolean
  day: DayResponse | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'posted', post: PostResponse): void
}>()

const form = reactive({ text: '', visibility: 'GROUP' as 'GROUP' | 'PRIVATE' })
const pendingFiles = ref<PendingFile[]>([])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (val) => {
  if (val) {
    form.text = ''
    form.visibility = 'GROUP'
    pendingFiles.value = []
  }
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function detectMediaType(file: File): MediaType {
  if (file.type === 'image/gif') return 'GIF'
  if (file.type.startsWith('video/')) return 'VIDEO'
  return 'MEMORIES'
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }) }
    img.onerror = reject
    img.src = url
  })
}

function getVideoDimensions(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({ width: video.videoWidth, height: video.videoHeight, duration: Math.round(video.duration) })
    }
    video.onerror = reject
    video.src = url
  })
}

// ─── Upload flow ─────────────────────────────────────────────────────────────

const onFilesSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return

  for (const file of Array.from(input.files)) {
    const mediaType = detectMediaType(file)
    const preview = mediaType !== 'VIDEO' ? URL.createObjectURL(file) : null

    const entry: PendingFile = { file, preview, mediaType, uploading: true, error: false, media: null }
    pendingFiles.value.push(entry)

    try {
      // 1. Get dimensions/duration from the local file
      let width = 0, height = 0, duration: number | undefined

      if (mediaType === 'VIDEO' || mediaType === 'GIF') {
        const meta = await getVideoDimensions(file)
        width = meta.width; height = meta.height; duration = meta.duration
      } else {
        const meta = await getImageDimensions(file)
        width = meta.width; height = meta.height
      }

      // 2. Upload to get URL
      const { url } = await uploadApi.uploadImage(file, 'memories')

      entry.media = { url, type: mediaType, width, height, ...(duration !== undefined && { duration }) }
    } catch {
      entry.error = true
    } finally {
      entry.uploading = false
    }
  }

  // Reset input so the same file can be re-selected after removal
  input.value = ''
}

const removePendingFile = (i: number) => {
  const entry = pendingFiles.value[i]
  if (entry.preview) URL.revokeObjectURL(entry.preview)
  pendingFiles.value.splice(i, 1)
}

// ─── Submit ──────────────────────────────────────────────────────────────────

const submit = async () => {
  if (!form.text.trim() || !props.day) return
  loading.value = true
  try {
    const media = pendingFiles.value.filter(f => f.media).map(f => f.media!)
    const post = await memoriesApi.addPost({
      dayId: props.day.id,
      text: form.text,
      visibility: form.visibility,
      ...(media.length && { media })
    })
    emit('posted', post)
    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="sheet">
      <div v-if="modelValue" class="sheet-overlay" @click.self="$emit('update:modelValue', false)">
        <div ref="sheetEl" class="sheet">
          <div
              class="sheet-handle"
              @touchstart.passive="onTouchStart"
              @touchmove.passive="onTouchMove"
              @touchend="onTouchEnd"
          ></div>
          <div class="sheet-header">
            <span>Новий пост</span>
            <button class="sheet-close" @click="$emit('update:modelValue', false)">
              <IconClose :size="18" />
            </button>
          </div>

          <div class="sheet-body">
            <textarea
                v-model="form.text"
                class="sheet-textarea"
                placeholder="Що сталось цього дня..."
                rows="4"
                autofocus
            ></textarea>

            <input
                ref="fileInput"
                type="file"
                accept="image/*,video/*"
                multiple
                class="hidden"
                @change="onFilesSelected"
            />

            <div v-if="pendingFiles.length" class="pending-grid">
              <div v-for="(pf, i) in pendingFiles" :key="i" class="pending-thumb">
                <img v-if="pf.preview" :src="pf.preview" alt="" />
                <div v-else class="thumb-video"><IconFilm :size="20" /></div>

                <!-- type badge -->
                <span class="thumb-badge">{{ pf.mediaType }}</span>

                <button class="thumb-remove" @click="removePendingFile(i)">
                  <IconClose :size="16" />
                </button>

                <div v-if="pf.uploading" class="thumb-uploading">
                  <div class="spinner-sm"></div>
                </div>
                <div v-else-if="pf.error" class="thumb-error">!</div>
              </div>
            </div>

            <div class="sheet-row">
              <button class="sheet-media-btn" @click="fileInput?.click()">
                <IconImage :size="16" /><span>Медіа</span>
              </button>
              <select v-model="form.visibility" class="sheet-select">
                <option value="GROUP">👥 Група</option>
                <option value="PRIVATE">🔒 Приватний</option>
              </select>
            </div>
          </div>

          <div class="sheet-footer">
            <button
                class="btn-accent full"
                :disabled="!form.text.trim() || loading || pendingFiles.some(f => f.uploading)"
                @click="submit"
            >
              <span v-if="loading" class="spinner-sm white"></span>
              <span v-else>Опублікувати</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.sheet-overlay {
  position: fixed; inset: 0;
  display: flex; align-items: flex-end; justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 200;
}

.sheet {
  background: var(--bg-card, #808080);
  border-radius: 28px 28px 0 0;
  width: 100%;
  max-width: 520px;
  padding: 0 0 calc(20px + env(safe-area-inset-bottom));
  max-height: 90vh;
  overflow-y: auto;
  border-top: 1px solid var(--border);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.25);
}

.sheet-handle {
  width: 36px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 12px auto 0;
  /* Збільшена область для тачу */
  padding: 10px 24px;
  background-clip: content-box;
  cursor: grab;
  touch-action: none;
}

.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px 12px;
  font-size: 16px; font-weight: 700;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}

.sheet-close {
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-secondary);
  transition: background 0.15s;
}
.sheet-close:hover { background: var(--border); }

.sheet-body {
  padding: 14px 20px 8px;
  display: flex; flex-direction: column; gap: 12px;
}

.sheet-textarea {
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 15px;
  color: var(--text);
  width: 100%; resize: none; line-height: 1.55;
  transition: border-color 0.2s;
  font-family: inherit;
}
.sheet-textarea::placeholder { color: var(--text-muted); }
.sheet-textarea:focus { border-color: var(--accent); outline: none; }

.sheet-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 10px;
}

.sheet-select {
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 14px;
  color: var(--text);
  outline: none;
}

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
  border-top: 1px solid var(--border);
  margin-top: 4px;
}

.btn-accent {
  background: var(--accent);
  color: #fff;
  border-radius: 14px;
  padding: 14px 22px;
  font-size: 15px; font-weight: 700;
  transition: background 0.2s, transform 0.15s;
}
.btn-accent:hover:not(:disabled) { background: var(--accent-hover, var(--accent)); filter: brightness(1.08); }
.btn-accent:active:not(:disabled) { transform: scale(0.98); }
.btn-accent:disabled { opacity: 0.4; }
.btn-accent.full { width: 100%; text-align: center; }

/* Pending media thumbnails */
.pending-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.pending-thumb {
  position: relative; width: 70px; height: 70px;
  border-radius: 12px; overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
}
.pending-thumb img { width: 100%; height: 100%; object-fit: cover; }

.thumb-video {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
}

.thumb-badge {
  position: absolute; bottom: 3px; left: 3px;
  background: rgba(0,0,0,0.6); color: white;
  font-size: 9px; font-weight: 700; letter-spacing: 0.3px;
  padding: 1px 4px; border-radius: 4px;
}

.thumb-remove {
  position: absolute; top: 3px; right: 3px;
  background: rgba(0,0,0,0.6); color: white;
  border-radius: 50%; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
}

.thumb-uploading {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
}

.thumb-error {
  position: absolute; inset: 0;
  background: rgba(200,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 18px;
}

.spinner-sm {
  width: 16px; height: 16px; display: inline-block;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  vertical-align: middle;
}
.spinner-sm.white { border-color: rgba(255,255,255,0.3); border-top-color: white; }
@keyframes spin { to { transform: rotate(360deg); } }

.hidden { display: none; }

.sheet-enter-active { transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); }
.sheet-leave-active { transition: opacity 0.2s ease, transform 0.22s ease-in; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateY(100%); }
</style>