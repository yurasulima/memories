<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="confirm-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="confirm-box">
          <p class="confirm-text">{{ message }}</p>
          <div class="confirm-row">
            <button class="confirm-cancel" @click="$emit('update:modelValue', false)">{{ $t('dialogs.confirmDelete.cancel') }}</button>
            <button class="confirm-delete" @click="$emit('confirm')">{{ $t('dialogs.confirmDelete.delete') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  message: { type: String, default: 'Видалити?' }
})
defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; }
.confirm-box { background: var(--bg-card); border-radius: 20px; padding: 24px 22px 20px; width: 100%; max-width: 300px; box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
.confirm-text { font-size: 16px; font-weight: 600; text-align: center; margin-bottom: 20px; color: var(--text); }
.confirm-row { display: flex; gap: 10px; }
.confirm-cancel { flex: 1; padding: 12px; border-radius: 12px; background: var(--bg-secondary); color: var(--text); font-size: 14px; font-weight: 600; border: 1px solid var(--border); }
.confirm-delete { flex: 1; padding: 12px; border-radius: 12px; background: #e05555; color: white; font-size: 14px; font-weight: 600; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
