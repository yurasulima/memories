<template>
  <div class="layout">
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <nav class="bottom-nav">
      <router-link to="/" class="nav-item" :class="{ active: route.name === 'home' }">
        <IconHome :size="24" :filled="route.name === 'home'" />
        <span>Стрічка</span>
      </router-link>
      <router-link to="/stats" class="nav-item" :class="{ active: route.name === 'stats' }">
        <IconStats :size="24" :filled="route.name === 'stats'" />
        <span>Статистика</span>
      </router-link>
      <router-link to="/settings" class="nav-item" :class="{ active: route.name === 'settings' }">
        <IconSettings :size="24" :filled="route.name === 'settings'" />
        <span>Налаштування</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import IconHome from '../components/icons/IconHome.vue'
import IconStats from '../components/icons/IconStats.vue'
import IconSettings from '../components/icons/IconSettings.vue'

const route = useRoute()
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
}

.page-content {
  flex: 1;
  padding-bottom: 72px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: var(--nav-bg);
  border-top: 1px solid var(--border);
  display: flex;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  backdrop-filter: blur(12px);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 0;
  color: var(--text-muted);
  transition: color 0.2s;
}

.nav-item span {
  font-size: 10px;
  font-weight: 500;
}

.nav-item.active {
  color: var(--accent);
}
</style>
