<template>
  <div class="landing">

    <!-- ── HEADER ── -->
    <header class="l-header" :class="{ scrolled: isScrolled }">
      <div class="l-logo">
        <IconHeart :size="20" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text">Memories</span>
      </div>
      <nav class="l-nav">
        <a href="#features" @click.prevent="scrollTo('features')">Функції</a>
        <a href="#how"      @click.prevent="scrollTo('how')">Як це працює</a>
        <a href="#start"    @click.prevent="scrollTo('start')">Початок</a>
      </nav>
      <router-link to="/app" class="btn-accent l-cta">
        Відкрити
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"/>
        </svg>
      </router-link>
    </header>

    <!-- ── HERO ── -->
    <section class="l-hero">
      <div class="l-hero-glow"></div>
      <div class="l-particles">
        <div v-for="p in particles" :key="p.id" class="l-p-dot" :style="p.style"></div>
      </div>

      <div class="l-badge">
        <span class="l-badge-dot"></span>
        Щоденник для двох
      </div>

      <h1 class="l-title">
        Зберігайте<br/>
        <span class="l-accent">кожен момент</span>
      </h1>
      <p class="l-subtitle">разом, для себе, назавжди</p>
      <p class="l-desc">
        Memories — приватний простір для пари. Ведіть хроніку спільного життя: пости, фото, фільми, аніме та важливі дати.
      </p>

      <div class="l-hero-btns">
        <router-link to="/app" class="btn-accent" style="font-size:15px;padding:14px 28px;">
          Почати зараз
        </router-link>
        <a href="#features" class="btn-outline" @click.prevent="scrollTo('features')">
          Дізнатись більше
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6.5 2v9M2 7l4.5 4 4.5-4"/>
          </svg>
        </a>
      </div>

      <div class="l-scroll-hint">
        <div class="l-scroll-line"></div>
        <span>scroll</span>
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
            <span class="lm-group">Ми</span>
          </div>

          <div class="lm-search">
            <span>🔍</span>
            <span class="lm-search-ph">Пошук постів, контенту, дат...</span>
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
                <span :class="['lm-badge', item.type]">{{ contentLabel(item.type) }}</span>
                <span class="lm-name">{{ item.name }}</span>
                <span v-if="item.ep" class="lm-ep">{{ item.ep }}</span>
              </div>
              <div class="lm-actions">
                <span class="lm-abtn">+ Пост</span>
                <span class="lm-abtn">+ Дата</span>
                <span class="lm-abtn">+ Контент</span>
              </div>
            </div>
          </div>

          <div class="lm-nav">
            <div class="lm-nav-item active">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--accent)"><path d="M8 1L1 7h2v7h4v-4h2v4h4V7h2z"/></svg>
              <span style="color:var(--accent)">Стрічка</span>
            </div>
            <div class="lm-nav-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" stroke-width="1.5">
                <rect x="2" y="8" width="3" height="6" rx="1"/>
                <rect x="6.5" y="5" width="3" height="9" rx="1"/>
                <rect x="11" y="2" width="3" height="12" rx="1"/>
              </svg>
              <span>Статистика</span>
            </div>
            <div class="lm-nav-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" stroke-width="1.4" stroke-linecap="round">
                <circle cx="8" cy="8" r="2"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M11.4 4.6l-1.4 1.4M4.6 11.4L3.2 12.8"/>
              </svg>
              <span>Налаштування</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ── FEATURES ── -->
    <section id="features" class="l-section">
      <p class="l-eyebrow">Можливості</p>
      <h2 class="l-stitle">Все для вашої <span class="l-accent">спільної хроніки</span></h2>
      <p class="l-ssub">Від тексту до фото, від фільмів до важливих дат — один застосунок для всього вашого спільного життя.</p>

      <div class="l-feat-grid">
        <div v-for="f in features" :key="f.title" class="l-feat-card">
          <div class="l-feat-icon" v-html="f.icon"></div>
          <div class="l-feat-title">{{ f.title }}</div>
          <div class="l-feat-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <div id="how" class="l-how-wrap">
      <div class="l-section">
        <p class="l-eyebrow">Як це працює</p>
        <h2 class="l-stitle">Три кроки і ви <span class="l-accent">вже в темі</span></h2>
        <div class="l-steps">
          <div v-for="s in steps" :key="s.n" class="l-step">
            <div class="l-step-n">Крок {{ s.n }}</div>
            <div class="l-step-title">{{ s.title }}</div>
            <div class="l-step-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CONTENT TYPES ── -->
    <section class="l-section">
      <p class="l-eyebrow">Що можна зберігати</p>
      <h2 class="l-stitle">Кожна деталь <span class="l-accent">вашого спільного життя</span></h2>
      <div class="l-chips">
        <div v-for="chip in chips" :key="chip.label" class="l-chip">
          <div class="l-chip-dot" :style="{ background: chip.color }"></div>
          <span>{{ chip.label }}</span>
          <span class="l-chip-sub">{{ chip.sub }}</span>
        </div>
      </div>
    </section>

    <!-- ── QUOTE ── -->
    <section class="l-quote-wrap">
      <div class="l-quote-bg">❝</div>
      <p class="l-quote-text">
        Маленькі моменти — це і є ваша спільна <span class="l-accent">історія</span>.<br/>
        Не втрачайте жодного з них.
      </p>
      <p class="l-quote-author">Memories — для тих, хто цінує кожен день</p>
    </section>

    <!-- ── CTA ── -->
    <section id="start" class="l-cta-wrap">
      <div class="l-cta-glow"></div>
      <h2 class="l-stitle" style="font-size:clamp(30px,6vw,56px);margin-bottom:14px;">
        Починається<br/><span class="l-accent">сьогодні</span>
      </h2>
      <p class="l-ssub" style="max-width:100%;margin-bottom:40px;">
        Створіть свій перший день і почніть будувати архів вашої любові.
      </p>
      <router-link to="/app" class="btn-accent" style="font-size:15px;padding:14px 32px;">
        Відкрити Memories
        <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"/>
        </svg>
      </router-link>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="l-footer">
      <div class="l-footer-logo">
        <IconHeart :size="16" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text" style="font-size:14px;">Memories</span>
      </div>
      <span class="l-footer-copy">Тільки для вас двох ♥</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconHeart from '../components/icons/IconHeart.vue'

// ── Header scroll shrink ──────────────────────────────────────────────────────
const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 50 }

// ── Smooth scroll helper ─────────────────────────────────────────────────────
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── Floating particles ────────────────────────────────────────────────────────
const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  style: {
    width:  (2 + Math.random() * 5) + 'px',
    height: (2 + Math.random() * 5) + 'px',
    left:   (Math.random() * 100) + '%',
    bottom: (Math.random() * 15) + '%',
    animationDuration:  (9  + Math.random() * 12) + 's',
    animationDelay:     (Math.random() * 12) + 's',
  }
}))

// ── Mock phone data ───────────────────────────────────────────────────────────
const mockDays = [
  {
    day: 13, mo: 'БЕР.', wd: 'Пт', full: '13 Березня 2026 р.',
    items: [{ type: 'film', name: 'House of Wax' }]
  },
  {
    day: 12, mo: 'БЕР.', wd: 'Чт', full: '12 Березня 2026 р.',
    items: [
      { type: 'series', name: 'Friends' },
      { type: 'series', name: 'The boys', ep: 'ep.3 s1' }
    ]
  },
  {
    day: 11, mo: 'БЕР.', wd: 'Ср', full: '11 Березня 2026 р.',
    items: [{ type: 'cartoon', name: 'Carol & The End...', ep: 'ep.4 s1' }]
  },
]

const contentLabel = (type) =>
  ({ film: 'Фільм', hentai: 'Хентай', cartoon: 'Мультик', anime: 'Аніме', series: 'Серіал' }[type] || type)

// ── Features ──────────────────────────────────────────────────────────────────
const features = [
  {
    title: 'Стрічка спогадів',
    desc:  'Хронологічна лента з усіма вашими днями. Прокручуй назад і переживай найкращі моменти знову.',
    icon:  `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20S3 14.5 3 8.5a8 8 0 0116 0C19 14.5 11 20 11 20z"/></svg>`
  },
  {
    title: 'Важливі дати',
    desc:  'Зберігайте річниці та особливі події. Позначайте одноразові або щорічні — застосунок не забуде.',
    icon:  `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="16" height="14" rx="2"/><path d="M7 2v4M15 2v4M3 10h16"/></svg>`
  },
  {
    title: 'Контент разом',
    desc:  'Фільми, серіали, аніме, мультики. Відслідковуйте що дивитесь разом — з епізодами та сезонами.',
    icon:  `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="18" height="14" rx="2"/><path d="M8 21h6M11 17v4"/><path d="M7 10l3 2.5L15 7"/></svg>`
  },
  {
    title: 'Пости з медіа',
    desc:  'Текст, фото та відео до кожного дня. Приватно для себе або видимо для обох.',
    icon:  `<svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`
  },
]

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { n: '01', title: 'Створіть групу',        desc: 'Зареєструйтесь і запросіть партнера. Разом ви отримуєте спільний простір, доступний тільки вам двом.' },
  { n: '02', title: 'Додайте перший день',    desc: 'Натисніть «+» і оберіть дату. Додайте пост, фото, відмітьте що дивились — заповніть день своїми словами.' },
  { n: '03', title: 'Повертайтесь і згадуйте', desc: 'Прокручуйте стрічку або шукайте за словами і датами. Кожен спогад чекає на вас — завжди.' },
]

// ── Chips ─────────────────────────────────────────────────────────────────────
const chips = [
  { label: 'Аніме',          sub: 'з епізодами',       color: 'var(--anime-text)'   },
  { label: 'Серіали',        sub: 'сезони та серії',   color: 'var(--series-text)'  },
  { label: 'Фільми',         sub: 'вдома чи в кіно',   color: 'var(--film-text)'    },
  { label: 'Мультфільми',    sub: 'та хентай',         color: 'var(--cartoon-text)' },
  { label: 'Важливі дати',   sub: 'річниці та події',  color: 'var(--accent)'       },
  { label: 'Фото та відео',  sub: 'у постах до дня',   color: 'var(--accent-hover)' },
  { label: 'Текстові нотатки', sub: 'думки та почуття', color: '#9ab8f0'            },
]

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ════════════════════════════════════════════════
   Всі стилі через CSS-змінні з App.vue — нічого
   не хардкодимо, автоматично підтримує всі теми.
   ════════════════════════════════════════════════ */

.landing {
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Header ── */
.l-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 14px;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: padding 0.25s;
  max-width: 100%;
}
.l-header.scrolled { padding: 11px 20px; }

.l-logo { display: flex; align-items: center; gap: 9px; }
.l-logo-icon { color: var(--accent); }
.l-logo-text {
  font-size: 19px; font-weight: 800; letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.l-nav { display: flex; align-items: center; gap: 24px; }
.l-nav a {
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  text-decoration: none; transition: color 0.2s; cursor: pointer;
}
.l-nav a:hover { color: var(--text); }

/* mirrors .btn-accent from App.vue */
.btn-accent {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--accent); color: white;
  font-size: 13px; font-weight: 700;
  padding: 10px 20px; border-radius: 14px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-accent:active { transform: scale(0.96); }

/* mirrors .card-action-btn from HomeView.vue */
.btn-outline {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 10px 20px;
  text-decoration: none; cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.btn-outline:hover { color: var(--accent); background: var(--accent-light); border-color: transparent; }

/* ── Hero ── */
.l-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 130px 20px 90px; position: relative; overflow: hidden;
}
.l-hero-glow {
  position: absolute; top: 38%; left: 50%;
  transform: translate(-50%, -50%);
  width: 500px; height: 500px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 65%);
  pointer-events: none;
  animation: glow-breathe 6s ease-in-out infinite;
}
@keyframes glow-breathe {
  0%,100% { opacity: .6; transform: translate(-50%,-50%) scale(1); }
  50%      { opacity: 1;  transform: translate(-50%,-50%) scale(1.1); }
}

.l-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.l-p-dot {
  position: absolute; border-radius: 50%; background: var(--accent);
  opacity: 0; animation: pdotup linear infinite;
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
  color: var(--accent); margin-bottom: 28px;
  animation: l-fadeup .7s ease both;
}
.l-badge-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
  animation: l-blink 2s ease-in-out infinite;
}
@keyframes l-blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }

.l-title {
  font-size: clamp(42px,9vw,84px); font-weight: 900;
  letter-spacing: -2px; line-height: 1; color: var(--text);
  margin-bottom: 8px; animation: l-fadeup .7s .1s ease both;
}
.l-accent {
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.l-subtitle {
  font-size: clamp(15px,3vw,21px); font-weight: 500; color: var(--text-muted);
  margin-bottom: 32px; animation: l-fadeup .7s .18s ease both;
}
.l-desc {
  max-width: 430px; font-size: 14px; color: var(--text-muted); line-height: 1.8;
  margin-bottom: 42px; animation: l-fadeup .7s .26s ease both;
}
.l-hero-btns {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center;
  animation: l-fadeup .7s .34s ease both;
}
.l-scroll-hint {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: var(--text-muted); font-size: 10px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  animation: l-fadeup .8s 1s ease both;
}
.l-scroll-line {
  width: 1px; height: 32px;
  background: linear-gradient(to bottom, var(--border), transparent);
  animation: l-slblink 2s ease-in-out infinite;
}
@keyframes l-slblink { 0%,100%{opacity:.4;} 50%{opacity:1;} }
@keyframes l-fadeup { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

/* ── Phone mockup ── */
.l-mockup-wrap {
  display: flex; justify-content: center;
  padding: 0 20px 100px; position: relative;
}
.l-mockup-glow {
  position: absolute; top: 40%; left: 50%; transform: translate(-50%,-50%);
  width: 340px; height: 340px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 60%);
  pointer-events: none;
}
.l-phone {
  width: 290px; background: var(--bg-secondary);
  border-radius: 44px; border: 1.5px solid var(--border); overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,.5), 0 0 0 6px rgba(255,255,255,.02);
  position: relative;
}
.l-phone::before {
  content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  width: 74px; height: 20px; background: var(--bg); border-radius: 20px; z-index: 10;
}
.l-phone-screen { padding: 44px 14px 0; display: flex; flex-direction: column; }

/* phone internals — mirror exact app CSS */
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
.lm-nav { display:flex; justify-content:space-evenly; background:var(--nav-bg); border-top:1px solid var(--border); padding:8px 0 14px; margin:6px -14px 0; }
.lm-nav-item { display:flex; flex-direction:column; align-items:center; gap:2px; }
.lm-nav-item span { font-size:7px; font-weight:600; color:var(--text-muted); }

/* ── Sections ── */
.l-section { padding: 96px 20px; max-width: 960px; margin: 0 auto; }

.l-eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.l-eyebrow::before { content:''; width:18px; height:2px; background:var(--accent); border-radius:2px; }
.l-stitle { font-size:clamp(26px,5vw,44px); font-weight:800; letter-spacing:-1px; line-height:1.1; color:var(--text); margin-bottom:14px; }
.l-ssub   { font-size:14px; color:var(--text-muted); line-height:1.8; max-width:430px; margin-bottom:50px; }

/* ── Features ── */
.l-feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; }
.l-feat-card {
  background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:26px 22px;
  transition:box-shadow .18s,border-color .18s,transform .2s;
}
.l-feat-card:hover { box-shadow:0 4px 20px var(--shadow); border-color:var(--accent); transform:translateY(-3px); }
.l-feat-icon { width:42px; height:42px; background:var(--accent-light); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
.l-feat-icon :deep(svg) { width:20px; height:20px; }
.l-feat-title { font-size:15px; font-weight:700; color:var(--text); margin-bottom:7px; }
.l-feat-desc  { font-size:12px; color:var(--text-muted); line-height:1.7; }

/* ── How it works ── */
.l-how-wrap { background:var(--bg-secondary); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.l-steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:36px; margin-top:50px; }
.l-step-n { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:6px; margin-bottom:10px; }
.l-step-n::after { content:''; width:22px; height:2px; background:var(--border); border-radius:2px; }
.l-step-title { font-size:16px; font-weight:700; color:var(--text); margin-bottom:7px; }
.l-step-desc  { font-size:13px; color:var(--text-muted); line-height:1.75; }

/* ── Chips ── */
.l-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:44px; }
.l-chip {
  display:flex; align-items:center; gap:8px;
  font-size:12px; font-weight:600; color:var(--text-muted);
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:20px; padding:7px 14px;
  transition:color .15s,background .15s,border-color .15s;
}
.l-chip:hover { color:var(--accent); background:var(--accent-light); border-color:transparent; }
.l-chip-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.l-chip-sub { font-size:10px; color:var(--text-muted); opacity:.6; }

/* ── Quote ── */
.l-quote-wrap { padding:110px 20px; text-align:center; position:relative; overflow:hidden; }
.l-quote-bg { position:absolute; top:10px; left:50%; transform:translateX(-50%); font-size:220px; font-weight:900; color:var(--bg-card); line-height:1; pointer-events:none; user-select:none; z-index:0; }
.l-quote-text { font-size:clamp(18px,3.5vw,30px); font-weight:700; letter-spacing:-.3px; line-height:1.55; color:var(--text); max-width:640px; margin:0 auto 18px; position:relative; z-index:1; }
.l-quote-author { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); position:relative; z-index:1; }

/* ── CTA ── */
.l-cta-wrap { padding:96px 20px 120px; text-align:center; background:var(--bg-secondary); border-top:1px solid var(--border); position:relative; overflow:hidden; }
.l-cta-glow { position:absolute; top:30%; left:50%; transform:translate(-50%,-50%); width:480px; height:280px; background:radial-gradient(ellipse, color-mix(in srgb, var(--accent) 10%, transparent) 0%,transparent 65%); pointer-events:none; }

/* ── Footer ── */
.l-footer { padding:24px 20px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.l-footer-logo { display:flex; align-items:center; gap:7px; }
.l-footer-copy { font-size:11px; color:var(--text-muted); }

/* ── Mobile ── */
@media (max-width: 600px) {
  .l-header { padding: 14px 16px; }
  .l-nav    { display: none; }
  .l-cta    { display: none; }
  .l-hero   { padding: 110px 16px 80px; }
}
</style>
