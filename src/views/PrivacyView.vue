<template>
  <div class="legal-page">

    <!-- ── HEADER ── -->
    <header class="l-header" :class="{ scrolled: isScrolled }">
      <router-link to="/" class="l-logo" style="text-decoration:none;">
        <IconHeart :size="20" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text">Memories</span>
      </router-link>
      <nav class="l-nav">
        <router-link to="/">{{ $t('nav.features') }}</router-link>
        <router-link to="/terms">Terms of Service</router-link>
      </nav>
      <router-link to="/app" class="btn-accent l-cta">
        {{ $t('nav.open') }}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"/>
        </svg>
      </router-link>
    </header>

    <!-- ── HERO ── -->
    <section class="legal-hero">
      <div class="legal-hero-glow"></div>
      <div class="l-eyebrow">Privacy</div>
      <h1 class="legal-title">Privacy <span class="l-accent">Policy</span></h1>
      <p class="legal-sub">Last updated: {{ lastUpdated }}</p>
    </section>

    <!-- ── CONTENT ── -->
    <div class="legal-body">

      <div class="legal-alert">
        <div class="legal-alert-icon">
          <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-4z"/>
            <path d="M8 11l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div class="legal-alert-title">Your privacy is our priority</div>
          <div class="legal-alert-text">Memories is a private journaling app. We collect only what's necessary to make the service work, and we never sell your data.</div>
        </div>
      </div>

      <div class="legal-section">
        <div class="legal-section-num">01</div>
        <h2 class="legal-section-title">Information We Collect</h2>
        <p class="legal-p">When you create an account, we collect your name, username, and email address. If you sign in with Google, we receive your public profile information from Google.</p>
        <p class="legal-p">Content you create — posts, memories, dates, and media — is stored on our servers to provide you with the service across devices.</p>
        <div class="legal-cards">
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="8" r="4"/><path d="M3 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div class="legal-card-title">Account Data</div>
            <div class="legal-card-desc">Name, username, email address, and optionally your Google account ID.</div>
          </div>
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <div class="legal-card-title">Content Data</div>
            <div class="legal-card-desc">Posts, memories, dates, photos, and videos you create within the app.</div>
          </div>
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="18" height="14" rx="2"/><path d="M8 21h6M11 17v4"/><path d="M7 10l3 2.5L15 7"/></svg>
            </div>
            <div class="legal-card-title">Usage Data</div>
            <div class="legal-card-desc">Basic technical logs needed to keep the service running and secure.</div>
          </div>
        </div>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">02</div>
        <h2 class="legal-section-title">How We Use Your Information</h2>
        <p class="legal-p">We use your information solely to provide and improve the Memories service. We do not use your content for advertising, analytics products, or machine learning training.</p>
        <ul class="legal-list">
          <li>To authenticate you and keep your account secure</li>
          <li>To sync your memories across your devices</li>
          <li>To send important service notifications (e.g. security alerts)</li>
          <li>To respond to your support requests</li>
        </ul>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">03</div>
        <h2 class="legal-section-title">Data Sharing</h2>
        <p class="legal-p">We do not sell, rent, or share your personal data with third parties for marketing purposes — ever. Your memories are private by design.</p>
        <p class="legal-p">We may share data only in the following limited cases: with members of a shared group you have explicitly joined, with service providers (e.g. cloud hosting) under strict confidentiality agreements, or when required by law.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">04</div>
        <h2 class="legal-section-title">Data Security</h2>
        <p class="legal-p">All communication between your device and our servers is encrypted using HTTPS. Passwords are hashed using industry-standard algorithms and are never stored in plain text.</p>
        <p class="legal-p">Authentication tokens (JWT) are stored locally on your device and are not accessible to other parties.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">05</div>
        <h2 class="legal-section-title">Your Rights</h2>
        <p class="legal-p">You have full control over your data. At any time you can:</p>
        <ul class="legal-list">
          <li>Access and export all your data</li>
          <li>Edit or delete individual memories, posts, and content</li>
          <li>Delete your account and all associated data permanently</li>
          <li>Request a copy of your data by contacting us</li>
        </ul>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">06</div>
        <h2 class="legal-section-title">Cookies</h2>
        <p class="legal-p">Memories does not use advertising or tracking cookies. We store your authentication token in your browser's <code class="legal-code">localStorage</code> to keep you logged in between sessions.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">07</div>
        <h2 class="legal-section-title">Contact Us</h2>
        <p class="legal-p">If you have any questions about this Privacy Policy or your data, please contact us at:</p>
        <div class="legal-contact">
          <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 11,13 0,6"/></svg>
          <a href="mailto:privacy@mblueberry.space" class="legal-link">privacy@mblueberry.space</a>
        </div>
      </div>

      <div class="legal-footer-links">
        <router-link to="/terms" class="legal-pill">Terms of Service →</router-link>
        <router-link to="/" class="legal-pill">Back to Home →</router-link>
      </div>

    </div>

    <!-- ── FOOTER ── -->
    <footer class="l-footer">
      <div class="l-footer-logo">
        <IconHeart :size="16" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text" style="font-size:14px;">Memories</span>
      </div>
      <nav class="l-footer-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/privacy">Privacy Policy</router-link>
        <router-link to="/terms">Terms of Service</router-link>
      </nav>
      <span class="l-footer-copy">© {{ year }} Memories. All rights reserved.</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconHeart from '../components/icons/IconHeart.vue'

const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 50 }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const year = new Date().getFullYear()
const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<style scoped>
/* ── Shared header/footer from Landing ── */
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
.l-nav a { font-size: 13px; font-weight: 600; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.l-nav a:hover { color: var(--text); }
.btn-accent {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--accent); color: white;
  font-size: 13px; font-weight: 700;
  padding: 10px 20px; border-radius: 14px; text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); }

.l-eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
.l-eyebrow::before { content:''; width:18px; height:2px; background:var(--accent); border-radius:2px; }
.l-accent {
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.l-footer { padding:28px 24px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
.l-footer-logo { display:flex; align-items:center; gap:7px; }
.l-footer-nav { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
.l-footer-nav a { font-size:12px; font-weight:600; color:var(--text-muted); text-decoration:none; transition:color 0.15s; }
.l-footer-nav a:hover { color:var(--accent); }
.l-footer-copy { font-size:11px; color:var(--text-muted); }

/* ── Page layout ── */
.legal-page { min-height: 100vh; background: var(--bg); overflow-x: hidden; }

.legal-hero {
  padding: 140px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}
.legal-hero-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 500px; height: 300px;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 65%);
  pointer-events: none;
}
.legal-title {
  font-size: clamp(36px, 7vw, 64px);
  font-weight: 900; letter-spacing: -2px; line-height: 1.05;
  color: var(--text); margin-bottom: 16px;
}
.legal-sub { font-size: 13px; color: var(--text-muted); }

.legal-body {
  max-width: 760px; margin: 0 auto;
  padding: 72px 24px 80px;
  display: flex; flex-direction: column; gap: 0;
}

/* Alert box */
.legal-alert {
  display: flex; align-items: flex-start; gap: 18px;
  background: var(--accent-light); border: 1px solid var(--border);
  border-radius: 20px; padding: 24px 28px; margin-bottom: 52px;
}
.legal-alert-icon {
  width: 48px; height: 48px; flex-shrink: 0;
  background: var(--bg-card); border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.legal-alert-icon svg { width: 22px; height: 22px; }
.legal-alert-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.legal-alert-text { font-size: 13px; color: var(--text-muted); line-height: 1.7; }

/* Sections */
.legal-section { position: relative; padding-left: 0; }
.legal-section-num {
  font-size: 56px; font-weight: 900; letter-spacing: -2px;
  color: var(--border); line-height: 1; margin-bottom: -12px;
  user-select: none; pointer-events: none;
}
.legal-section-title {
  font-size: clamp(20px, 3.5vw, 26px); font-weight: 800;
  letter-spacing: -0.5px; color: var(--text); margin-bottom: 16px;
}
.legal-p {
  font-size: 14px; color: var(--text-muted); line-height: 1.85;
  margin-bottom: 14px;
}
.legal-p:last-child { margin-bottom: 0; }

.legal-list {
  list-style: none; padding: 0; margin: 14px 0 0;
  display: flex; flex-direction: column; gap: 10px;
}
.legal-list li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; color: var(--text-muted); line-height: 1.65;
}
.legal-list li::before {
  content: '';
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0; margin-top: 7px;
}

.legal-divider {
  height: 1px; background: var(--border);
  margin: 48px 0;
}

/* Cards */
.legal-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px; margin-top: 24px;
}
.legal-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 18px; padding: 20px;
  transition: border-color 0.18s, transform 0.2s;
}
.legal-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.legal-card-icon {
  width: 38px; height: 38px; background: var(--accent-light);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.legal-card-icon svg { width: 18px; height: 18px; }
.legal-card-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.legal-card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.65; }

/* Contact */
.legal-contact {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 14px; padding: 14px 20px; margin-top: 14px;
}
.legal-contact svg { width: 18px; height: 18px; flex-shrink: 0; }
.legal-link { font-size: 14px; font-weight: 600; color: var(--accent); text-decoration: none; }
.legal-link:hover { text-decoration: underline; }

.legal-code {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 6px; padding: 2px 7px;
  font-size: 12px; color: var(--accent); font-family: monospace;
}

/* Footer links */
.legal-footer-links {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 52px;
}
.legal-pill {
  display: inline-flex; align-items: center;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 100px; padding: 9px 18px;
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  text-decoration: none; transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.legal-pill:hover { color: var(--accent); background: var(--accent-light); border-color: transparent; }

@media (max-width: 640px) {
  .l-header { padding: 14px 16px; }
  .l-nav { display: none; }
  .l-cta { display: none; }
  .legal-body { padding: 48px 16px 64px; }
  .legal-alert { flex-direction: column; gap: 12px; }
  .l-footer { flex-direction: column; align-items: flex-start; }
}
</style>