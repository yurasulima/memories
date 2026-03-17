<template>
  <div class="layout">
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>

    <nav class="bottom-nav">
      <div class="nav-track">
        <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="nav-item"
            :class="{ active: route.name === item.name }"
        >
          <div class="nav-icon-wrap">
            <div class="nav-pill"></div>
            <component
                :is="item.icon"
                :size="22"
                :filled="route.name === item.name"
                class="nav-icon"
            />
          </div>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import IconHome from '../components/icons/IconHome.vue'
import IconStats from '../components/icons/IconStats.vue'
import IconSettings from '../components/icons/IconSettings.vue'

const route = useRoute()
const router = useRouter()

router.afterEach(() => {
  window.scrollTo({ top: 0 })
})

const navItems = [
  { name: 'app',     to: '/app/',         label: 'Стрічка',       icon: IconHome },
  { name: 'stats',    to: '/app/stats',    label: 'Статистика',    icon: IconStats },
  { name: 'settings', to: '/app/settings', label: 'Налаштування',  icon: IconSettings },
]
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
  padding-bottom: 88px;
}

/* ── Nav shell ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 100;
  padding: 8px 12px calc(10px + env(safe-area-inset-bottom));
  /* Fade from transparent to --bg so content underneath blurs away cleanly */
  background: linear-gradient(to top, var(--bg) 70%, transparent);
}

/* ── Pill-shaped track ── */
.nav-track {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--nav-bg, var(--bg-card));
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 3px 8px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
}

/* ── Individual item ── */
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 2px 0;
  color: var(--text-muted);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.2s ease;
  position: relative;
}

.nav-item.active {
  color: var(--accent);
}

/* ── Icon + pill wrapper ── */
.nav-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 30px;
}

/* Background pill that grows in on active */
.nav-pill {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: var(--accent-light, rgba(var(--accent-rgb, 255, 90, 130), 0.12));
  transform: scaleX(0.4) scaleY(0.6);
  opacity: 0;
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
  opacity 0.2s ease;
}

.nav-item.active .nav-pill {
  transform: scaleX(1) scaleY(1);
  opacity: 1;
}

.nav-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item.active .nav-icon {
  transform: translateY(-1px) scale(1.08);
}

/* ── Label ── */
.nav-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 0.55;
  transform: translateY(1px);
}

.nav-item.active .nav-label {
  opacity: 1;
  transform: translateY(0);
}

/* ── Page transition ── */
.page-enter-active {
  transition: opacity 0.18s ease, transform 0.22s ease;
}
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>