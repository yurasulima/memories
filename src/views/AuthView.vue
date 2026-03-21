<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useGroupsStore } from '@/stores/group'
import type { MemoriesRegisterRequest } from '@/api/models'
import IconHeart from '../components/icons/IconHeart.vue'
import IconEye from '../components/icons/IconEye.vue'
import IconEyeOff from '../components/icons/IconEyeOff.vue'
import type { AxiosError } from 'axios'

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
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <IconHeart :size="32" :filled="true" />
        <h1>Memories</h1>
      </div>

      <div class="auth-tabs">
        <button :class="{ active: tab === 'login' }" @click="tab = 'login'">{{ $t('auth.login') }}</button>
        <button :class="{ active: tab === 'register' }" @click="tab = 'register'">{{ $t('auth.register') }}</button>
      </div>

      <form @submit.prevent="submit" class="auth-form">
        <div v-if="tab === 'register'" class="field">
          <label>{{ $t('auth.fullName') }}</label>
          <input v-model="form.fullName" type="text" :placeholder="$t('auth.fullNamePlaceholder')" required />
        </div>
        <div v-if="tab === 'register'" class="field">
          <label>{{ $t('auth.username') }}</label>
          <input v-model="form.username" type="text" placeholder="username" required />
        </div>
        <div class="field">
          <label>{{ $t('auth.email') }}</label>
          <input v-model="form.email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="field">
          <label>{{ $t('auth.password') }}</label>
          <div class="password-wrap">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required />
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              <IconEye v-if="!showPass" :size="18" />
              <IconEyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading">{{ $t('auth.loading') }}</span>
          <span v-else>{{ tab === 'login' ? $t('auth.submitLogin') : $t('auth.submitRegister') }}</span>
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

.field input:focus { border-color: var(--accent); }

.password-wrap { position: relative; }
.password-wrap input { width: 100%; padding-right: 42px; }

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

.submit-btn:hover:not(:disabled) { background: var(--accent-hover); }
.submit-btn:disabled { opacity: 0.6; }

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

.demo-btn:hover:not(:disabled) { background: var(--border); }
.demo-btn:disabled { opacity: 0.6; }
</style>