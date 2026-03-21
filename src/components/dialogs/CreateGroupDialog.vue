<template>
  <teleport to="body">
    <transition name="sheet">
      <div v-if="modelValue" class="sheet-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <span>{{ $t('dialogs.createGroup.title') }}</span>
            <button class="sheet-close" @click="$emit('update:modelValue', false)"><IconClose :size="18" /></button>
          </div>
          <div class="sheet-body">
            <input v-model="groupName" class="sheet-input" :placeholder="$t('dialogs.createGroup.namePlaceholder')" />

            <!-- Partner search -->
            <div class="search-wrap">
              <input
                v-model="userQuery"
                class="sheet-input"
                :placeholder="$t('dialogs.createGroup.partnerPlaceholder')"
                @input="onUserSearch"
              />
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

            <!-- Selected partner pill -->
            <div v-if="selectedPartner" class="selected-pill">
              <div class="avatar sm">{{ selectedPartner.fullName?.charAt(0) }}</div>
              <span>{{ selectedPartner.fullName }}</span>
              <button @click="selectedPartner = null; userQuery = ''"><IconClose :size="13" /></button>
            </div>

            <!-- Solo confirm banner -->
            <transition name="fade">
              <div v-if="showSoloConfirm" class="solo-banner">
                <div class="solo-icon">🤍</div>
                <div class="solo-text">
                  <span class="solo-title">{{ $t('dialogs.createGroup.soloConfirm') }}</span>
                  <span class="solo-desc">{{ $t('dialogs.createGroup.soloDesc') }}</span>
                </div>
              </div>
            </transition>
          </div>

          <div class="sheet-footer">
            <!-- Solo button shown when name filled but no partner -->
            <button
              v-if="showSoloConfirm"
              class="btn-accent full solo-btn"
              @click="submitSolo"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-sm white"></span>
              <span v-else>{{ $t('dialogs.createGroup.soloCreate') }}</span>
            </button>

            <!-- Normal button when partner selected -->
            <button
              v-else
              class="btn-accent full"
              @click="submit"
              :disabled="!groupName || !selectedPartner || loading"
            >
              <span v-if="loading" class="spinner-sm white"></span>
              <span v-else>{{ $t('dialogs.createGroup.create') }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { groupsApi } from '@/api/group.js'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean
})
const emit = defineEmits(['update:modelValue', 'create'])

const groupName = ref('')
const userQuery = ref('')
const userResults = ref([])
const selectedPartner = ref(null)
let searchTimeout = null

// Show solo confirm when name is filled but no partner selected and user hasn't typed in partner field
const showSoloConfirm = computed(() =>
  groupName.value.trim().length > 0 && !selectedPartner.value && userQuery.value.trim().length === 0
)

watch(() => props.modelValue, (val) => {
  if (val) {
    groupName.value = ''
    userQuery.value = ''
    userResults.value = []
    selectedPartner.value = null
  }
})

const onUserSearch = () => {
  clearTimeout(searchTimeout)
  if (!userQuery.value.trim() || selectedPartner.value) { userResults.value = []; return }
  searchTimeout = setTimeout(async () => {
    try { userResults.value = await groupsApi.searchUsers(userQuery.value.trim()) }
    catch { userResults.value = [] }
  }, 300)
}

const selectPartner = (u) => {
  selectedPartner.value = u
  userQuery.value = ''
  userResults.value = []
}

const submit = () => {
  if (!groupName.value || !selectedPartner.value) return
  emit('create', { name: groupName.value, partner: selectedPartner.value })
}

const submitSolo = () => {
  if (!groupName.value) return
  emit('create', { name: groupName.value, partner: null })
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
.search-wrap { position: relative; }
.search-drop { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: 10; max-height: 200px; overflow-y: auto; }
.search-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; width: 100%; text-align: left; transition: background 0.15s; }
.search-item:hover { background: var(--bg-secondary); }
.search-name { font-size: 14px; font-weight: 600; color: var(--text); }
.search-sub { font-size: 12px; color: var(--text-muted); }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0; text-transform: uppercase; }
.avatar.sm { width: 28px; height: 28px; font-size: 11px; }
.selected-pill { display: flex; align-items: center; gap: 8px; background: var(--accent-light); border: 1px solid var(--border); border-radius: 20px; padding: 6px 10px 6px 6px; }
.selected-pill span { font-size: 14px; font-weight: 600; flex: 1; }
.selected-pill button { color: var(--text-muted); display: flex; align-items: center; }

/* Solo confirm banner */
.solo-banner {
  display: flex; align-items: flex-start; gap: 12px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: 16px; padding: 14px;
  animation: fadeSlide 0.2s ease;
}
@keyframes fadeSlide { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.solo-icon { font-size: 24px; flex-shrink: 0; }
.solo-text { display: flex; flex-direction: column; gap: 3px; }
.solo-title { font-size: 14px; font-weight: 700; color: var(--text); }
.solo-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
.solo-btn { background: var(--bg-secondary) !important; color: var(--text) !important; border: 1.5px solid var(--border) !important; }
.solo-btn:hover:not(:disabled) { background: var(--border) !important; }

.spinner-sm { width: 16px; height: 16px; display: inline-block; border: 2px solid rgba(0,0,0,0.15); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.65s linear infinite; vertical-align: middle; }
.spinner-sm.white { border-color: rgba(255,255,255,0.3); border-top-color: white; }
@keyframes spin { to { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.sheet-enter-active { transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); }
.sheet-leave-active { transition: opacity 0.2s ease, transform 0.22s ease-in; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
</style>
