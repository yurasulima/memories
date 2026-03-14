<template>
  <div :class="themeStore.theme" class="app">
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useThemeStore } from './stores/theme.js'

const themeStore = useThemeStore()

// Sync theme class to <body> so teleported dialogs inherit CSS vars
watch(
    () => themeStore.theme,
    (newTheme, oldTheme) => {
      if (oldTheme) document.body.classList.remove(oldTheme)
      if (newTheme) document.body.classList.add(newTheme)
    },
    { immediate: true }
)
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



</style>