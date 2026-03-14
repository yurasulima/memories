<template>
  <div class="day-card" @click="$emit('click')">
    <div class="day-top">
      <div class="day-date">
        <span class="day-num">{{ dayNum }}</span>
        <span class="day-month">{{ monthName }}</span>
      </div>
      <div class="day-meta">
        <span v-if="day.posts?.length" class="tag">{{ day.posts.length }} пост{{ postSuffix }}</span>
        <span v-if="day.contents?.length" class="tag">{{ day.contents.length }} контент</span>
        <span v-if="day.dates?.length" class="tag tag-accent">{{ day.dates.length }} дата</span>
      </div>
      <button class="delete-btn" @click.stop="$emit('delete')">
        <IconTrash :size="16" />
      </button>
    </div>

    <div v-if="coverMedia" class="day-cover">
      <img :src="coverMedia" alt="" loading="lazy" />
    </div>

    <div v-if="firstPost" class="day-preview">
      {{ firstPost }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IconTrash from './icons/IconTrash.vue'

const props = defineProps({
  day: { type: Object, required: true }
})

defineEmits(['click', 'delete'])

const date = computed(() => new Date(props.day.date))

const dayNum = computed(() => date.value.getDate())

const monthName = computed(() => {
  return date.value.toLocaleDateString('uk-UA', { month: 'short' })
})

const postSuffix = computed(() => {
  const n = props.day.posts?.length || 0
  if (n === 1) return ''
  if (n < 5) return 'и'
  return 'ів'
})

const coverMedia = computed(() => {
  for (const post of props.day.posts || []) {
    const img = post.media?.find(m => m.type?.startsWith('image'))
    if (img) return img.url
  }
  return null
})

const firstPost = computed(() => {
  const text = props.day.posts?.[0]?.text
  if (!text) return null
  return text.length > 120 ? text.slice(0, 120) + '...' : text
})
</script>

<style scoped>
.day-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 12px var(--shadow);
}

.day-card:active {
  transform: scale(0.98);
}

.day-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}

.day-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 12px;
  padding: 6px 10px;
  min-width: 44px;
}

.day-num {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.day-month {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.tag {
  font-size: 11px;
  font-weight: 500;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 8px;
  padding: 3px 8px;
}

.tag-accent {
  background: var(--accent-light);
  color: var(--accent);
}

.delete-btn {
  color: var(--text-muted);
  padding: 6px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  display: flex;
}

.delete-btn:hover {
  color: #e05555;
  background: rgba(224, 85, 85, 0.1);
}

.day-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.day-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.day-preview {
  padding: 0 16px 14px;
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
