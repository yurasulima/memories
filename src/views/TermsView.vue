<template>
  <div class="legal-page">

    <!-- ── HEADER ── -->
    <header class="l-header" :class="{ scrolled: isScrolled }">
      <router-link to="/" class="l-logo" style="text-decoration:none;">
        <IconHeart :size="20" :filled="true" class="l-logo-icon" />
        <span class="l-logo-text">Memories</span>
      </router-link>
      <nav class="l-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/privacy">Privacy Policy</router-link>
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
      <div class="l-eyebrow">Legal</div>
      <h1 class="legal-title">Terms of <span class="l-accent">Service</span></h1>
      <p class="legal-sub">Last updated: {{ lastUpdated }}</p>
    </section>

    <!-- ── CONTENT ── -->
    <div class="legal-body">

      <div class="legal-alert">
        <div class="legal-alert-icon">
          <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M8 13l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div class="legal-alert-title">Plain language summary</div>
          <div class="legal-alert-text">By using Memories you agree to these terms. The short version: be respectful, don't misuse the service, and your content belongs to you.</div>
        </div>
      </div>

      <div class="legal-section">
        <div class="legal-section-num">01</div>
        <h2 class="legal-section-title">Acceptance of Terms</h2>
        <p class="legal-p">By creating an account or using the Memories application, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the service.</p>
        <p class="legal-p">We may update these terms from time to time. Continued use of the service after changes constitutes your acceptance of the new terms.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">02</div>
        <h2 class="legal-section-title">Your Account</h2>
        <p class="legal-p">You are responsible for maintaining the security of your account and password. Memories cannot and will not be liable for any loss or damage from your failure to keep your account secure.</p>
        <ul class="legal-list">
          <li>You must be at least 13 years old to use Memories</li>
          <li>You are responsible for all activity that occurs under your account</li>
          <li>You may not use another person's account without permission</li>
          <li>You must provide accurate information when creating your account</li>
        </ul>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">03</div>
        <h2 class="legal-section-title">Your Content</h2>
        <p class="legal-p">You retain full ownership of the content you create in Memories — your posts, memories, dates, and media. We do not claim ownership of your content.</p>
        <p class="legal-p">By uploading content, you grant Memories a limited license to store and display that content solely for the purpose of providing the service to you.</p>
        <div class="legal-cards">
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="legal-card-title">You own it</div>
            <div class="legal-card-desc">All content you create belongs to you. We just store it.</div>
          </div>
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="9"/><path d="M4.9 4.9l12.2 12.2"/></svg>
            </div>
            <div class="legal-card-title">We don't sell it</div>
            <div class="legal-card-desc">Your content is never sold or shared with advertisers.</div>
          </div>
          <div class="legal-card">
            <div class="legal-card-icon">
              <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H6a2 2 0 01-2-2L3 6"/><path d="M8 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </div>
            <div class="legal-card-title">Delete anytime</div>
            <div class="legal-card-desc">You can delete any content or your entire account at any time.</div>
          </div>
        </div>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">04</div>
        <h2 class="legal-section-title">Acceptable Use</h2>
        <p class="legal-p">You agree not to use Memories to:</p>
        <ul class="legal-list">
          <li>Post content that is illegal, harmful, or violates others' rights</li>
          <li>Attempt to gain unauthorized access to our systems or other accounts</li>
          <li>Reverse-engineer, scrape, or abuse the API</li>
          <li>Impersonate another person or entity</li>
          <li>Use the service for any commercial purpose without our consent</li>
        </ul>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">05</div>
        <h2 class="legal-section-title">Service Availability</h2>
        <p class="legal-p">Memories is provided "as is" and "as available." We strive for high uptime but do not guarantee uninterrupted access to the service. We may suspend or discontinue the service with reasonable notice.</p>
        <p class="legal-p">We are not liable for any data loss resulting from outages or technical failures, though we take regular backups to minimize this risk.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">06</div>
        <h2 class="legal-section-title">Account Termination</h2>
        <p class="legal-p">You may delete your account at any time from the Settings page. Upon deletion, all your content will be permanently removed from our servers within 30 days.</p>
        <p class="legal-p">We reserve the right to suspend or terminate accounts that violate these Terms of Service, with or without prior notice depending on the severity of the violation.</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">07</div>
        <h2 class="legal-section-title">Limitation of Liability</h2>
        <p class="legal-p">To the maximum extent permitted by law, Memories shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
        <p class="legal-p">Our total liability for any claims related to the service is limited to the amount you paid us in the past 12 months (if any).</p>
      </div>

      <div class="legal-divider"></div>

      <div class="legal-section">
        <div class="legal-section-num">08</div>
        <h2 class="legal-section-title">Contact</h2>
        <p class="legal-p">Questions about these Terms of Service? Reach out to us:</p>
        <div class="legal-contact">
          <svg viewBox="0 0 22 22" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 11,13 0,6"/></svg>
          <a href="mailto:legal@mblueberry.space" class="legal-link">legal@mblueberry.space</a>
        </div>
      </div>

      <div class="legal-footer-links">
        <router-link to="/privacy" class="legal-pill">Privacy Policy →</router-link>
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

.legal-section { position: relative; }
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

.legal-contact {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 14px; padding: 14px 20px; margin-top: 14px;
}
.legal-contact svg { width: 18px; height: 18px; flex-shrink: 0; }
.legal-link { font-size: 14px; font-weight: 600; color: var(--accent); text-decoration: none; }
.legal-link:hover { text-decoration: underline; }

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