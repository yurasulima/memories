<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" :stroke-width="filled ? '0' : '1.8'" stroke-linejoin="round"/>
    <path v-if="!filled" d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path v-if="filled" d="M9 21V12h6v9" stroke="var(--bg-card, white)" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 24 },
  filled: { type: Boolean, default: false }
})
</script>
