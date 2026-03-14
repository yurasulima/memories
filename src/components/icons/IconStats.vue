<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="12" width="4" height="9" rx="1" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"/>
    <rect x="10" y="7" width="4" height="14" rx="1" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"/>
    <rect x="17" y="3" width="4" height="18" rx="1" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"/>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 24 },
  filled: { type: Boolean, default: false }
})
</script>
