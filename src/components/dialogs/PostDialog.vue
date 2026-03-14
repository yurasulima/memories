<template>
  <teleport to="body">
    <transition name="sheet">
      <div v-if="modelValue" class="sheet-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <span>Новий пост</span>
            <button class="sheet-close" @click="$emit('update:modelValue', false)"><IconClose :size="18" /></button>
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
                type="file" accept="image/*,video/*" multiple class="hidden"
                @change="onFilesSelected"
            />

            <div v-if="pendingFiles.length" class="pending-grid">
              <div v-for="(pf, i) in pendingFiles" :key="i" class="pending-thumb">
                <img v-if="pf.preview" :src="pf.preview" alt="" />
                <div v-else class="thumb-video"><IconFilm :size="20" /></div>
                <button class="thumb-remove" @click="removePendingFile(i)"><IconClose :size="16" /></button>
                <div v-if="pf.uploading" class="thumb-uploading"><div class="spinner-sm"></div></div>
              </div>
            </div>

            <div class="sheet-row">
              <button class="sheet-media-btn" @click="fileInput.click()">
                <IconImage :size="16" /><span>Медіа</span>
              </button>
              <select v-model="form.visibility" class="sheet-select">
                <option value="GROUP">👥 Група</option>
                <option value="PRIVATE">🔒 Приватний</option>
              </select>
            </div>
          </div>
          <div class="sheet-footer">
            <button class="btn-accent full" @click="submit" :disabled="!form.text || loading">
              <span v-if="loading" class="spinner-sm white"></span>
              <span v-else>Опублікувати</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { memoriesApi } from '@/api/memories.js'
import IconClose from '@/components/icons/IconClose.vue'
import IconImage from '@/components/icons/IconImage.vue'
import IconFilm from '@/components/icons/IconFilm.vue'

const props = defineProps({
  modelValue: Boolean,
  day: Object
})
const emit = defineEmits(['update:modelValue', 'posted'])

const form = reactive({ text: '', visibility: 'GROUP' })
const pendingFiles = ref([])
const loading = ref(false)
const fileInput = ref(null)

watch(() => props.modelValue, (val) => {
  if (val) {
    form.text = ''; form.visibility = 'GROUP'
    pendingFiles.value = []
  }
})

const onFilesSelected = async (e) => {
  for (const file of Array.from(e.target.files)) {
    const entry = { file, preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null, uploading: true, mediaId: null }
    pendingFiles.value.push(entry)
    try { const u = await memoriesApi.uploadMedia(file); entry.mediaId = u.id }
    finally { entry.uploading = false }
  }
}
const removePendingFile = (i) => pendingFiles.value.splice(i, 1)

const submit = async () => {
  if (!form.text || !props.day) return
  loading.value = true
  try {
    const mediaIds = pendingFiles.value.filter(f => f.mediaId).map(f => f.mediaId)
    const post = await memoriesApi.addPost({ dayId: props.day.id, text: form.text, visibility: form.visibility, mediaIds })
    emit('posted', post)
    emit('update:modelValue', false)
  } finally { loading.value = false }
}
</script>

<style scoped>
.sheet-overlay {
  position: fixed; inset: 0;
  display: flex; align-items: flex-end; justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 200;
}

/* Sheet uses CSS vars so it respects dark/light theme */
.sheet {

  background: var(--bg-card, #808080);
  border-radius: 28px 28px 0 0;
  width: 100%;
  max-width: 520px;
  padding: 0 0 calc(20px + env(safe-area-inset-bottom));
  max-height: 90vh;
  overflow-y: auto;
  /* Subtle top border so sheet edge is visible in dark mode */
  border-top: 1px solid var(--border);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.25);
}

.sheet-handle {
  width: 36px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 12px auto 0;
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

/* Footer has top separator so button is always visible */
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
.thumb-video { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
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