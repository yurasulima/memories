<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useGroupsStore } from '@/stores/group'
import type { MemoriesRegisterRequest } from '@/api/models'
import IconHeart from '../components/icons/IconHeart.vue'
import IconEye from '../components/icons/IconEye.vue'
import IconEyeOff from '../components/icons/IconEyeOff.vue'
import type { AxiosError } from 'axios'
import { googleSdkLoaded } from 'vue3-google-login'

type Tab = 'login' | 'register'

interface AuthForm {
  fullName: string
  username: string
  email: string
  password: string
}

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const groupsStore = useGroupsStore()

const tab = ref<Tab>('login')
const showPass = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string>('')

const form = ref<AuthForm>({
  fullName: '',
  username: '',
  email: '',
  password: ''
})

const DEMO_EMAIL = 'demo@memories.app'
const DEMO_PASSWORD = 'demo1234'

const CLIENT_ID = '280444808440-eho58j22h1eilcp4es7ec11hpr9oavc4.apps.googleusercontent.com'

const submit = async (): Promise<void> => {
  error.value = ''
  loading.value = true
  groupsStore.reset()
  try {
    if (tab.value === 'login') {
      await auth.login(form.value.email, form.value.password)
    } else {
      const data: MemoriesRegisterRequest = {
        fullName: form.value.fullName,
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      }
      await auth.register(data)
    }
    await router.push('/app')
  } catch (e) {
    const err = e as AxiosError<{ message?: string }>
    error.value = err.response?.data?.message || t('auth.errors.default')
  } finally {
    loading.value = false
  }
}

// ────────────────────────────────
// Demo логін
const loginDemo = async (): Promise<void> => {
  error.value = ''
  loading.value = true
  groupsStore.reset()
  try {
    await auth.login(DEMO_EMAIL, DEMO_PASSWORD)
    await router.push('/app')
  } catch {
    error.value = t('auth.errors.demoUnavailable')
  } finally {
    loading.value = false
  }
}

// ────────────────────────────────
// Google One Tap ініціалізація один раз
onMounted(() => {
  googleSdkLoaded((google) => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response: any) => {
        error.value = ''
        loading.value = true
        groupsStore.reset()
        try {
          await auth.loginWithGoogle(response.credential)
          await router.push('/app')
        } catch (e) {
          const err = e as AxiosError<{ message?: string }>
          error.value = err.response?.data?.message || t('auth.errors.default')
        } finally {
          loading.value = false
        }
      }
    })
  })
})

// ────────────────────────────────
// Кнопка Google просто показує One Tap
const loginWithGoogle = (): void => {
  googleSdkLoaded((google) => {
    google.accounts.id.prompt()
  })
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <IconHeart :size="32" :filled="true"/>
        <h1>Memories</h1>
      </div>

      <div class="auth-tabs">
        <button :class="{ active: tab === 'login' }" @click="tab = 'login'">{{ $t('auth.login') }}</button>
        <button :class="{ active: tab === 'register' }" @click="tab = 'register'">{{ $t('auth.register') }}</button>
      </div>

      <form @submit.prevent="submit" class="auth-form">
        <div v-if="tab === 'register'" class="field">
          <label>{{ $t('auth.fullName') }}</label>
          <input v-model="form.fullName" type="text" :placeholder="$t('auth.fullNamePlaceholder')" required/>
        </div>
        <div v-if="tab === 'register'" class="field">
          <label>{{ $t('auth.username') }}</label>
          <input v-model="form.username" type="text" placeholder="username" required/>
        </div>
        <div class="field">
          <label>{{ $t('auth.email') }}</label>
          <input v-model="form.email" type="email" placeholder="you@example.com" required/>
        </div>
        <div class="field">
          <label>{{ $t('auth.password') }}</label>
          <div class="password-wrap">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required/>
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              <IconEye v-if="!showPass" :size="18"/>
              <IconEyeOff v-else :size="18"/>
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading">{{ $t('auth.loading') }}</span>
          <span v-else>{{ tab === 'login' ? $t('auth.submitLogin') : $t('auth.submitRegister') }}</span>
        </button>

        <div class="divider"><span>{{ $t('auth.or') }}</span></div>

        <!-- Google кнопка в стилі додатку -->
        <button type="button" class="social-btn google-btn" :disabled="loading" @click="loginWithGoogle">
          <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{{ $t('auth.or') === 'або' ? 'Продовжити з Google' : 'Continue with Google' }}</span>
        </button>

        <div class="divider"><span>{{ $t('auth.or') }}</span></div>

        <button type="button" class="demo-btn" :disabled="loading" @click="loginDemo">
          <span v-if="loading">{{ $t('auth.demoLoading') }}</span>
          <span v-else>{{ $t('auth.demoLogin') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border-radius: 24px;
  padding: 36px 32px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 40px var(--shadow);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  color: var(--accent);
}

.auth-logo h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
}

.auth-tabs {
  display: flex;
  gap: 0;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.auth-tabs button {
  flex: 1;
  padding: 8px 0;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.2s;
}

.auth-tabs button.active {
  background: var(--bg-card);
  color: var(--accent);
  box-shadow: 0 1px 4px var(--shadow);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.field input {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 15px;
  color: var(--text);
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: var(--accent);
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  width: 100%;
  padding-right: 42px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.error-msg {
  font-size: 13px;
  color: #e05555;
  text-align: center;
}

.submit-btn {
  background: var(--accent);
  color: white;
  border-radius: 12px;
  padding: 13px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 4px;
  transition: background 0.2s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ── Social кнопки ── */
.social-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s, opacity 0.2s, transform 0.15s;
  cursor: pointer;
}

.social-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.social-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.social-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.google-btn {
  background: var(--bg-secondary);
  color: var(--text);
  border: 1px solid var(--border);
}

.google-btn:hover:not(:disabled) {
  background: var(--input-bg);
  border-color: var(--accent);
}

/* ── Demo кнопка ── */
.demo-btn {
  background: var(--bg-secondary);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 13px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s, opacity 0.2s;
}

.demo-btn:hover:not(:disabled) {
  background: var(--border);
}

.demo-btn:disabled {
  opacity: 0.6;
}
</style>