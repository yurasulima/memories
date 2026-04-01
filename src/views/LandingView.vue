<template>
  <div class="landing">

    <!-- ── HEADER ── -->
    <header class="l-header" :class="{ scrolled: isScrolled }">
      <div class="l-logo">
        <IconHeart :size="20" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text">Memories</span>
      </div>
      <nav class="l-nav">
        <a href="#features"  @click.prevent="scrollTo('features')">{{ $t('nav.features') }}</a>
        <a href="#how"       @click.prevent="scrollTo('how')">{{ $t('nav.how') }}</a>
        <a href="#privacy"   @click.prevent="scrollTo('privacy')">{{ $t('landing.nav.privacy') }}</a>
        <a href="#faq"       @click.prevent="scrollTo('faq')">{{ $t('landing.nav.faq') }}</a>
        <a href="#start"     @click.prevent="scrollTo('start')">{{ $t('nav.start') }}</a>
      </nav>
      <router-link to="/app" class="btn-accent l-cta">
        {{ $t('nav.open') }}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"/>
        </svg>
      </router-link>
      <button class="l-burger" @click="mobileMenu = !mobileMenu" :aria-expanded="mobileMenu">
        <span></span><span></span><span></span>
      </button>
    </header>

    <!-- Mobile nav -->
    <transition name="l-mob">
      <div v-if="mobileMenu" class="l-mob-nav">
        <a href="#features" @click.prevent="mobileScrollTo('features')">{{ $t('nav.features') }}</a>
        <a href="#how"      @click.prevent="mobileScrollTo('how')">{{ $t('nav.how') }}</a>
        <a href="#privacy"  @click.prevent="mobileScrollTo('privacy')">{{ $t('landing.nav.privacy') }}</a>
        <a href="#faq"      @click.prevent="mobileScrollTo('faq')">{{ $t('landing.nav.faq') }}</a>
      </div>
    </transition>

    <!-- ── HERO ── -->
    <section class="l-hero">
      <div class="l-hero-glow"></div>
      <div class="l-particles">
        <svg v-for="p in particles" :key="p.id" class="l-p-dot" :style="p.style"
             viewBox="0 0 24 24" fill="none" :stroke="p.stroke" :stroke-width="p.sw"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21C12 21 3 14.5 3 8.5a5.5 5.5 0 0111 0 5.5 5.5 0 0111 0C25 14.5 12 21 12 21z"/>
        </svg>
      </div>
      <div class="l-badge">
        <span class="l-badge-dot"></span>
        {{ $t('landing.badge') }}
      </div>
      <h1 class="l-title">
        {{ $t('landing.hero.title1') }}<br/>
        <span class="l-accent">{{ $t('landing.hero.title2') }}</span>
      </h1>
      <p class="l-desc">{{ $t('landing.hero.desc') }}</p>
      <div class="l-hero-btns">
        <router-link to="/app" class="btn-accent" style="font-size:15px;padding:14px 28px;">
          {{ $t('landing.hero.cta') }}
        </router-link>
        <a href="#features" class="btn-outline" @click.prevent="scrollTo('features')">
          {{ $t('landing.hero.more') }}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6.5 2v9M2 7l4.5 4 4.5-4"/>
          </svg>
        </a>
      </div>
      <div class="l-trust">
        <div class="l-trust-item">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z"/></svg>
          <span>{{ $t('landing.trust.free') }}</span>
        </div>
        <span class="l-trust-dot"></span>
        <div class="l-trust-item">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="8" width="12" height="7" rx="2"/><path d="M5 8V5a3 3 0 016 0v3"/></svg>
          <span>{{ $t('landing.trust.private') }}</span>
        </div>
        <span class="l-trust-dot"></span>
        <div class="l-trust-item">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4"/></svg>
          <span>{{ $t('landing.trust.noAds') }}</span>
        </div>
      </div>
    </section>

    <!-- ── PHONE MOCKUP ── -->
    <div class="l-mockup-wrap">
      <div class="l-mockup-glow"></div>
      <div class="l-phone">
        <div class="l-phone-screen">
          <div class="lm-header">
            <div class="lm-header-left">
              <IconHeart :size="14" :filled="true" class="lm-icon" />
              <span class="lm-title">Memories</span>
            </div>
            <span class="lm-group">{{ $t('landing.mockup.group') }}</span>
          </div>
          <div class="lm-search">
            <span>🔍</span>
            <span class="lm-search-ph">{{ $t('landing.mockup.searchPlaceholder') }}</span>
          </div>
          <div class="lm-year"><span class="lm-year-lbl">2026</span></div>
          <div v-for="day in mockDays" :key="day.date" class="lm-row">
            <div class="lm-stamp">
              <span class="lm-sday">{{ day.day }}</span>
              <span class="lm-smo">{{ day.mo }}</span>
              <span class="lm-swd">{{ day.wd }}</span>
            </div>
            <div class="lm-spine">
              <div class="lm-dot"></div>
              <div class="lm-line"></div>
            </div>
            <div class="lm-content">
              <div class="lm-day-hdr">
                <span class="lm-day-date">{{ day.full }}</span>
                <span class="lm-x">✕</span>
              </div>
              <div v-for="item in day.items" :key="item.name" class="lm-card">
                <span :class="['lm-badge', item.type]">{{ $t(`landing.contentTypes.${item.type}`) }}</span>
                <span class="lm-name">{{ item.name }}</span>
                <span v-if="item.ep" class="lm-ep">{{ item.ep }}</span>
              </div>
              <div class="lm-actions">
                <span class="lm-abtn">+ {{ $t('home.addPost') }}</span>
                <span class="lm-abtn">+ {{ $t('home.addDate') }}</span>
                <span class="lm-abtn">+ {{ $t('home.addContent') }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ── FEATURES ── -->
    <section id="features" class="l-section">
      <p class="l-eyebrow">{{ $t('landing.features.eyebrow') }}</p>
      <h2 class="l-stitle">{{ $t('landing.features.title1') }} <span class="l-accent">{{ $t('landing.features.title2') }}</span></h2>
      <p class="l-ssub">{{ $t('landing.features.sub') }}</p>
      <div class="l-feat-grid">
        <div v-for="f in features" :key="f.key" class="l-feat-card">
          <div class="l-feat-icon" v-html="f.icon"></div>
          <div class="l-feat-title">{{ $t(`landing.features.items.${f.key}.title`) }}</div>
          <div class="l-feat-desc">{{ $t(`landing.features.items.${f.key}.desc`) }}</div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <div id="how" class="l-how-wrap">
      <div class="l-section">
        <p class="l-eyebrow">{{ $t('landing.how.eyebrow') }}</p>
        <h2 class="l-stitle">{{ $t('landing.how.title1') }} <span class="l-accent">{{ $t('landing.how.title2') }}</span></h2>
        <div class="l-steps">
          <div v-for="s in steps" :key="s.n" class="l-step">
            <div class="l-step-num">{{ s.n }}</div>
            <div class="l-step-icon" v-html="s.icon"></div>
            <div class="l-step-n">{{ $t('landing.how.step') }} {{ s.n }}</div>
            <div class="l-step-title">{{ $t(`landing.how.steps.${s.n}.title`) }}</div>
            <div class="l-step-desc">{{ $t(`landing.how.steps.${s.n}.desc`) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CONTENT TYPES ── -->
    <section class="l-section">
      <p class="l-eyebrow">{{ $t('landing.chips.eyebrow') }}</p>
      <h2 class="l-stitle">{{ $t('landing.chips.title1') }} <span class="l-accent">{{ $t('landing.chips.title2') }}</span></h2>
      <div class="l-chips">
        <div v-for="chip in chips" :key="chip.key" class="l-chip">
          <div class="l-chip-dot" :style="{ background: chip.color }"></div>
          <span>{{ $t(`landing.chips.items.${chip.key}.label`) }}</span>
          <span class="l-chip-sub">{{ $t(`landing.chips.items.${chip.key}.sub`) }}</span>
        </div>
      </div>
    </section>

    <!-- ── PRIVACY ── -->
    <section id="privacy" class="l-privacy-wrap">
      <div class="l-section" style="padding-top:80px;padding-bottom:80px;">
        <p class="l-eyebrow">{{ $t('landing.privacy.eyebrow') }}</p>
        <h2 class="l-stitle">{{ $t('landing.privacy.title1') }} <span class="l-accent">{{ $t('landing.privacy.title2') }}</span></h2>
        <p class="l-ssub" style="max-width:520px;margin-bottom:48px;">{{ $t('landing.privacy.sub') }}</p>
        <div class="l-privacy-grid">
          <div v-for="p in privacyPoints" :key="p.key" class="l-privacy-card">
            <div class="l-privacy-icon" v-html="p.icon"></div>
            <div class="l-privacy-body">
              <div class="l-privacy-title">{{ $t(`landing.privacy.points.${p.key}.title`) }}</div>
              <div class="l-privacy-desc">{{ $t(`landing.privacy.points.${p.key}.desc`) }}</div>
            </div>
          </div>
        </div>
        <div class="l-ppb">
          <div class="l-ppb-icon">
            <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-4z"/><path d="M8 11l2 2 4-4"/></svg>
          </div>
          <div>
            <div class="l-ppb-title">{{ $t('landing.privacy.policy.title') }}</div>
            <div class="l-ppb-text">{{ $t('landing.privacy.policy.text') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── QUOTE ── -->
    <section class="l-quote-wrap">
      <div class="l-quote-bg">❝</div>
      <p class="l-quote-text">
        {{ $t('landing.quote.text1') }} <span class="l-accent">{{ $t('landing.quote.accent') }}</span>.<br/>
        {{ $t('landing.quote.text2') }}
      </p>
      <p class="l-quote-author">{{ $t('landing.quote.author') }}</p>
    </section>

    <!-- ── FAQ ── -->
    <section id="faq" class="l-section">
      <p class="l-eyebrow">{{ $t('landing.faq.eyebrow') }}</p>
      <h2 class="l-stitle">{{ $t('landing.faq.title1') }} <span class="l-accent">{{ $t('landing.faq.title2') }}</span></h2>
      <p class="l-ssub" style="margin-bottom:44px;">{{ $t('landing.faq.sub') }}</p>
      <div class="l-faq-list">
        <div
            v-for="(item, i) in faqItems" :key="i"
            class="l-faq-item" :class="{ open: faqOpen === i }"
            @click="faqOpen = faqOpen === i ? null : i"
        >
          <div class="l-faq-q">
            <span>{{ $t(`landing.faq.items.${item.key}.q`) }}</span>
            <svg class="l-faq-chevron" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4.5 7l4.5 4.5L13.5 7"/>
            </svg>
          </div>
          <transition name="l-faq">
            <div v-if="faqOpen === i" class="l-faq-a">{{ $t(`landing.faq.items.${item.key}.a`) }}</div>
          </transition>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section id="start" class="l-cta-wrap">
      <div class="l-cta-glow"></div>
      <h2 class="l-stitle" style="font-size:clamp(30px,6vw,56px);margin-bottom:14px;">
        {{ $t('landing.cta.title1') }}<br/><span class="l-accent">{{ $t('landing.cta.title2') }}</span>
      </h2>
      <p class="l-ssub" style="max-width:100%;margin-bottom:40px;">{{ $t('landing.cta.sub') }}</p>
      <router-link to="/app" class="btn-accent" style="font-size:15px;padding:14px 32px;">
        {{ $t('landing.cta.btn') }}
        <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"/></svg>
      </router-link>
      <p class="l-cta-note">{{ $t('landing.cta.note') }}</p>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="l-footer">
      <div class="l-footer-logo">
        <IconHeart :size="16" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text" style="font-size:14px;">Memories</span>
      </div>
      <nav class="l-footer-nav">

        <router-link to="/privacy">Privacy Policy</router-link>
        <router-link to="/terms">Terms</router-link>
        <a href="#features" @click.prevent="scrollTo('features')">{{ $t('nav.features') }}</a>
        <a href="#privacy"  @click.prevent="scrollTo('privacy')">{{ $t('landing.nav.privacy') }}</a>
        <a href="#faq"      @click.prevent="scrollTo('faq')">{{ $t('landing.nav.faq') }}</a>
        <a href="#start"    @click.prevent="scrollTo('start')">{{ $t('nav.start') }}</a>
      </nav>
      <span class="l-footer-copy">{{ $t('landing.footer.copy') }}</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import IconHeart from '../components/icons/IconHeart.vue'

const { t } = useI18n()

const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 50 }

const mobileMenu = ref(false)
const mobileScrollTo = (id) => {
  mobileMenu.value = false
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
}
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const faqOpen = ref(null)
const faqItems = [
  { key: 'free' }, { key: 'who' }, { key: 'private' },
  { key: 'data' }, { key: 'devices' }, { key: 'delete' },
]

const heartPaths = [
  "M12 21C12 21 3 14.5 3 8.5a5.5 5.5 0 0111 0 5.5 5.5 0 0111 0C25 14.5 12 21 12 21z",
  "M12 20C12 20 2 13 2 7.5A5 5 0 0112 4a5 5 0 0110 3.5C22 13 12 20 12 20z",
  "M12 22S2 15 2 8.5A6 6 0 0112 5a6 6 0 0110 3.5C22 15 12 22 12 22z",
  "M12 19C12 19 4 13.5 4 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 018 2.5C20 13.5 12 19 12 19z",
]
const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  stroke: `color-mix(in srgb, var(--accent) ${40 + Math.random() * 60}%, transparent)`,
  sw: (0.8 + Math.random() * 1.2).toFixed(1),
  path: heartPaths[i % heartPaths.length],
  style: {
    width:  (10 + Math.random() * 18) + 'px',
    height: (10 + Math.random() * 18) + 'px',
    left:   (Math.random() * 100) + '%',
    bottom: (Math.random() * 20) + '%',
    animationDuration: (10 + Math.random() * 14) + 's',
    animationDelay:    (Math.random() * 14) + 's',
  }
}))

const mockDays = [
  { day: 13, mo: 'БЕР.', wd: 'Пт', full: '13 Березня 2026 р.', items: [{ type: 'film', name: 'House of Wax' }] },
  { day: 12, mo: 'БЕР.', wd: 'Чт', full: '12 Березня 2026 р.', items: [{ type: 'series', name: 'Friends' }, { type: 'series', name: 'The boys', ep: 'ep.3 s1' }] },
  { day: 11, mo: 'БЕР.', wd: 'Ср', full: '11 Березня 2026 р.', items: [{ type: 'cartoon', name: 'Carol & The End...', ep: 'ep.4 s1' }] },
]

const features = [
  { key: 'feed',    icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20S3 14.5 3 8.5a8 8 0 0116 0C19 14.5 11 20 11 20z"/></svg>` },
  { key: 'dates',   icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="16" height="14" rx="2"/><path d="M7 2v4M15 2v4M3 10h16"/></svg>` },
  { key: 'content', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="18" height="14" rx="2"/><path d="M8 21h6M11 17v4"/><path d="M7 10l3 2.5L15 7"/></svg>` },
  { key: 'posts',   icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>` },
]

const steps = [
  { n: '1', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="8" r="4"/><path d="M3 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>` },
  { n: '2', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3.5"/><path d="M3 18c0-3 2.2-5.5 5-5.5"/><path d="M15 13a4 4 0 014 4"/><circle cx="17" cy="10" r="3"/></svg>` },
  { n: '3', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="16" height="14" rx="2"/><path d="M7 2v4M15 2v4M3 10h16"/><circle cx="8" cy="14" r="1" fill="var(--accent)"/><circle cx="12" cy="14" r="1" fill="var(--accent)"/><circle cx="16" cy="14" r="1" fill="var(--accent)"/></svg>` },
]

const chips = [
  { key: 'anime',   color: 'var(--anime-text)'   },
  { key: 'series',  color: 'var(--series-text)'  },
  { key: 'films',   color: 'var(--film-text)'    },
  { key: 'cartoon', color: 'var(--cartoon-text)' },
  { key: 'dates',   color: 'var(--accent)'       },
  { key: 'media',   color: 'var(--accent-hover)' },
  { key: 'notes',   color: '#9ab8f0'             },
]

const privacyPoints = [
  { key: 'onlyTwo',   icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3.5"/><path d="M2 18c0-3.3 2.7-6 6-6"/><circle cx="16" cy="11" r="3"/><path d="M13 19c0-2.8 1.3-5 3-5s3 2.2 3 5"/></svg>` },
  { key: 'noSell',    icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="9"/><path d="M4.9 4.9l12.2 12.2"/></svg>` },
  { key: 'encrypted', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="16" height="10" rx="2"/><path d="M7 10V7a4 4 0 018 0v3"/></svg>` },
  { key: 'noAds',     icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="18" height="13" rx="2"/><path d="M8 21h6M11 17v4"/><path d="M6 9h3M6 12h7"/></svg>` },
  { key: 'yourData',  icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13l2 2 4-4"/></svg>` },
  { key: 'deleteRight', icon: `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H6a2 2 0 01-2-2L3 6"/><path d="M8 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>` },
]

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.landing { min-height: 100vh; overflow-x: hidden; }

/* ── Header ── */
.l-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 14px;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: padding 0.25s;
}
.l-header.scrolled { padding: 11px 24px; }
.l-logo { display: flex; align-items: center; gap: 9px; }
.l-logo-icon { color: var(--accent); }
.l-logo-text {
  font-size: 19px; font-weight: 800; letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.l-nav { display: flex; align-items: center; gap: 22px; }
.l-nav a { font-size: 13px; font-weight: 600; color: var(--text-muted); text-decoration: none; transition: color 0.2s; cursor: pointer; }
.l-nav a:hover { color: var(--text); }

.btn-accent {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--accent); color: white;
  font-size: 13px; font-weight: 700;
  padding: 10px 20px; border-radius: 14px; text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-accent:active { transform: scale(0.96); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 10px 20px; text-decoration: none; cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.btn-outline:hover { color: var(--accent); background: var(--accent-light); border-color: transparent; }

/* ── Burger ── */
.l-burger { display: none; flex-direction: column; gap: 5px; padding: 6px; cursor: pointer; background: none; border: none; }
.l-burger span { display: block; width: 22px; height: 2px; background: var(--text-muted); border-radius: 2px; transition: all 0.2s; }

/* ── Mobile nav ── */
.l-mob-nav {
  position: fixed; top: 60px; left: 0; right: 0; z-index: 99;
  background: color-mix(in srgb, var(--bg) 97%, transparent);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border); padding: 16px 20px 24px;
  display: flex; flex-direction: column; gap: 8px;
}
.l-mob-nav a { padding: 10px 14px; font-size: 15px; font-weight: 600; color: var(--text-muted); text-decoration: none; border-radius: 12px; transition: color 0.15s, background 0.15s; }
.l-mob-nav a:hover { color: var(--accent); background: var(--accent-light); }
.l-mob-enter-active, .l-mob-leave-active { transition: opacity 0.2s, transform 0.2s; }
.l-mob-enter-from, .l-mob-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Hero ── */
.l-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 130px 20px 90px; position: relative; overflow: hidden;
}
.l-hero-glow {
  position: absolute; top: 38%; left: 50%; transform: translate(-50%, -50%);
  width: 500px; height: 500px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 65%);
  pointer-events: none; animation: glow-breathe 6s ease-in-out infinite;
}
@keyframes glow-breathe {
  0%,100% { opacity: .6; transform: translate(-50%,-50%) scale(1); }
  50%      { opacity: 1;  transform: translate(-50%,-50%) scale(1.1); }
}
.l-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.l-p-dot {
  position: absolute;
  opacity: 0;
  animation: pdotup linear infinite;
  overflow: visible;
  animation-timing-function: ease-in-out;
}
@keyframes pdotup {
  0%  { opacity: 0; transform: translateY(0) scale(.3); }
  15% { opacity: .45; }
  85% { opacity: .08; }
  100%{ opacity: 0; transform: translateY(-65vh) scale(1); }
}
.l-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent-light); border: 1px solid var(--border);
  border-radius: 100px; padding: 6px 16px;
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--accent); margin-bottom: 28px; animation: l-fadeup .7s ease both;
}
.l-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: l-blink 2s ease-in-out infinite; }
@keyframes l-blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
.l-title { font-size: clamp(42px,9vw,84px); font-weight: 900; letter-spacing: -2px; line-height: 1; color: var(--text); margin-bottom: 8px; animation: l-fadeup .7s .1s ease both; }
.l-accent { background: linear-gradient(135deg, var(--accent), var(--accent-hover)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.l-subtitle { font-size: clamp(15px,3vw,21px); font-weight: 500; color: var(--text-muted); margin-bottom: 32px; animation: l-fadeup .7s .18s ease both; }
.l-desc { max-width: 430px; font-size: 14px; color: var(--text-muted); line-height: 1.8; margin-bottom: 42px; animation: l-fadeup .7s .26s ease both; }
.l-hero-btns { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; animation: l-fadeup .7s .34s ease both; margin-bottom: 28px; }

.l-trust { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; animation: l-fadeup .7s .44s ease both; }
.l-trust-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--text-muted); }
.l-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border); }

.l-scroll-hint {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: var(--text-muted); font-size: 10px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase; animation: l-fadeup .8s 1s ease both;
}
.l-scroll-line { width: 1px; height: 32px; background: linear-gradient(to bottom, var(--border), transparent); animation: l-slblink 2s ease-in-out infinite; }
@keyframes l-slblink { 0%,100%{opacity:.4;} 50%{opacity:1;} }
@keyframes l-fadeup { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

/* ── Mockup ── */
.l-mockup-wrap { display: flex; justify-content: center; padding: 0 20px 100px; position: relative; }
.l-mockup-glow { position: absolute; top: 40%; left: 50%; transform: translate(-50%,-50%); width: 340px; height: 340px; background: radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 60%); pointer-events: none; }
.l-phone { width: 290px; background: var(--bg-secondary); border-radius: 44px; border: 1.5px solid var(--border); overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,.5), 0 0 0 6px rgba(255,255,255,.02); position: relative; }
.l-phone::before { content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 74px; height: 20px; background: var(--bg); border-radius: 20px; z-index: 10; }
.l-phone-screen { padding: 44px 14px 0; display: flex; flex-direction: column; }
.lm-header { display:flex; align-items:center; justify-content:space-between; padding:10px 6px; border-bottom:1px solid var(--border); margin-bottom:8px; }
.lm-header-left { display:flex; align-items:center; gap:7px; }
.lm-icon { color: var(--accent); }
.lm-title { font-size:14px; font-weight:800; letter-spacing:-.3px; background:linear-gradient(135deg,var(--accent),var(--accent-hover)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.lm-group { font-size:10px; color:var(--text-muted); font-weight:600; }
.lm-search { display:flex; align-items:center; gap:7px; background:var(--input-bg); border:1.5px solid var(--border); border-radius:14px; padding:8px 10px; margin-bottom:10px; }
.lm-search-ph { font-size:10px; color:var(--text-muted); }
.lm-year { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.lm-year::after { content:''; flex:1; height:1px; background:var(--border); }
.lm-year-lbl { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); }
.lm-row { display:grid; grid-template-columns:34px 22px 1fr; align-items:stretch; margin-bottom:10px; }
.lm-stamp { display:flex; flex-direction:column; align-items:center; padding-top:8px; }
.lm-sday { font-size:15px; font-weight:800; color:var(--text); line-height:1; }
.lm-smo  { font-size:7px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:.3px; }
.lm-swd  { font-size:7px; color:var(--text-muted); }
.lm-spine { display:flex; flex-direction:column; align-items:center; padding-top:10px; }
.lm-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 0 2px var(--bg-secondary),0 0 0 3px var(--accent); flex-shrink:0; z-index:1; }
.lm-line { width:2px; flex:1; background:linear-gradient(to bottom,var(--accent),var(--border)); margin-top:4px; opacity:.35; }
.lm-content { display:flex; flex-direction:column; gap:4px; }
.lm-day-hdr { display:flex; align-items:center; justify-content:space-between; background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:4px 6px 4px 10px; margin-bottom:2px; }
.lm-day-date { font-size:9px; font-weight:700; color:var(--text-muted); flex:1; text-transform:capitalize; }
.lm-x { font-size:9px; color:var(--text-muted); opacity:.5; }
.lm-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:6px 6px 6px 8px; display:flex; align-items:center; gap:6px; }
.lm-badge { font-size:7px; font-weight:700; border-radius:6px; padding:2px 5px; flex-shrink:0; letter-spacing:.3px; }
.lm-badge.film    { background:var(--film-bg);    color:var(--film-text);    }
.lm-badge.hentai  { background:var(--hentai-bg);  color:var(--hentai-text);  }
.lm-badge.cartoon { background:var(--cartoon-bg); color:var(--cartoon-text); }
.lm-badge.anime   { background:var(--anime-bg);   color:var(--anime-text);   }
.lm-badge.series  { background:var(--series-bg);  color:var(--series-text);  }
.lm-name { font-size:10px; font-weight:500; color:var(--text); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lm-ep   { font-size:8px; color:var(--text-muted); white-space:nowrap; }
.lm-actions { display:flex; gap:4px; padding:2px 0 4px; }
.lm-abtn { font-size:8px; font-weight:600; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:3px 8px; }

.lm-nav { display:flex; justify-content:space-around; background:var(--nav-bg); border-top:1px solid var(--border); padding:8px 0 14px; margin:6px -14px 0; width:calc(100% + 28px); }

.lm-nav-item { display:flex; flex-direction:column; align-items:center; gap:2px; }
.lm-nav-item span { font-size:7px; font-weight:600; color:var(--text-muted); }

/* ── Sections ── */
.l-section { padding: 96px 20px; max-width: 960px; margin: 0 auto; }
.l-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.l-eyebrow::before { content:''; width:18px; height:2px; background:var(--accent); border-radius:2px; }
.l-stitle { font-size:clamp(26px,5vw,44px); font-weight:800; letter-spacing:-1px; line-height:1.1; color:var(--text); margin-bottom:14px; }
.l-ssub   { font-size:14px; color:var(--text-muted); line-height:1.8; max-width:430px; margin-bottom:50px; }

/* ── Features ── */
.l-feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; }
.l-feat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:26px 22px; transition:box-shadow .18s,border-color .18s,transform .2s; }
.l-feat-card:hover { box-shadow:0 4px 20px var(--shadow); border-color:var(--accent); transform:translateY(-3px); }
.l-feat-icon { width:42px; height:42px; background:var(--accent-light); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
.l-feat-icon :deep(svg) { width:20px; height:20px; }
.l-feat-title { font-size:15px; font-weight:700; color:var(--text); margin-bottom:7px; }
.l-feat-desc  { font-size:12px; color:var(--text-muted); line-height:1.7; }

/* ── How it works ── */
.l-how-wrap { background:var(--bg-secondary); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.l-steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; margin-top:50px; }
.l-step { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:28px 24px; position:relative; overflow:hidden; transition:box-shadow .18s,border-color .18s,transform .2s; }
.l-step:hover { box-shadow:0 4px 20px var(--shadow); border-color:var(--accent); transform:translateY(-3px); }
.l-step-num { position:absolute; top:14px; right:18px; font-size:52px; font-weight:900; letter-spacing:-2px; color:var(--border); line-height:1; pointer-events:none; user-select:none; }
.l-step-icon { width:44px; height:44px; background:var(--accent-light); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
.l-step-icon :deep(svg) { width:22px; height:22px; }
.l-step-n { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:6px; margin-bottom:10px; }
.l-step-n::after { content:''; width:22px; height:2px; background:var(--border); border-radius:2px; }
.l-step-title { font-size:16px; font-weight:700; color:var(--text); margin-bottom:7px; }
.l-step-desc  { font-size:13px; color:var(--text-muted); line-height:1.75; }

/* ── Chips ── */
.l-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:44px; }
.l-chip { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:7px 14px; transition:color .15s,background .15s,border-color .15s; }
.l-chip:hover { color:var(--accent); background:var(--accent-light); border-color:transparent; }
.l-chip-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.l-chip-sub { font-size:10px; color:var(--text-muted); opacity:.6; }

/* ── Privacy ── */
.l-privacy-wrap { background:var(--bg-secondary); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.l-privacy-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; margin-bottom:28px; }
.l-privacy-card { display:flex; align-items:flex-start; gap:16px; background:var(--bg-card); border:1px solid var(--border); border-radius:18px; padding:20px; transition:border-color .18s,transform .2s; }
.l-privacy-card:hover { border-color:var(--accent); transform:translateY(-2px); }
.l-privacy-icon { width:40px; height:40px; flex-shrink:0; background:var(--accent-light); border-radius:12px; display:flex; align-items:center; justify-content:center; }
.l-privacy-icon :deep(svg) { width:18px; height:18px; }
.l-privacy-body { flex:1; }
.l-privacy-title { font-size:14px; font-weight:700; color:var(--text); margin-bottom:5px; }
.l-privacy-desc  { font-size:12px; color:var(--text-muted); line-height:1.65; }

.l-ppb { display:flex; align-items:flex-start; gap:18px; background:var(--accent-light); border:1px solid var(--border); border-radius:20px; padding:24px 28px; }
.l-ppb-icon { width:48px; height:48px; flex-shrink:0; background:var(--bg-card); border-radius:14px; display:flex; align-items:center; justify-content:center; }
.l-ppb-icon :deep(svg) { width:22px; height:22px; }
.l-ppb-title { font-size:15px; font-weight:700; color:var(--text); margin-bottom:7px; }
.l-ppb-text  { font-size:13px; color:var(--text-muted); line-height:1.75; }

/* ── Quote ── */
.l-quote-wrap { padding:110px 20px; text-align:center; position:relative; overflow:hidden; }
.l-quote-bg { position:absolute; top:10px; left:50%; transform:translateX(-50%); font-size:220px; font-weight:900; color:var(--bg-card); line-height:1; pointer-events:none; user-select:none; z-index:0; }
.l-quote-text { font-size:clamp(18px,3.5vw,30px); font-weight:700; letter-spacing:-.3px; line-height:1.55; color:var(--text); max-width:640px; margin:0 auto 18px; position:relative; z-index:1; }
.l-quote-author { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); position:relative; z-index:1; }

/* ── FAQ ── */
.l-faq-list { max-width: 680px; display:flex; flex-direction:column; gap:10px; }
.l-faq-item { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; cursor:pointer; overflow:hidden; transition:border-color .15s; }
.l-faq-item.open, .l-faq-item:hover { border-color:var(--accent); }
.l-faq-q { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 22px; font-size:14px; font-weight:700; color:var(--text); user-select:none; }
.l-faq-chevron { flex-shrink:0; color:var(--text-muted); transition:transform 0.25s, color 0.15s; }
.l-faq-item.open .l-faq-chevron { transform:rotate(180deg); color:var(--accent); }
.l-faq-a { padding:0 22px 18px; font-size:13px; color:var(--text-muted); line-height:1.75; }
.l-faq-enter-active, .l-faq-leave-active { transition:opacity 0.2s, transform 0.2s; }
.l-faq-enter-from, .l-faq-leave-to { opacity:0; transform:translateY(-6px); }

/* ── CTA ── */
.l-cta-wrap { padding:96px 20px 120px; text-align:center; background:var(--bg-secondary); border-top:1px solid var(--border); position:relative; overflow:hidden; }
.l-cta-glow { position:absolute; top:30%; left:50%; transform:translate(-50%,-50%); width:480px; height:280px; background:radial-gradient(ellipse, color-mix(in srgb, var(--accent) 10%, transparent) 0%,transparent 65%); pointer-events:none; }
.l-cta-note { margin-top:16px; font-size:12px; color:var(--text-muted); }

/* ── Footer ── */
.l-footer { padding:28px 24px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
.l-footer-logo { display:flex; align-items:center; gap:7px; }
.l-footer-nav { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
.l-footer-nav a { font-size:12px; font-weight:600; color:var(--text-muted); text-decoration:none; cursor:pointer; transition:color 0.15s; }
.l-footer-nav a:hover { color:var(--accent); }
.l-footer-copy { font-size:11px; color:var(--text-muted); }

/* ── Mobile ── */
@media (max-width: 640px) {
  .l-header { padding: 14px 16px; }
  .l-nav    { display: none; }
  .l-cta    { display: none; }
  .l-hero   { padding: 110px 16px 80px; }
  .l-burger { display: flex; }
  .l-footer { flex-direction: column; align-items: flex-start; gap: 12px; }
  .l-ppb    { flex-direction: column; gap: 12px; }
}
</style>