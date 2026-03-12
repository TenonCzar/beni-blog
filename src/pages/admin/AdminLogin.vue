<template>
  <div class="min-h-screen bg-white flex">
    <!-- Left panel -->
    <div class="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center p-16">
      <div class="text-center space-y-4">
        <h1 class="font-display text-6xl font-light text-white tracking-widest">Maison</h1>
        <div class="w-8 h-px bg-[#FF6A00] mx-auto"></div>
        <p class="font-mono text-xs text-neutral-400 tracking-widest uppercase">Admin Panel</p>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center px-8 py-16">
      <div class="w-full max-w-sm">
        <div class="mb-10">
          <p class="section-label mb-2">Welcome back</p>
          <h2 class="font-display text-4xl font-light">Sign in</h2>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Username</label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="admin"
              class="w-full border border-neutral-200 px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>

          <div>
            <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full border border-neutral-200 px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>

          <p v-if="error" class="text-red-500 text-xs font-mono">{{ error }}</p>

          <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center gap-2">
            <span v-if="loading" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-neutral-100">
          <RouterLink to="/" class="font-mono text-xs text-neutral-400 hover:text-[#FF6A00] transition-colors tracking-widest uppercase">
            ← Back to Site
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, loading } = useApi()
const { setToken } = useAuth()

const form = reactive({ username: '', password: '' })
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    const data = await login(form)
    setToken(data.token)
    router.push({ name: 'admin-dashboard' })
  } catch (e) {
    error.value = e.message || 'Invalid credentials'
  }
}
</script>
