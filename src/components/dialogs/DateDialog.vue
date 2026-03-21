<template>
  <teleport to="body">
    <transition name="sheet">
      <div v-if="modelValue" class="sheet-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <span>{{ $t('dialogs.date.title') }}</span>
            <button class="sheet-close" @click="$emit('update:modelValue', false)"><IconClose :size="18" /></button>
          </div>
          <div class="sheet-body">
            <input v-model="form.name" class="sheet-input" placeholder="Назва дати" />
            <input v-model="form.description" class="sheet-input" placeholder="Опис (необов'язково)" />
            <label class="toggle-label">
              <div class="toggle-track" :class="{ on: form.once }" @click="form.once = !form.once">
                <div class="toggle-thumb"></div>
              </div>
              <span>{{ $t('dialogs.date.oneTime') }}</span>
            </label>
          </div>
          <div class="sheet-footer">
            <button class="btn-accent full" @click="submit" :disabled="!form.name || loading">
              <span v-if="loading" class="spinner-sm white"></span>
              <span v-else>{{ $t('dialogs.date.save') }}</span>
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

const props = defineProps({
  modelValue: Boolean,
  day: Object
})
const emit = defineEmits(['update:modelValue', 'added'])

const form = reactive({ name: '', description: '', once: false })
const loading = ref(false)

watch(() => props.modelValue, (val) => {
  if (val) Object.assign(form, { name: '', description: '', once: false })
})

const submit = async () => {
  if (!form.name || !props.day) return
  loading.value = true
  try {
    const d = await memoriesApi.addDate({ dayId: props.day.id, ...form })
    emit('added', d)
    emit('update:modelValue', false)
  } finally { loading.value = false }
}
</script>

<style scoped>
.sheet-overlay { position: fixed; inset: 0; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(3px); z-index: 200; }
.sheet {

  background: var(--bg-card, #808080);
  border-radius: 28px 28px 0 0; width: 100%; max-width: 520px; padding: 0 0 calc(20px + env(safe-area-inset-bottom)); max-height: 90vh; }
.sheet-handle { width: 36px; height: 4px; background: var(--border); border-radius: 2px; margin: 12px auto 0; }
.sheet-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; font-size: 16px; font-weight: 700; }
.sheet-close { color: var(--text-muted); display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--bg-secondary); transition: background 0.15s; }
.sheet-close:hover { background: var(--border); }
.sheet-body { padding: 4px 20px 8px; display: flex; flex-direction: column; gap: 10px; }
.sheet-footer { padding: 12px 20px 0; }
.sheet-input { background: var(--input-bg); border: 1.5px solid var(--border); border-radius: 12px; padding: 12px 14px; font-size: 15px; color: var(--text); width: 100%; transition: border-color 0.2s; }
.sheet-input:focus { border-color: var(--accent); outline: none; }
.btn-accent { background: var(--accent); color: white; border-radius: 14px; padding: 14px 22px; font-size: 15px; font-weight: 700; transition: background 0.2s, transform 0.15s; }
.btn-accent:hover:not(:disabled) { background: var(--accent-hover, var(--accent)); }
.btn-accent:active:not(:disabled) { transform: scale(0.98); }
.btn-accent:disabled { opacity: 0.5; }
.btn-accent.full { width: 100%; text-align: center; }
.toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px 0; }
.toggle-track { width: 42px; height: 24px; border-radius: 12px; background: var(--border); position: relative; transition: background 0.2s; }
.toggle-track.on { background: var(--accent); }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.toggle-track.on .toggle-thumb { transform: translateX(18px); }
.toggle-label span { font-size: 14px; color: var(--text); }
.spinner-sm { width: 16px; height: 16px; display: inline-block; border: 2px solid rgba(0,0,0,0.15); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.65s linear infinite; vertical-align: middle; }
.spinner-sm.white { border-color: rgba(255,255,255,0.3); border-top-color: white; }
@keyframes spin { to { transform: rotate(360deg); } }
.sheet-enter-active { transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); }
.sheet-leave-active { transition: opacity 0.2s ease, transform 0.22s ease-in; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
</style>
