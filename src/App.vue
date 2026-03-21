<template>
  <div :class="themeStore.theme" class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import { useThemeStore } from './stores/theme.js'
import { StatusBar, Style } from '@capacitor/status-bar'
import {Capacitor} from "@capacitor/core";

const themeStore = useThemeStore()

watch(
    () => themeStore.theme,
    (newTheme, oldTheme) => {
      if (oldTheme) document.body.classList.remove(oldTheme)
      if (newTheme) document.body.classList.add(newTheme)
    },
    { immediate: true }
)

  onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false })
        await StatusBar.setStyle({ style: Style.Dark })
      } catch (e) {
        console.warn('StatusBar not available:', e)
      }
    }
  })

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app {
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.white {
  --bg: #ffffff;
  --bg-secondary: #f7f7f7;
  --bg-card: #ffffff;
  --text: #1a1a1a;
  --text-muted: #777777;
  --border: #e8e8e8;
  --accent: #e8789e;
  --accent-hover: #d45a84;
  --accent-light: #fde8f0;
  --shadow: rgba(0, 0, 0, 0.08);
  --input-bg: #f7f7f7;
  --nav-bg: #ffffff;
}

.pastel {
  --bg: #fff5f8;
  --bg-secondary: #ffe8f0;
  --bg-card: #ffffff;
  --text: #3d2b35;
  --text-muted: #9a7585;
  --border: #fad0de;
  --accent: #f07fa8;
  --accent-hover: #e0628e;
  --accent-light: #ffeaf2;
  --shadow: rgba(240, 127, 168, 0.12);
  --input-bg: #fff0f5;
  --nav-bg: #fff0f5;
}

.dark {
  --bg: #141414;
  --bg-secondary: #1e1e1e;
  --bg-card: #1e1e1e;
  --text: #f0f0f0;
  --text-muted: #888888;
  --border: #333333;
  --accent: #e8789e;
  --accent-hover: #ff85a8;
  --accent-light: #2d1a23;
  --shadow: rgba(0, 0, 0, 0.4);
  --input-bg: #2a2a2a;
  --nav-bg: #1a1a1a;
}

.dark-pastel {
  --bg: #1e1220;
  --bg-secondary: #2a1a2e;
  --bg-card: #251628;
  --text: #f0dce8;
  --text-muted: #b08aaa;
  --border: #4a2e5a;
  --accent: #c97fab;
  --accent-hover: #e896c4;
  --accent-light: #321a38;
  --shadow: rgba(180, 100, 160, 0.18);
  --input-bg: #2e1a38;
  --nav-bg: #1e1220;
}

.white,
.pastel,
.dark,
.dark-pastel {
  background-color: var(--bg);
  color: var(--text);
}



.white, .pastel {
  --anime-bg: #d0e7ff;
  --anime-text: #1a73e8;

  --hentai-bg: #f4d0e0;
  --hentai-text: #c2185b;

  --cartoon-bg: #f4d0e0;
  --cartoon-text: #c2185b;

  --series-bg: #dff0d8;
  --series-text: #2e7d32;

  --film-bg: #fff3e0;
  --film-text: #e65100;
}

/* Dark themes */
.dark, .dark-pastel {
  --anime-bg: #1a2738;
  --anime-text: #6eb8ff;

  --hentai-bg: #632248;
  --hentai-text: #ff7abf;

  --cartoon-bg: #632248;
  --cartoon-text: #ff7abf;

  --series-bg: #223022;
  --series-text: #81c784;

  --film-bg: #352618;
  --film-text: #ffb74d;
}




/* ── Ocean ── deep dark teal */
.ocean {
  --bg: #0a1628;
  --bg-secondary: #0f2040;
  --bg-card: #0f2040;
  --text: #d0eaf8;
  --text-muted: #6a9ab8;
  --border: #1a3a5c;
  --accent: #38bdf8;
  --accent-hover: #7dd3fc;
  --accent-light: #0c2a44;
  --shadow: rgba(0, 0, 0, 0.35);
  --input-bg: #152d4a;
  --nav-bg: #0a1628;
}

/* ── Forest ── deep dark green */
.forest {
  --bg: #0d1f12;
  --bg-secondary: #162a1c;
  --bg-card: #162a1c;
  --text: #d4edda;
  --text-muted: #6aaf7c;
  --border: #1e3d28;
  --accent: #4ade80;
  --accent-hover: #86efac;
  --accent-light: #112218;
  --shadow: rgba(0, 0, 0, 0.35);
  --input-bg: #1a3022;
  --nav-bg: #0d1f12;
}

/* ── Sunset ── warm dark orange/red */
.sunset {
  --bg: #1a0f0a;
  --bg-secondary: #2a1a12;
  --bg-card: #2a1a12;
  --text: #fde8d0;
  --text-muted: #c08060;
  --border: #3d2015;
  --accent: #fb923c;
  --accent-hover: #fdba74;
  --accent-light: #2d1a0a;
  --shadow: rgba(0, 0, 0, 0.35);
  --input-bg: #321e14;
  --nav-bg: #1a0f0a;
}

/* ── Midnight ── deep purple/indigo */
.midnight {
  --bg: #0d0b1e;
  --bg-secondary: #16132e;
  --bg-card: #16132e;
  --text: #e0d8f8;
  --text-muted: #8878c8;
  --border: #2a2050;
  --accent: #a78bfa;
  --accent-hover: #c4b5fd;
  --accent-light: #1a1240;
  --shadow: rgba(0, 0, 0, 0.35);
  --input-bg: #1e1a38;
  --nav-bg: #0d0b1e;
}

/* ── Rose ── soft light pink/rose */
.rose {
  --bg: #fff1f2;
  --bg-secondary: #ffe4e6;
  --bg-card: #ffffff;
  --text: #3b0a14;
  --text-muted: #9f4455;
  --border: #fecdd3;
  --accent: #f43f5e;
  --accent-hover: #e11d48;
  --accent-light: #ffe4e9;
  --shadow: rgba(244, 63, 94, 0.08);
  --input-bg: #fff0f1;
  --nav-bg: #fff1f2;
}

/* ── Mint ── fresh light green */
.mint {
  --bg: #f0fdf4;
  --bg-secondary: #dcfce7;
  --bg-card: #ffffff;
  --text: #052e16;
  --text-muted: #4a7c59;
  --border: #bbf7d0;
  --accent: #16a34a;
  --accent-hover: #15803d;
  --accent-light: #d1fae5;
  --shadow: rgba(22, 163, 74, 0.07);
  --input-bg: #f0fdf4;
  --nav-bg: #f0fdf4;
}

/* ── Sky ── clean light blue */
.sky {
  --bg: #f0f9ff;
  --bg-secondary: #e0f2fe;
  --bg-card: #ffffff;
  --text: #082f49;
  --text-muted: #4a7fa0;
  --border: #bae6fd;
  --accent: #0284c7;
  --accent-hover: #0369a1;
  --accent-light: #e0f2fe;
  --shadow: rgba(2, 132, 199, 0.07);
  --input-bg: #f0f9ff;
  --nav-bg: #f0f9ff;
}

/* ── Amoled ── pure black */
.amoled {
  --bg: #000000;
  --bg-secondary: #0a0a0a;
  --bg-card: #0f0f0f;
  --text: #ffffff;
  --text-muted: #777777;
  --border: #222222;
  --accent: #e8789e;
  --accent-hover: #ff85a8;
  --accent-light: #1a0a10;
  --shadow: rgba(0, 0, 0, 0.8);
  --input-bg: #141414;
  --nav-bg: #000000;
}

/* Light new themes */
.rose, .mint, .sky {
  --anime-bg: #d0e7ff;
  --anime-text: #1a73e8;
  --hentai-bg: #f4d0e0;
  --hentai-text: #c2185b;
  --cartoon-bg: #f4d0e0;
  --cartoon-text: #c2185b;
  --series-bg: #dff0d8;
  --series-text: #2e7d32;
  --film-bg: #fff3e0;
  --film-text: #e65100;
}

/* Dark new themes */
.ocean, .forest, .sunset, .midnight, .amoled {
  --anime-bg: #1a2738;
  --anime-text: #6eb8ff;
  --hentai-bg: #632248;
  --hentai-text: #ff7abf;
  --cartoon-bg: #632248;
  --cartoon-text: #ff7abf;
  --series-bg: #223022;
  --series-text: #81c784;
  --film-bg: #352618;
  --film-text: #ffb74d;
}

/* background-color + color for all new themes */
.ocean, .forest, .sunset, .midnight, .rose, .mint, .sky, .amoled {
  background-color: var(--bg);
  color: var(--text);
}

</style>